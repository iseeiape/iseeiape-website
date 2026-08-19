#!/usr/bin/env node
/**
 * Website Health Check — runs every 6h via system crontab.
 *
 * Night shift 2026-08-18: added deploy-drift guard.
 * The 8:30 Vercel cron builds from the LOCAL working tree, not git. When the
 * checkout sits on a feature branch (or local main falls behind origin/main),
 * pages pushed to origin/main by the worktree-based publish_file() are missing
 * from the local disk → Vercel ships a stale build → 404s in production.
 * The guard detects this, self-heals by restoring origin/main, and alerts.
 */

const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);
const REPO_DIR = path.dirname(__dirname);
const DRIFT_STATE = path.join(REPO_DIR, 'logs', '.deploy-drift-state.json');

// Telegram alert (Wolf bot — same token as wolf_telegram_alerts.py).
// Token resolution: env var → ~/.openclaw/.env (read-only; same file the 8:30
// Vercel deploy cron greps). Empty fallback keeps the script silent (no alert)
// if neither is available — never crash the health check.
function resolveEnv(name) {
  if (process.env[name]) return process.env[name];
  try {
    const envPath = require('os').homedir() + '/.openclaw/.env';
    const line = require('fs').readFileSync(envPath, 'utf8')
      .split('\n').find(l => l.startsWith(name + '='));
    return line ? line.slice(name.length + 1).trim() : '';
  } catch (e) { return ''; }
}
const TG_BOT = resolveEnv('WOLF_TELEGRAM_BOT_TOKEN');
const TG_CHAT = resolveEnv('WOLF_TELEGRAM_CHAT_ID') || '120001865';

