/**
 * Secret Santa Pairing Algorithm
 * 
 * This module generates Secret Santa assignments with the following constraints:
 * 1. No self-assignment (giver cannot receive their own name)
 * 2. Cross-family assignment only (Rollin -> Cousins, Cousins -> Rollin)
 * 3. Custom forbidden pairs (optional, configurable)
 * 
 * The algorithm uses randomization with backtracking to find valid assignments.
 * If no valid assignment is possible, it will retry a limited number of times
 * before throwing an error.
 * 
 * SECRECY NOTE:
 * - The constraints and forbidden pairs are INTERNAL ONLY
 * - Never expose these rules in the UI or API responses
 * - Users should only see their own final assignment
 */

import { Participant } from './participants';

/**
 * A forbidden pairing: [giverId, receiverId]
 * The algorithm ensures these pairs never occur in the final assignment.
 */
export type ForbiddenPair = [giverId: string, receiverId: string];

/**
 * The result of the pairing algorithm: a map of giver ID to receiver ID
 */
export type Assignment = {
  [giverId: string]: string; // maps giverId -> receiverId
};

/**
 * Configuration for the pairing algorithm
 */
export interface PairingConfig {
  participants: Participant[];
  forbiddenPairs?: ForbiddenPair[];
  maxAttempts?: number; // Default: 1000
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if a giver->receiver assignment violates any constraints
 */
function isValidAssignment(
  giver: Participant,
  receiver: Participant,
  forbiddenPairs: ForbiddenPair[]
): boolean {
  // Constraint 1: No self-assignment
  if (giver.id === receiver.id) {
    return false;
  }

  // Constraint 2: Cross-family only
  if (giver.familyGroup === receiver.familyGroup) {
    return false;
  }

  // Constraint 3: Check forbidden pairs
  const isForbidden = forbiddenPairs.some(
    ([giverId, receiverId]) => giver.id === giverId && receiver.id === receiverId
  );
  if (isForbidden) {
    return false;
  }

  return true;
}

/**
 * Attempts to generate a valid Secret Santa assignment using backtracking
 * 
 * Algorithm:
 * 1. Create a list of potential receivers (all participants)
 * 2. Shuffle the givers for randomness
 * 3. For each giver, try to assign a valid receiver
 * 4. Use backtracking if we hit a dead end
 * 5. If successful, return the assignment
 * 
 * @param config - Configuration including participants and constraints
 * @returns Assignment object mapping giver IDs to receiver IDs
 * @throws Error if no valid assignment can be found after maxAttempts
 */
export function generateSecretSantaAssignment(config: PairingConfig): Assignment {
  const {
    participants,
    forbiddenPairs = [],
    maxAttempts = 1000,
  } = config;

  // Try multiple times to find a valid assignment
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const assignment = tryGenerateAssignment(participants, forbiddenPairs);
    if (assignment) {
      return assignment;
    }
  }

  // If we couldn't find a valid assignment after maxAttempts, throw an error
  throw new Error(
    `Unable to generate a valid Secret Santa assignment after ${maxAttempts} attempts. ` +
    `This may indicate that the constraints are too restrictive.`
  );
}

/**
 * Single attempt to generate an assignment using greedy backtracking
 */
function tryGenerateAssignment(
  participants: Participant[],
  forbiddenPairs: ForbiddenPair[]
): Assignment | null {
  const assignment: Assignment = {};
  const availableReceivers = new Set(participants.map(p => p.id));
  const shuffledGivers = shuffleArray(participants);

  // Try to assign each giver a receiver
  for (const giver of shuffledGivers) {
    const validReceivers = Array.from(availableReceivers)
      .map(receiverId => participants.find(p => p.id === receiverId)!)
      .filter(receiver => isValidAssignment(giver, receiver, forbiddenPairs));

    if (validReceivers.length === 0) {
      // Dead end - no valid receivers for this giver
      return null;
    }

    // Randomly pick one of the valid receivers
    const receiver = validReceivers[Math.floor(Math.random() * validReceivers.length)];
    assignment[giver.id] = receiver.id;
    availableReceivers.delete(receiver.id);
  }

  return assignment;
}

/**
 * Validates that an assignment satisfies all constraints
 * Useful for testing and verification
 */
export function validateAssignment(
  assignment: Assignment,
  participants: Participant[],
  forbiddenPairs: ForbiddenPair[] = []
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const participantMap = new Map(participants.map(p => [p.id, p]));
  const assignedReceivers = new Set<string>();

  // Check each giver->receiver pair
  for (const [giverId, receiverId] of Object.entries(assignment)) {
    const giver = participantMap.get(giverId);
    const receiver = participantMap.get(receiverId);

    if (!giver) {
      errors.push(`Unknown giver ID: ${giverId}`);
      continue;
    }
    if (!receiver) {
      errors.push(`Unknown receiver ID: ${receiverId}`);
      continue;
    }

    // Check for duplicate receivers
    if (assignedReceivers.has(receiverId)) {
      errors.push(`${receiver.name} is assigned to multiple givers`);
    }
    assignedReceivers.add(receiverId);

    // Validate constraints
    if (!isValidAssignment(giver, receiver, forbiddenPairs)) {
      if (giver.id === receiver.id) {
        errors.push(`${giver.name} is assigned to themselves`);
      } else if (giver.familyGroup === receiver.familyGroup) {
        errors.push(`${giver.name} and ${receiver.name} are in the same family`);
      } else {
        errors.push(`${giver.name} -> ${receiver.name} is a forbidden pair`);
      }
    }
  }

  // Check that all participants are assigned
  for (const participant of participants) {
    if (!assignment[participant.id]) {
      errors.push(`${participant.name} is not assigned a receiver`);
    }
    if (!assignedReceivers.has(participant.id)) {
      errors.push(`${participant.name} is not assigned as anyone's receiver`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

