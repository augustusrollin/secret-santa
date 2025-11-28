/**
 * Notification module for sending Secret Santa assignments via SMS and Email
 * 
 * FREE OPTIONS:
 * 
 * 1. EMAIL (Resend - FREE TIER):
 *    - Sign up at https://resend.com (no credit card needed)
 *    - Get your API key from the dashboard
 *    - Set RESEND_API_KEY in .env.local
 *    - Free tier: 3,000 emails/month, 100/day
 * 
 * 2. SMS (Email-to-SMS Gateway - COMPLETELY FREE):
 *    - Uses carrier email gateways (no API key needed!)
 *    - Store phone numbers with carrier info
 *    - Format: phonenumber@carrier-gateway.com
 *    - Examples:
 *      - Verizon: 5551234567@vtext.com
 *      - AT&T: 5551234567@txt.att.net
 *      - T-Mobile: 5551234567@tmomail.net
 *      - Sprint: 5551234567@messaging.sprintpcs.com
 * 
 * Environment variables:
 * - RESEND_API_KEY (for email - get free at resend.com)
 * - FROM_EMAIL (your verified sender email, e.g., onboarding@resend.dev for testing)
 */

import { Resend } from 'resend';

export interface NotificationMessage {
  giverName: string;
  receiverName: string;
  budget: string;
}

/**
 * Carrier email gateways for SMS (completely free!)
 */
export const SMS_CARRIERS = {
  verizon: '@vtext.com',
  att: '@txt.att.net',
  tmobile: '@tmomail.net',
  sprint: '@messaging.sprintpcs.com',
  'us-cellular': '@email.uscc.net',
  boost: '@sms.myboostmobile.com',
  cricket: '@sms.cricketwireless.net',
  metropcs: '@mymetropcs.com',
} as const;

export type CarrierName = keyof typeof SMS_CARRIERS;

/**
 * Formats a Secret Santa notification message
 */
export function formatMessage(message: NotificationMessage): string {
  return `Hi ${message.giverName}! Your Secret Santa recipient is ${message.receiverName}. Budget is ${message.budget}. Merry Christmas! 🎄`;
}

/**
 * Sends an SMS notification using email-to-SMS gateway (FREE!)
 * 
 * @param phoneNumber - Recipient's phone number (10 digits)
 * @param carrier - Carrier name (e.g., 'verizon', 'att', 'tmobile')
 * @param message - Message content (keep under 160 chars for SMS)
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function sendSMS(
  phoneNumber: string,
  carrier: CarrierName,
  message: string
): Promise<boolean> {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Build email address for SMS gateway
  const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  const smsEmail = `${cleanPhone}${SMS_CARRIERS[carrier]}`;
  
  // Use email function to send to SMS gateway
  const success = await sendEmail(
    smsEmail,
    '', // SMS gateways ignore subject
    message.substring(0, 160) // SMS limit
  );
  
  if (success && isDevelopment) {
    console.log(`📱 SMS sent via email gateway to ${phoneNumber} (${carrier})`);
  }
  
  return success;
}

/**
 * Legacy SMS function for backward compatibility
 * Uses simulated sending in development
 */
export async function sendSMSLegacy(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    // In development, simulate successful send with detailed logging
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 SMS (SIMULATED - Use carrier info for real SMS)');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log('ℹ️  TIP: Add carrier info to use free email-to-SMS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  } else {
    console.warn('SMS not configured. Add carrier info to use email-to-SMS gateway.');
    return false;
  }
}

/**
 * Sends an email notification using Resend (FREE!)
 * 
 * @param emailAddress - Recipient's email address
 * @param subject - Email subject
 * @param message - Email body
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function sendEmail(
  emailAddress: string,
  subject: string,
  message: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (!apiKey) {
    if (isDevelopment) {
      // In development, simulate successful send with detailed logging
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 EMAIL (SIMULATED - Get free API key at resend.com)');
      console.log(`To: ${emailAddress}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log('ℹ️  Sign up at https://resend.com for 3,000 free emails/month!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return true; // Return true in development for demo purposes
    } else {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return false;
    }
  }

  try {
    const resend = new Resend(apiKey);
    
    await resend.emails.send({
      from: fromEmail,
      to: emailAddress,
      subject: subject,
      text: message,
    });
    
    console.log(`✅ EMAIL sent to ${emailAddress}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${emailAddress}:`, error);
    return false;
  }
}

/**
 * Sends a Secret Santa assignment to a participant via SMS and/or email
 * 
 * @param phone - Optional phone number for SMS
 * @param email - Optional email address
 * @param message - Notification message content
 * @param carrier - Optional carrier for SMS gateway (enables FREE SMS!)
 * @returns Promise with results for SMS and email sends
 */
export async function sendNotification(
  phone: string | undefined,
  email: string | undefined,
  message: NotificationMessage,
  carrier?: CarrierName
): Promise<{ sms: boolean; email: boolean }> {
  const formattedMessage = formatMessage(message);
  
  const results = {
    sms: false,
    email: false,
  };

  // Send SMS if phone number is provided
  if (phone) {
    if (carrier) {
      // Use free email-to-SMS gateway
      results.sms = await sendSMS(phone, carrier, formattedMessage);
    } else {
      // Use legacy simulated SMS
      results.sms = await sendSMSLegacy(phone, formattedMessage);
    }
  }

  // Send email if email address is provided
  if (email) {
    results.email = await sendEmail(
      email,
      '🎅 Your Secret Santa Assignment 2025',
      formattedMessage
    );
  }

  return results;
}

