// Utility function to generate Cielo Finance profile URLs
export function getCieloProfileUrl(walletAddress: string): string {
  return `https://app.cielo.finance/profile/${walletAddress}?ref_code=iseeiape`;
}

// Utility function to generate Cielo Finance token/trading URLs
export function getCieloTokenUrl(tokenAddress: string): string {
  return `https://app.cielo.finance/trading/${tokenAddress}?ref_code=iseeiape`;
}

// Format wallet address for display
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Check if string is a valid Solana address
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
