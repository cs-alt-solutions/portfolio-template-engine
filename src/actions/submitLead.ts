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
  brandColorHex?: string; // 🚀 Added for custom email branding
  packagePrice?: string;  // 🚀 Added for the base rate
}

export async function submitStorefrontLead(payload: LeadPayload) {
  try {
    // 1. ROUTE TO EXISTING TABLE (Leaves the raw tags intact for your database ledger)
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
    const ownerEmail = payload.contactEmail || process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';
    
    // 🚀 THE INTERCEPTOR: If in Dev mode, route EVERYTHING to you automatically
    const isLocal = process.env.NODE_ENV === 'development';
    const testEmail = process.env.LOCAL_TEST_EMAIL;
    const finalOwnerRecipient = (isLocal && testEmail) ? testEmail : ownerEmail;
    const finalLeadRecipient = (isLocal && testEmail) ? testEmail : payload.email;

    // 3. SMART PARSING
    const inquiryMatch = payload.details.match(/\[INQUIRY TYPE: (.*?)\]/);
    const inquiryType = inquiryMatch ? inquiryMatch[1] : 'Direct Inquiry';

    // Slice out the Add-ons for a dedicated UI block
    const addonMatch = payload.details.match(/SELECTED ADD-ONS:\n([\s\S]*?)\n\n/);
    const addonsList = addonMatch ? addonMatch[1].split('\n').map(a => a.replace('- ', '').trim()) : [];

    // Clean the ugly tags out of the details so the paragraph looks premium
    const cleanDetails = payload.details
      .replace(/\[INQUIRY TYPE: .*?\]\n\n/, '')
      .replace(/SELECTED ADD-ONS:\n[\s\S]*?\n\n/, '');

    const activeHex = payload.brandColorHex || '#0ea5e9'; // Fallback to cyan if not provided

    const addonsHtmlBlock = addonsList.length > 0 ? `
      <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Selected Upgrades</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <ul style="margin: 0; padding-left: 20px; color: ${activeHex}; font-size: 14px; line-height: 1.6; font-weight: 600;">
          ${addonsList.map(addon => `<li style="margin-bottom: 4px;"><span style="color: #0f172a;">${addon}</span></li>`).join('')}
        </ul>
      </div>
    ` : '';

    const testWarningBanner = isLocal ? `
      <div style="background-color: #fef08a; padding: 12px; border-radius: 6px; margin-bottom: 24px; border: 1px solid #facc15;">
        <p style="margin: 0; color: #854d0e; font-size: 12px; font-weight: bold;">
          Note: This lead was originally meant for ${ownerEmail}, but is routing to your test email during local development.
        </p>
      </div>
    ` : '';

    // 4. DISPATCH OWNER NOTIFICATION (The Alert)
    const ownerEmailResult = resend.emails.send({
      from: `${payload.businessName} Leads <leads@alternativesolutions.io>`, 
      to: [finalOwnerRecipient], 
      replyTo: payload.email,
      subject: isLocal ? `[TEST] New ${inquiryType}: ${payload.name}` : `New ${inquiryType}: ${payload.name} - ${payload.businessName}`,
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
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-w: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7;">
                  <tr>
                    <td style="background-color: #0f172a; padding: 32px 40px; text-align: left;">
                      <p style="margin: 0; color: ${activeHex}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${inquiryType}</p>
                      <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${payload.businessName}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      
                      ${testWarningBanner}

                      <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
                        You have received a new potential project lead via your storefront. Simply reply directly to this email to respond to the client.
                      </p>
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
                      
                      ${addonsHtmlBlock}

                      <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Project Scope & Notes</p>
                      <div style="border-left: 4px solid ${activeHex}; background-color: #f8fafc; padding: 20px; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${cleanDetails}</p>
                      </div>
                    </td>
                  </tr>
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

    // 5. DISPATCH END-USER CONFIRMATION (The Receipt)
    const leadEmailResult = resend.emails.send({
      from: `${payload.businessName} <hello@alternativesolutions.io>`, 
      to: [finalLeadRecipient], 
      replyTo: ownerEmail, // If the lead replies, it goes directly to the business owner
      subject: isLocal ? `[TEST] Inquiry Received: ${payload.businessName}` : `Inquiry Received: ${payload.businessName}`,
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
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-w: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7;">
                  <tr>
                    <td style="background-color: #0f172a; padding: 32px 40px; text-align: left;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${payload.businessName}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Request Received!</h2>
                      <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
                        Hi ${payload.name},<br><br>
                        Thank you for reaching out. This is a confirmation that you are inquiring about booking the <strong style="color: ${activeHex};">${inquiryType}</strong> package. We will review your project details and get back to you as soon as possible.
                      </p>
                      
                      ${addonsHtmlBlock}

                      <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Provided Notes:</p>
                      <div style="border-left: 4px solid #e2e8f0; padding-left: 16px;">
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-style: italic;">${cleanDetails}</p>
                      </div>
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

    // Wait for both emails to successfully dispatch
    await Promise.all([ownerEmailResult, leadEmailResult]);

    return { success: true };
  } catch (error) {
    console.error('Lead Pipeline Error:', error);
    return { success: false, error: 'Transmission failed. Please try again.' };
  }
}