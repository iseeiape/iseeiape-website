import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read automation logs and data
    const automationDir = path.join(process.cwd(), 'content/automation')
    const neoCryptoDir = path.join(process.cwd(), 'neo-crypto/data')
    
    // Get latest schedule file
    const outputDir = path.join(automationDir, 'output')
    const files = await fs.readdir(outputDir)
    const scheduleFiles = files.filter(f => f.startsWith('enhanced_schedule_') && f.endsWith('.json'))
    
    let latestSchedule = null
    let totalPostsGenerated = 0
    let totalPostsPosted = 0
    let recentActivity = []
    
    if (scheduleFiles.length > 0) {
      // Sort by timestamp (newest first)
      scheduleFiles.sort((a, b) => {
        const aMatch = a.match(/enhanced_schedule_(\d+)\.json/)
        const bMatch = b.match(/enhanced_schedule_(\d+)\.json/)
        const aTime = aMatch ? parseInt(aMatch[1]) : 0
        const bTime = bMatch ? parseInt(bMatch[1]) : 0
        return bTime - aTime
      })
      
      const latestFile = scheduleFiles[0]
      const filePath = path.join(outputDir, latestFile)
      const content = await fs.readFile(filePath, 'utf8')
      latestSchedule = JSON.parse(content)
      
      // Calculate metrics from schedule
      totalPostsGenerated = latestSchedule.scheduledPosts.length
      totalPostsPosted = latestSchedule.scheduledPosts.filter((p: any) => p.posted).length
      
      // Create recent activity from schedule
      recentActivity = latestSchedule.scheduledPosts.slice(0, 5).map((post: any, index: number) => ({
        id: index + 1,
        type: post.type,
        time: new Date(post.generatedAt).toLocaleTimeString(),
        status: post.posted ? 'posted' : post.status || 'pending',
        quality: post.qualityScore || 0
      }))
    }
    
    // Get posted schedules from archive
    const archiveDir = path.join(automationDir, 'archive')
    let archiveFiles: string[] = []
    try {
      archiveFiles = await fs.readdir(archiveDir)
    } catch (error) {
      // Archive directory might not exist yet
    }
    
    const postedSchedules = archiveFiles.filter(f => f.startsWith('posted_enhanced_schedule_'))
    totalPostsPosted += postedSchedules.length * 4 // Approximate 4 posts per schedule
    
    // Get system health from logs
    const logDir = path.join(automationDir, 'logs')
    let cronLog = ''
    try {
      cronLog = await fs.readFile(path.join(logDir, 'cron-execution.log'), 'utf8')
    } catch (error) {
      // Log file might not exist yet
    }
    
    const logLines = cronLog.trim().split('\n').filter(line => line.trim())
    const lastExecutionLine = logLines[logLines.length - 1] || ''
    
    // Parse last execution time
    let lastExecution = 'Never'
    if (lastExecutionLine) {
      const parts = lastExecutionLine.split(' | ')
      if (parts.length >= 1) {
        lastExecution = parts[0]
      }
    }
    
    // Check if data file exists and is recent
    let dataFetcherStatus = 'operational'
    try {
      const dataPath = path.join(neoCryptoDir, 'enhanced-live-data.json')
      const stats = await fs.stat(dataPath)
      const ageMs = Date.now() - stats.mtimeMs
      
      if (ageMs > 10 * 60 * 1000) { // Older than 10 minutes
        dataFetcherStatus = 'stale'
      } else if (ageMs > 30 * 60 * 1000) { // Older than 30 minutes
        dataFetcherStatus = 'error'
      }
    } catch (error) {
      dataFetcherStatus = 'error'
    }
    
    // Calculate average quality score
    let averageQualityScore = 75
    if (latestSchedule && latestSchedule.summary && latestSchedule.summary.averageScore) {
      averageQualityScore = latestSchedule.summary.averageScore
    }
    
    // Prepare response
    const response = {
      systemStatus: 'operational',
      lastExecution,
      nextExecution: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      metrics: {
        totalPostsGenerated: totalPostsGenerated + (postedSchedules.length * 4),
        totalPostsPosted,
        averageQualityScore: Math.round(averageQualityScore * 10) / 10,
        engagementRate: 4.2, // Placeholder - would come from analytics
        errorRate: 2.1 // Placeholder
      },
      recentActivity,
      scheduledPosts: [
        { id: 1, type: 'trend-alert', scheduledTime: '09:00', status: 'pending' },
        { id: 2, type: 'market-update', scheduledTime: '12:00', status: 'pending' },
        { id: 3, type: 'educational', scheduledTime: '15:00', status: 'pending' },
        { id: 4, type: 'technical-analysis', scheduledTime: '18:00', status: 'pending' }
      ],
      systemHealth: {
        dataFetcher: dataFetcherStatus,
        contentGenerator: latestSchedule ? 'operational' : 'unknown',
        twitterPoster: 'operational', // Would check bird CLI
        cronScheduler: logLines.length > 0 ? 'operational' : 'unknown'
      },
      timestamp: new Date().toISOString()
    }
    
    res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching automation status:', error)
    res.status(500).json({ 
      error: 'Failed to fetch automation status',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}