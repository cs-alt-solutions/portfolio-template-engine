// src/actions/submitLead.ts
'use server';

import { supabase } from '@/utils/supabase';
import { Resend } from 'resend';

export interface LeadPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
}

export async function submitStorefrontLead(payload: LeadPayload) {
  try {
    // 1. DUAL-WRITE STEP A: Store in Supabase as Immutable Law
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

    // 2. DEFENSIVE GUARD: Verify API key exists before initializing SDK!
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ RESEND_API_KEY is missing. Lead was saved to Supabase, but email dispatch was skipped.');
      return { success: true, warning: 'Lead saved to database, but email dispatch skipped (missing API key).' };
    }

    // 3. DUAL-WRITE STEP B: Dispatch Notification via Centralized Domain
    const resend = new Resend(apiKey);
    const recipientEmail = payload.contactEmail || process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';

    const { error: mailError } = await resend.emails.send({
      // 🚀 ZERO-COST FIX: Send directly from any prefix on your master verified root domain!
      from: `${payload.businessName} Leads <leads@alternativesolutions.io>`,
      to: [recipientEmail],
      replyTo: payload.email,
      subject: `New Inquiry: ${payload.name} — ${payload.businessName}`,
      /* Note: Inline styles are strictly required here because email clients strip external stylesheets and CSS classes! */
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <!-- MAIN CARD CONTAINER -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-w: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7;">
                  
                  <!-- HEADER BLOCK -->
                  <tr>
                    <td style="background-color: #0f172a; padding: 32px 40px; text-align: left;">
                      <p style="margin: 0; color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Direct Quote Request</p>
                      <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${payload.businessName}</h1>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 40px;">
                      
                      <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
                        You have received a new potential project lead via your storefront. Simply reply directly to this email to respond to the client.
                      </p>

                      <!-- CLIENT CREDENTIALS BOX -->
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 20px;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="35%" style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Client Name</td>
                                <td width="65%" style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 700;">${payload.name}</td>
                              </tr>
                              <tr>
                                <td width="35%" style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</td>
                                <td width="65%" style="padding: 6px 0; font-size: 15px;">
                                  <a href="mailto:${payload.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${payload.email}</a>
                                </td>
                              </tr>
                              <tr>
                                <td width="35%" style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</td>
                                <td width="65%" style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${payload.phone || 'Not provided'}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- PROJECT DETAILS CALLOUT -->
                      <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Project Scope & Notes</p>
                      <div style="border-left: 4px solid #0ea5e9; background-color: #f0f9ff; padding: 20px; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0; color: #0c4a6e; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${payload.details}</p>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER WATERMARK -->
                  <tr>
                    <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 20px 40px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; font-weight: 600; color: #71717a; letter-spacing: 0.5px;">
                        POWERED BY ALTERNATIVE SOLUTIONS INFRASTRUCTURE
                      </p>
                      <p style="margin: 4px 0 0 0; font-size: 10px; color: #a1a1aa;">
                        Autonomous Lead Routing & Storage Network &bull; All Rights Reserved
                      </p>
                    </td>
                  </tr>

                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (mailError) {
      console.error('Resend Dispatch Failed:', mailError);
      return { success: true, warning: 'Lead logged to database, but email dispatch was delayed.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Lead Pipeline Error:', error);
    return { success: false, error: 'Transmission failed. Please try again.' };
  }
}