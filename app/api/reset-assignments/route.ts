/**
 * API Route: Reset Assignments
 * POST /api/reset-assignments
 * 
 * Clears the current assignment, forcing a new random assignment
 * to be generated on the next reveal or send request.
 * 
 * This is useful for:
 * - Testing different random assignments
 * - Starting fresh without restarting the server
 * - Development and debugging
 * 
 * SECURITY NOTE: In production, you may want to protect this endpoint
 * with authentication or disable it entirely.
 */

import { NextResponse } from 'next/server';
import { clearAssignment, hasAssignment } from '@/lib/storage';

export async function POST() {
  try {
    const hadAssignment = hasAssignment();
    
    // Clear the current assignment
    clearAssignment();
    
    console.log('🔄 Assignment cleared. A new random assignment will be generated on next request.');
    
    return NextResponse.json({
      ok: true,
      message: hadAssignment 
        ? 'Assignment cleared successfully. A new random assignment will be generated on next reveal or send.'
        : 'No assignment existed. A new random assignment will be generated on next reveal or send.',
    });
  } catch (error) {
    console.error('Error in /api/reset-assignments:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to reset assignments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

