// src/actions/submitLead.ts
'use server';

import { supabase } from '@/utils/supabase';
import { Resend } from 'resend';
import {
  LeadPayload,
  parseLeadDetails,
  sanitizeHex,
} from './lead-emails/parseLeadDetails';
import { buildOwnerLeadEmail } from './lead-emails/buildOwnerEmail';
import { buildCustomerReceiptEmail } from './lead-emails/buildCustomerEmail';

export type { LeadPayload } from './lead-emails/parseLeadDetails';

export async function submitStorefrontLead(payload: LeadPayload) {
  try {
    // 1. LOG FULL RECORD TO SYSTEM LEDGER
    const { error: dbError } = await supabase
      .from('storefront_leads')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          client_name: payload.name,
          client_email: payload.email,
          client_phone: payload.phone || 'Not provided',
          project_details: payload.details,
          status: 'new',
        },
      ]);

    if (dbError) {
      console.error('Database Insertion Failed:', dbError);
      throw new Error('Failed to record inquiry in system ledger.');
    }

    // 2. DEFENSIVE GUARD
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is missing. Lead saved to DB, but email skipped.');
      return { success: true, warning: 'Lead saved, but email skipped.' };
    }

    const resend = new Resend(apiKey);
    const ownerEmail =
      payload.contactEmail ||
      process.env.FALLBACK_LEADS_EMAIL ||
      'support@alternativesolutions.io';

    const isLocal = process.env.NODE_ENV === 'development';
    const testEmail = process.env.LOCAL_TEST_EMAIL;
    const finalOwnerRecipient = isLocal && testEmail ? testEmail : ownerEmail;
    const finalLeadRecipient = isLocal && testEmail ? testEmail : payload.email;

    // 3. PARSE DETAILS & BUILD BOTH EMAILS
    const summary = parseLeadDetails(payload);
    const activeHex = sanitizeHex(payload.brandColorHex, '#0ea5e9');
    const cleanBizName = (payload.businessName || 'Storefront').replace(/[<>]/g, '');

    const ownerHtml = buildOwnerLeadEmail({
      payload,
      summary,
      accentHex: activeHex,
      isLocal,
      originalOwnerEmail: ownerEmail,
    });

    const customerHtml = buildCustomerReceiptEmail({
      payload,
      summary,
      accentHex: activeHex,
    });

    // 4. DISPATCH OWNER ALERT + CUSTOMER RECEIPT
    const [ownerRes, leadRes] = await Promise.all([
      resend.emails.send({
        from: `${cleanBizName} Leads <leads@alternativesolutions.io>`,
        to: [finalOwnerRecipient],
        replyTo: payload.email,
        subject: isLocal
          ? `[TEST] New ${summary.inquiryType}: ${payload.name}`
          : `New ${summary.inquiryType}: ${payload.name} — ${cleanBizName}`,
        html: ownerHtml,
      }),
      resend.emails.send({
        from: `${cleanBizName} <hello@alternativesolutions.io>`,
        to: [finalLeadRecipient],
        replyTo: ownerEmail,
        subject: isLocal
          ? `[TEST] Request Received: ${cleanBizName}`
          : `Request Received: ${cleanBizName}`,
        html: customerHtml,
      }),
    ]);

    if (ownerRes.error) console.error('Owner email error:', ownerRes.error);
    if (leadRes.error) console.error('Customer receipt email error:', leadRes.error);

    return { success: true };
  } catch (error) {
    console.error('Lead Pipeline Error:', error);
    return { success: false, error: 'Transmission failed. Please try again.' };
  }
}