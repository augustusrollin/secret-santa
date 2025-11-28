/**
 * Participant data and types for Secret Santa 2025
 * 
 * NOTE: The familyGroup property is used internally for pairing constraints only.
 * This detail is NEVER exposed to users in the UI or API responses.
 */

import { CarrierName } from './notifications';

export type FamilyGroup = 'Rollin' | 'Cousins';

export interface Participant {
  id: string;             // Unique identifier (lowercase, no spaces)
  name: string;           // Display name
  familyGroup: FamilyGroup; // Internal use only - for pairing constraints
  phone?: string;         // Optional phone for SMS notifications
  carrier?: CarrierName;  // Optional carrier for FREE SMS via email gateway!
  email?: string;         // Optional email for email notifications
}

/**
 * All participants in Secret Santa 2025
 * 
 * Contact information is provided for testing purposes.
 * The familyGroup field determines pairing constraints internally.
 * 
 * For FREE SMS: Add carrier info (e.g., carrier: 'verizon')
 * Supported carriers: verizon, att, tmobile, sprint, us-cellular, boost, cricket, metropcs
 */
export const participants: Participant[] = [
  {
    id: 'augustus',
    name: 'Augustus',
    familyGroup: 'Rollin',
    phone: '9784932081',
    carrier: 'att', // AT&T - FREE SMS via email gateway!
    email: 'pikachu@reactsoftwareinc.com',
  },
  {
    id: 'genevieve',
    name: 'Genevieve',
    familyGroup: 'Rollin',
    phone: undefined, // Placeholder - to be filled in later
    carrier: undefined,
    email: undefined,
  },
  {
    id: 'portia',
    name: 'Portia',
    familyGroup: 'Rollin',
    phone: undefined,
    carrier: undefined,
    email: undefined,
  },
  {
    id: 'ethan',
    name: 'Ethan',
    familyGroup: 'Cousins',
    phone: undefined,
    carrier: undefined,
    email: undefined,
  },
  {
    id: 'lucas',
    name: 'Lucas',
    familyGroup: 'Cousins',
    phone: undefined,
    carrier: undefined,
    email: undefined,
  },
  {
    id: 'blake',
    name: 'Blake',
    familyGroup: 'Cousins',
    phone: undefined,
    carrier: undefined,
    email: undefined,
  },
];

/**
 * Helper function to get a participant by ID
 */
export function getParticipantById(id: string): Participant | undefined {
  return participants.find(p => p.id === id);
}

/**
 * Helper function to get all participant IDs
 */
export function getAllParticipantIds(): string[] {
  return participants.map(p => p.id);
}

/**
 * Helper function to get all participant names (for display)
 */
export function getAllParticipantNames(): string[] {
  return participants.map(p => p.name);
}

