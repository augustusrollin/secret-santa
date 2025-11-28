/**
 * Storage module for Secret Santa assignments
 * 
 * This module manages the persistence of Secret Santa assignments.
 * In a production environment, you might use a database or file storage.
 * For simplicity, this implementation uses in-memory storage.
 * 
 * IMPORTANT: The assignment should be generated ONCE and reused for:
 * - Individual reveal mode (each person sees their own assignment)
 * - SMS/Email blast mode (assignments are sent to everyone)
 * 
 * SECRECY: Never expose the full assignment mapping to clients.
 */

import { Assignment } from './pairing';

/**
 * In-memory storage for the current Secret Santa assignment
 * In production, this would be replaced with a database or persistent storage
 */
let currentAssignment: Assignment | null = null;

/**
 * Stores a Secret Santa assignment
 * This overwrites any existing assignment
 */
export function storeAssignment(assignment: Assignment): void {
  currentAssignment = assignment;
}

/**
 * Retrieves the current Secret Santa assignment
 * Returns null if no assignment has been generated yet
 */
export function getAssignment(): Assignment | null {
  return currentAssignment;
}

/**
 * Gets the receiver ID for a specific giver
 * Returns null if no assignment exists or giver not found
 * 
 * This is the PRIMARY method for revealing assignments - it only
 * exposes a single giver->receiver pair, maintaining secrecy.
 */
export function getReceiverForGiver(giverId: string): string | null {
  if (!currentAssignment) {
    return null;
  }
  return currentAssignment[giverId] || null;
}

/**
 * Checks if an assignment exists
 */
export function hasAssignment(): boolean {
  return currentAssignment !== null;
}

/**
 * Clears the current assignment
 * Useful for resetting or regenerating assignments
 */
export function clearAssignment(): void {
  currentAssignment = null;
}

/**
 * Gets all giver->receiver pairs as an array
 * Use with caution - this exposes the full assignment!
 * Should only be used server-side for sending notifications.
 */
export function getAllPairs(): Array<{ giverId: string; receiverId: string }> {
  if (!currentAssignment) {
    return [];
  }
  return Object.entries(currentAssignment).map(([giverId, receiverId]) => ({
    giverId,
    receiverId,
  }));
}

