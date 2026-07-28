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

    // Build an ironclad digital receipt for historical proof
    const historicalAuditTrail = {
      client_notes: payload.sectionNotes,
      verified_checkpoints: payload.completedSteps,
      total_sections_verified: `${payload.completedSteps.length} of 4 Sections Checked`,
      legal_signoff: isApproved 
        ? "Client explicitly verified all section checkpoints and locked in the build as-is for launch. No further complimentary revisions." 
        : "Client requested specific copy adjustments prior to launch approval.",
      logged_at: new Date().toISOString(),
    };

    // 1. Log Audit in Supabase Ledger
    const { error: dbError } = await supabase
      .from('storefront_audits')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          business_name: payload.businessName,
          client_email: payload.contactEmail,
          audit_notes: JSON.stringify(historicalAuditTrail, null, 2),
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

    // 2. Email #1 -> To the Client (Refined, Conversational, Boundary-Setting Receipt)
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: `Alternative Solutions Launchpad <staging@alternativesolutions.io>`,
      to: [clientEmail],
      subject: isApproved 
         ? `🚀 Build Approved! Next Steps to Launch ${payload.businessName}` 
         : `🛠️ Adjustments Logged for ${payload.businessName} (I'm On It!)`,
      /* Note: Inline styles are strictly required inside HTML email strings because email clients strip external stylesheets! */
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #18181b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5); border: 1px solid #27272a; text-align: left;">
                  
                  <!-- HEADER BLOCK: Softened typography, sentence case, distinct brand accent -->
                  <tr>
                    <td style="background-color: #18181b; padding: 32px 40px; border-bottom: 3px solid ${isApproved ? '#10b981' : '#d946ef'};">
                      <p style="margin: 0 0 8px 0; color: ${isApproved ? '#34d399' : '#f0abfc'}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                        ${isApproved ? 'Pre-Launch Review • Approved & Locked' : 'Pre-Launch Review • Adjustments Logged'}
                      </p>
                      <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.3;">
                        ${isApproved ? "We have your official sign-off!" : "You just helped make this build 10x better!"}
                      </h1>
                      <p style="margin: 0; color: #06b6d4; font-size: 15px; font-weight: 600; font-family: monospace;">
                        ${payload.businessName}
                      </p>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 24px 0; color: #d4d4d8; font-size: 15px; line-height: 1.6; font-weight: 300;">
                        ${isApproved 
                           ? "Thank you for taking the time to walk through your live preview! I have logged your verified checkpoints and locked in this build for production deployment. You did awesome—now let's get you live to the world!" 
                           : "Thank you for taking the time to walk through your live preview! I have logged your notes and checkpoints below, and I am jumping under the hood to execute your adjustments right now."}
                      </p>
                      
                      <!-- NEXT STEPS CALLOUT BOX -->
                      <div style="background-color: #09090b; border: 1px solid ${isApproved ? '#059669' : '#a21caf'}; border-left: 4px solid ${isApproved ? '#10b981' : '#d946ef'}; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
                        <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          What happens next?
                        </p>
                        <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6; font-weight: 300;">
                          ${isApproved 
                            ? 'Keep an eye on your inbox for your official hosting activation link! Initializing your recurring plan gets your site live on the Alternative Solutions grid immediately (Standard Plan).<br><br><strong style="color: #ffffff; font-weight: 600;">Selected the Professional Plan ($15/mo)?</strong><br>I will also reach out to guide you through securing your custom .com domain so I can handle the DNS wiring and connect your personal web address!' 
                            : '<strong style="color: #06b6d4; font-weight: 600;">⚡ Our Review Promise:</strong> We do focused, purposeful reviews—not endless revision loops! I am taking your exact tweak list below and applying it to the codebase in one clean, lightning-fast pass. Once everything looks pristine, I will send an updated link back your way for final sign-off!'}
                        </p>
                      </div>

                      <!-- LOGGED NOTES -->
                      <p style="margin: 0 0 8px 0; color: #06b6d4; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">
                        Your Logged Review Receipt (${payload.completedSteps.length}/4 Sections Checked):
                      </p>
                      <div style="border: 1px solid #27272a; background-color: #09090b; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #d4d4d8; white-space: pre-wrap; margin-bottom: 32px; line-height: 1.5;">${formattedNotes}</div>

                      <!-- SIGN OFF -->
                      <p style="margin: 0 0 4px 0; color: #a1a1aa; font-size: 14px; font-weight: 300;">
                        Standing by,
                      </p>
                      <p style="margin: 0 0 2px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
                        Courtney Sulenski
                      </p>
                      <p style="margin: 0; color: #d946ef; font-size: 12px; font-weight: 600; font-family: monospace;">
                        Founder & Lead Solutions Architect • <span style="color: #06b6d4;">Alternative Solutions</span>
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background-color: #09090b; border-top: 1px solid #27272a; padding: 20px 40px; text-align: center;">
                      <p style="margin: 0; font-size: 10px; font-weight: 500; color: #52525b; letter-spacing: 1px; text-transform: uppercase; font-family: monospace;">
                        Alternative Solutions Input Output LLC • Williamsburg, VA
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #111827; background-color: #f9fafb;">
          <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; background: #ffffff;">
            <h2 style="color: ${isApproved ? '#059669' : '#c026d3'}; margin-top: 0; font-size: 20px;">
              ${isApproved ? '✨ Client Walkthrough Approved!' : '🛠️ Client Requested Build Adjustments'}
            </h2>
            <p style="margin-bottom: 6px;"><strong>Client Name:</strong> ${payload.businessName}</p>
            <p style="margin-bottom: 6px;"><strong>Storefront Slug:</strong> ${payload.storefrontSlug}</p>
            <p style="margin-bottom: 6px;"><strong>Status:</strong> <span style="padding: 2px 8px; border-radius: 4px; background: ${isApproved ? '#d1fae5; color: #065f46' : '#fce7f3; color: #86198f'}; font-weight: bold; font-size: 12px;">${payload.status}</span></p>
            <p style="margin-bottom: 6px;"><strong>Checkpoints Verified:</strong> ${payload.completedSteps.length} of 4 Sections</p>
            <p style="margin-bottom: 16px;"><strong>Client Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3 style="font-size: 14px; margin-bottom: 8px; text-transform: uppercase; color: #4b5563;">Logged Section Adjustments / Notes:</h3>
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 6px; font-family: monospace; font-size: 13px; white-space: pre-wrap; color: #1f2937; line-height: 1.5;">${formattedNotes}</pre>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
              <strong>Action Required:</strong> ${isApproved 
                 ? 'Send the client their hosting activation link! If they chose the Professional Plan ($15/mo), begin guiding them through domain registrar selection and DNS setup.' 
                 : 'Review the copy adjustments above, apply them to the codebase in one clean pass, and notify the client once updated!'}
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