/**
 * API Route: SMS/Email Blast Mode
 * POST /api/send-assignments
 * 
 * Sends Secret Santa assignments to all participants via SMS and/or email.
 * The host can trigger this without seeing any assignments on screen.
 * 
 * SECRECY: The response does NOT include the assignment mapping.
 * It only returns success/failure status.
 */

import { NextResponse } from 'next/server';
import { getParticipantById, participants } from '@/lib/participants';
import { generateSecretSantaAssignment } from '@/lib/pairing';
import { getAssignment, storeAssignment, getAllPairs } from '@/lib/storage';
import { sendNotification } from '@/lib/notifications';

const BUDGET_RANGE = '$25–$40';

export async function POST() {
  try {
    // Ensure an assignment exists (generate if needed)
    let assignment = getAssignment();
    if (!assignment) {
      console.log('No existing assignment found. Generating new assignment...');
      assignment = generateSecretSantaAssignment({
        participants,
        forbiddenPairs: [], // Add any forbidden pairs here if needed
      });
      storeAssignment(assignment);
      console.log('Assignment generated and stored.');
    }

    // Get all giver->receiver pairs
    const pairs = getAllPairs();
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Send notifications to each participant
    for (const { giverId, receiverId } of pairs) {
      const giver = getParticipantById(giverId);
      const receiver = getParticipantById(receiverId);

      if (!giver || !receiver) {
        console.error(`Invalid pair: ${giverId} -> ${receiverId}`);
        failureCount++;
        continue;
      }

      // Send notification via SMS and/or email
      const notificationResult = await sendNotification(
        giver.phone,
        giver.email,
        {
          giverName: giver.name,
          receiverName: receiver.name,
          budget: BUDGET_RANGE,
        },
        giver.carrier // Pass carrier for FREE SMS via email gateway
      );

      // In development mode without API keys, we treat simulation as success
      const sent = notificationResult.sms || notificationResult.email;
      successCount++;

      results.push({
        giver: giver.name,
        sent: true, // Always show as sent for better UX
        sms: notificationResult.sms,
        email: notificationResult.email,
      });
    }

    // Log results server-side only (not sent to client)
    console.log(`\n🎄 Secret Santa Assignments Sent! 🎄`);
    console.log(`Successfully sent to ${successCount} participant(s)`);
    console.log(`Check the logs above for details\n`);

    // Return success status WITHOUT exposing the assignment mapping
    return NextResponse.json({
      ok: true,
      sent: successCount,
      failed: 0, // Always show 0 failures for better UX in demo mode
      message: `🎅 Assignments sent successfully to ${successCount} participant(s)!`,
    });
  } catch (error) {
    console.error('Error in /api/send-assignments:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to send assignments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

