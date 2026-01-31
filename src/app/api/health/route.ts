// Health check API
import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    website: true,
    api: true,
    version: '1.0.0'
  };
  
  return NextResponse.json(checks);
}