async function sendTelegramAlert(message) {
  if (!TG_BOT) { console.log('  ⚠️  No WOLF_TELEGRAM_BOT_TOKEN — alert skipped'); return false; }
  return new Promise((resolve) => {
    try {
      const data = JSON.stringify({ chat_id: TG_CHAT, text: message, disable_web_page_preview: true });
      const req = https.request({
        hostname: 'api.telegram.org',
        path: `/bot${TG_BOT}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
        timeout: 10000,
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          const ok = res.statusCode >= 200 && res.statusCode < 300;
          console.log(ok ? '  📨 Telegram alert sent' : `  ⚠️  Telegram alert HTTP ${res.statusCode}`);
          resolve(ok);
        });
      });
      req.on('error', (e) => { console.log(`  ⚠️  Telegram alert error: ${e.message}`); resolve(false); });
      req.write(data);
      req.end();
    } catch (e) { console.log(`  ⚠️  Telegram alert error: ${e.message}`); resolve(false); }
  });
}

async function checkDeployDrift() {
  console.log('  📦 Checking deploy drift (local vs origin/main)...');
  try {
    // Fetch latest
    await execAsync('git fetch origin main -q', { cwd: REPO_DIR });

    // Check current branch
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: REPO_DIR });

    // Get tracked-file diff (ignore untracked data/ churn from scanner/export crons)
    const { stdout: diffOut } = await execAsync(
      'git diff --name-only --diff-filter=ADMR HEAD origin/main -- . ":(exclude)data/" ":(exclude)logs/"',
      { cwd: REPO_DIR }
    );
    const missingFiles = diffOut.trim().split('\n').filter(f => f && !fs.existsSync(path.join(REPO_DIR, f)));

    // Check if local main is behind origin/main
    const { stdout: localSha } = await execAsync('git rev-parse HEAD', { cwd: REPO_DIR });
    const { stdout: remoteSha } = await execAsync('git rev-parse origin/main', { cwd: REPO_DIR });
    const isBehind = localSha.trim() !== remoteSha.trim();

    // Night shift 2026-08-20: being behind alone is NOT drift. Scanner/export
    // crons push to origin/main every 15-60 min via worktrees; local main always
    // lags between guard ticks. "Behind + on main + zero missing files" is the
    // normal steady state — the pull below silently catches up (it still matters
    // for the 8:30 Vercel build, which ships the local tree). Only wrong-branch
    // or missing-files states are real drift worth a Telegram alert.
    const realDrift = missingFiles.length > 0 || branch.trim() !== 'main';

    if (branch.trim() !== 'main') {
      console.log(`  ⚠️  Checkout on branch '${branch.trim()}' (not main) — deploy will build stale tree`);
    }

    if (missingFiles.length === 0 && branch.trim() === 'main' && !isBehind) {
      console.log('  ✅ No deploy drift — local main matches origin/main');
      return;
    }

    // Routine catch-up (on main, nothing missing): fast-forward quietly, no alert.
    if (!realDrift && isBehind) {
      try {
        // Same data/ churn discard as below — pull refuses to ff when a locally
        // modified data/ file also changed between HEAD and origin/main (which
        // the scanner crons guarantee). data/ files are disposable churn.
        try { await execAsync('git checkout -- data/ 2>/dev/null; git reset -q -- data/', { cwd: REPO_DIR }); } catch (e) {}
        await execAsync('git pull --ff-only origin main', { cwd: REPO_DIR });
        const { stdout: newSha } = await execAsync('git rev-parse HEAD', { cwd: REPO_DIR });
        console.log(newSha.trim() === remoteSha.trim()
          ? `  ✅ Caught up to origin/main (${remoteSha.trim().slice(0, 7)}) — routine, no drift`
          : `  ⚠️  Catch-up incomplete — will retry next tick`);
      } catch (e) {
        console.log(`  ⚠️  Catch-up pull failed: ${e.message.split('\n')[0]} — will retry next tick`);
      }
      return;
    }

    // REAL DRIFT — self-heal + alert
    console.log(`  🔧 Drift detected: ${missingFiles.length} missing files, branch=${branch.trim()}, behind=${isBehind}`);
    console.log(`     Missing: ${missingFiles.slice(0, 5).join(', ')}${missingFiles.length > 5 ? ' ...' : ''}`);

    // Discard local data/ churn (scanner/export crons rewrite these every
    // 15-60 min and push via worktree — local copies are disposable).
    // NUKES any in-progress merge state on data/ files too. Never touches
    // code/content files: modified non-data files stay modified after the
    // pull (git merge doesn't need a clean tree for them unless the pull
    // changes the same file — in that case pull fails → "incomplete" alert).
    try { await execAsync('git checkout -- data/ 2>/dev/null; git reset -q -- data/', { cwd: REPO_DIR }); } catch (e) {}
    try { await execAsync('git merge --abort', { cwd: REPO_DIR }); } catch (e) { /* no merge in progress */ }

    // Remove untracked files that collide with incoming origin/main files,
    // but ONLY if byte-identical (content already in git — deleting is lossless).
    // Non-identical collisions are left alone → pull fails → "incomplete" alert (human call).
    for (const f of missingFiles) {
      const localPath = path.join(REPO_DIR, f);
      if (fs.existsSync(localPath)) {
        try { fs.unlinkSync(localPath); } catch (e) {}
      }
    }
    // Untracked files NOT in the diff can still collide with checkout/pull
    // (e.g. yesterday's insight page generated locally AND pushed via worktree).
    // Remove ONLY byte-identical dupes (content already in origin/main — lossless).
    // Non-identical collisions are left → pull fails → "incomplete" alert (human call).
    // Paths limited to safe charset; anything exotic is skipped untouched.
    const { stdout: untrackedOut } = await execAsync('git ls-files --others --exclude-standard', { cwd: REPO_DIR });
    for (const f of untrackedOut.trim().split('\n').filter(Boolean).slice(0, 200)) {
      if (!/^[a-zA-Z0-9._\/-]+$/.test(f)) continue;
      try {
        // throws (exit 1) when the file is NOT in origin/main → keep, no collision
        await execAsync(`git cat-file -e "origin/main:${f}"`, { cwd: REPO_DIR });
        const remote = await execAsync(`git show "origin/main:${f}"`, { cwd: REPO_DIR, maxBuffer: 20 * 1024 * 1024 });
        const local = fs.readFileSync(path.join(REPO_DIR, f), 'utf8');
        if (local === remote.stdout) {
          fs.unlinkSync(path.join(REPO_DIR, f));
          console.log(`     Removed identical untracked dupe: ${f}`);
        }
      } catch (e) { /* not in origin/main or unreadable — keep file */ }
    }

    // Checkout main and fast-forward to origin/main
    if (branch.trim() !== 'main') {
      await execAsync('git checkout main', { cwd: REPO_DIR });
    }
    await execAsync('git pull --ff-only origin main', { cwd: REPO_DIR });

    // Verify
    const { stdout: newSha } = await execAsync('git rev-parse HEAD', { cwd: REPO_DIR });
    const healed = newSha.trim() === remoteSha.trim();
    console.log(healed ? `  ✅ Self-healed: checkout restored to origin/main (${remoteSha.trim().slice(0, 7)})` : `  ⚠️  Self-heal incomplete — manual intervention needed`);

    // Alert once per drift episode (not every 6h tick). State only records
    // an episode after a SUCCESSFUL alert send — a failed send retries next tick.
    let lastAlert = null;
    try { lastAlert = JSON.parse(fs.readFileSync(DRIFT_STATE, 'utf8')); } catch (e) {}
    const episodeKey = remoteSha.trim();
    if (!lastAlert || lastAlert.episode !== episodeKey) {
      const msg = `🐺 Deploy Drift Fixed\n\nBranch was: ${branch.trim()}\nMissing: ${missingFiles.length} files\n${missingFiles.slice(0, 3).map(f => '• ' + f).join('\n')}\n\nSelf-healed to origin/main ${remoteSha.trim().slice(0, 7)}\nNext 8:30 Vercel deploy will include the missing pages.`;
      const sent = await sendTelegramAlert(msg);
      if (sent) {
        fs.mkdirSync(path.dirname(DRIFT_STATE), { recursive: true });
        fs.writeFileSync(DRIFT_STATE, JSON.stringify({ episode: episodeKey, healed_at: new Date().toISOString() }));
      }
    }
  } catch (error) {
    console.log(`  ❌ Deploy drift check failed: ${error.message}`);
  }
}

async function checkWebsite() {
  console.log('🏥 Checking website health...');
  
  const checks = [
    { name: 'Main Site', url: 'https://iseeiape.com' },
    { name: 'API Health', url: 'https://iseeiape.com/api/health' },
    { name: 'Dashboard', url: 'https://iseeiape.com/dashboard-enhanced-v3' }
  ];
  
  for (const check of checks) {
    try {
      const response = await fetch(check.url);
      const status = response.status;
      
      if (status >= 200 && status < 300) {
        console.log(`  ✅ ${check.name}: HTTP ${status}`);
      } else {
        console.log(`  ⚠️  ${check.name}: HTTP ${status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${check.name}: ${error.message}`);
    }
  }
  
  // Check disk space
  try {
    const { stdout } = await execAsync('df -h . | tail -1');
    console.log(`  💾 Disk: ${stdout.trim()}`);
  } catch (error) {
    console.log(`  ⚠️  Disk check failed: ${error.message}`);
  }
  
  // Check deploy drift (night shift 2026-08-18)
  await checkDeployDrift();

  console.log('✅ Health check completed');
}

checkWebsite().catch(console.error);
