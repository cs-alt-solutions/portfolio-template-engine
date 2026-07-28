// src/actions/submitStagingAudit.ts
'use server';

import { supabase } from '@/utils/supabase';
import { Resend } from 'resend';

export interface StagingAuditPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  sectionNotes: Record<number, string>;
  completedSteps: number[];
  status: 'APPROVED' | 'CHANGES_REQUESTED';
}

export async function submitStagingAudit(payload: StagingAuditPayload) {
  try {
    const isApproved = payload.status === 'APPROVED';

    // 1. Log Audit in Supabase Ledger
    const { error: dbError } = await supabase
      .from('storefront_audits')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          business_name: payload.businessName,
          client_email: payload.contactEmail,
          audit_notes: JSON.stringify(payload.sectionNotes),
          status: isApproved ? 'APPROVED_PENDING_BILLING' : 'CHANGES_REQUESTED',
        },
      ]);

    if (dbError) {
      console.warn('Database Audit Insertion Notice:', dbError.message);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ RESEND_API_KEY is missing. Audit logged locally.');
      return { success: true, warning: 'Audit logged locally (missing API key).' };
    }

    const resend = new Resend(apiKey);
    const adminEmail = process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';
    const clientEmail = payload.contactEmail || adminEmail;

    const formattedNotes = Object.entries(payload.sectionNotes)
      .filter((entry) => Boolean(entry[1] && entry[1].trim()))
      .map(([step, note]) => `• Section ${Number(step) + 1}: "${note}"`)
      .join('\n') || (isApproved ? 'No specific adjustments requested. Build approved as-is!' : 'No written notes provided.');

    // 2. Email #1 -> To the Client (Dynamic Branching Receipt with "I" voice)
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: `Alternative Solutions Staging <staging@alternativesolutions.io>`,
      to: [clientEmail],
      subject: isApproved 
         ? `✨ Staging Approved: ${payload.businessName} (Next Steps For Launch!)` 
         : `🛠️ Adjustments Logged: ${payload.businessName} (I'm On It!)`,
      /* Note: Inline styles are strictly required inside HTML email strings because email clients strip external stylesheets! */
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-w: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e4e4e7;">
                  <tr>
                    <td style="background-color: ${isApproved ? '#065f46' : '#86198f'}; padding: 32px 40px; text-align: left;">
                      <p style="margin: 0; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                        ${isApproved ? 'Build Approved & Locked' : 'Adjustments Logged'}
                      </p>
                      <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800;">${payload.businessName}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
                        ${isApproved ? 'I Have Received Your Official Sign-Off!' : 'You Just Helped Make This Build 10x Better!'}
                      </h2>
                      <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
                        ${isApproved 
                           ? 'Thank you for taking the time to explore your staging canvas! I have logged your verified checkpoints and locked in this build for launch. You did awesome!' 
                           : 'Thank you for taking the time to explore your staging canvas! I have logged your section notes and I am jumping into the code to make your adjustments.'}
                      </p>
                      
                      <div style="background-color: ${isApproved ? '#f0fdf4' : '#fdf4ff'}; border: 1px solid ${isApproved ? '#bbf7d0' : '#f0abfc'}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                        <p style="margin: 0; color: ${isApproved ? '#166534' : '#86198f'}; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What happens next?</p>
                        <p style="margin: 8px 0 0 0; color: ${isApproved ? '#15803d' : '#a21caf'}; font-size: 14px; line-height: 1.5;">
                          ${isApproved 
                            ? 'Keep an eye on your inbox for your official activation email! Activating your hosting subscription gets your site live on the Alternative Solutions grid right away (Standard Plan).<br><br><strong>Selected the Professional Plan ($15/mo)?</strong><br>I will also start guiding you through securing your custom .com domain so I can handle the DNS wiring and get your personal web address live to the world!' 
                            : 'I am opening up the hood right now to work my magic on your wording adjustments and layout tweaks! Once I have everything looking pristine, I will send an updated link back your way for a final look. As soon as you give me the green light, I will get your hosting activated and push your storefront live!'}
                        </p>
                      </div>
                      <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Logged Section Notes:</p>
                      <div style="border-left: 4px solid ${isApproved ? '#10b981' : '#d946ef'}; background-color: #f8fafc; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${formattedNotes}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 20px 40px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; font-weight: 600; color: #71717a; letter-spacing: 0.5px;">POWERED BY ALTERNATIVE SOLUTIONS INFRASTRUCTURE</p>
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

    if (clientError) {
      console.error('❌ Resend Client Email Failed:', clientError);
    } else {
      console.log('✅ Client Receipt Dispatched:', clientData);
    }

    // 3. Email #2 -> To Alt Solutions Admin (Courtney)
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: `Staging Alert <staging@alternativesolutions.io>`,
      to: [adminEmail],
      subject: isApproved 
         ? `🚀 APPROVED ($5/mo or Pro Ready): ${payload.businessName}` 
         : `⚠️ ADJUSTMENTS REQUESTED: ${payload.businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #111827;">
          <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; background: #ffffff;">
            <h2 style="color: ${isApproved ? '#059669' : '#c026d3'}; margin-top: 0;">
              ${isApproved ? '✨ Client Walkthrough Approved!' : '🛠️ Client Requested Build Adjustments'}
            </h2>
            <p><strong>Client Name:</strong> ${payload.businessName}</p>
            <p><strong>Storefront Slug:</strong> ${payload.storefrontSlug}</p>
            <p><strong>Status:</strong> <span style="padding: 2px 8px; border-radius: 4px; background: ${isApproved ? '#d1fae5; color: #065f46' : '#fce7f3; color: #86198f'}; font-weight: bold;">${payload.status}</span></p>
            <p><strong>Client Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3 style="font-size: 16px; margin-bottom: 8px;">Logged Section Adjustments / Notes:</h3>
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 6px; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${formattedNotes}</pre>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 14px; color: #4b5563;">
              <strong>Action Required:</strong> ${isApproved 
                 ? 'Send the client their hosting activation link! If they chose the Professional Plan ($15/mo), begin guiding them through domain registrar selection and DNS setup.' 
                 : 'Review the copy adjustments above, apply them to the codebase, and notify the client once updated!'}
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (adminError) {
      console.error('❌ Resend Admin Alert Failed:', adminError);
    } else {
      console.log('✅ Admin Alert Dispatched:', adminData);
    }

    return { success: true };
  } catch (error) {
    console.error('Staging Audit Transmission Error:', error);
    return { success: false, error: 'Failed to transmit audit. Please try again.' };
  }
}