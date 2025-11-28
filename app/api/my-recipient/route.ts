/**
 * API Route: Individual Reveal Mode
 * GET /api/my-recipient?giverId=<participantId>
 * 
 * Returns the Secret Santa recipient for a specific giver.
 * This endpoint only reveals ONE assignment at a time, maintaining secrecy.
 * 
 * SECRECY: Never return the full assignment mapping.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getParticipantById, participants } from '@/lib/participants';
import { generateSecretSantaAssignment } from '@/lib/pairing';
import { getAssignment, storeAssignment, getReceiverForGiver } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    // Get the giver ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const giverId = searchParams.get('giverId');

    if (!giverId) {
      return NextResponse.json(
        { error: 'Missing giverId parameter' },
        { status: 400 }
      );
    }

    // Validate that the giver exists
    const giver = getParticipantById(giverId);
    if (!giver) {
      return NextResponse.json(
        { error: 'Invalid participant ID' },
        { status: 404 }
      );
    }

    // Ensure an assignment exists (generate if needed)
    let assignment = getAssignment();
    if (!assignment) {
      // Generate a new assignment if one doesn't exist
      assignment = generateSecretSantaAssignment({
        participants,
        forbiddenPairs: [], // Add any forbidden pairs here if needed
      });
      storeAssignment(assignment);
    }

    // Get the receiver for this giver
    const receiverId = getReceiverForGiver(giverId);
    if (!receiverId) {
      return NextResponse.json(
        { error: 'No assignment found for this participant' },
        { status: 404 }
      );
    }

    const receiver = getParticipantById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: 'Invalid receiver assignment' },
        { status: 500 }
      );
    }

    // Return only the giver's name and their receiver's name
    // Do NOT expose the full assignment or any internal logic
    return NextResponse.json({
      giver: giver.name,
      receiver: receiver.name,
    });
  } catch (error) {
    console.error('Error in /api/my-recipient:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve assignment' },
      { status: 500 }
    );
  }
}

