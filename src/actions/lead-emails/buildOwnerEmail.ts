/* src/actions/lead-emails/buildOwnerEmail.ts */
import {
  LeadPayload,
  ParsedLeadSummary,
  escapeHtml,
  getContrastTextColor,
} from './parseLeadDetails';
import { renderRequestSummaryCard, wrapLeadEmailHtml } from './leadEmailShell';

interface OwnerEmailParams {
  payload: LeadPayload;
  summary: ParsedLeadSummary;
  accentHex: string;
  isLocal: boolean;
  originalOwnerEmail: string;
}

export function buildOwnerLeadEmail({
  payload,
  summary,
  accentHex,
  isLocal,
  originalOwnerEmail,
}: OwnerEmailParams): string {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const rawPhone = (payload.phone || '').trim();
  const telDigits = rawPhone.replace(/[^\d+]/g, '');
  const buttonTextHex = getContrastTextColor(accentHex);

  const replySubject = encodeURIComponent(
    `Re: Your ${summary.inquiryType} inquiry — ${payload.businessName}`
  );
  const replyHref = `mailto:${encodeURIComponent(payload.email)}?subject=${replySubject}`;

  const testBanner = isLocal
    ? `
      <div style="background-color:#fef9c3;border:1px solid #facc15;border-radius:8px;padding:12px 14px;margin-bottom:22px;">
        <p style="margin:0;color:#854d0e;font-size:12px;font-weight:700;line-height:1.45;">
          Local Dev Intercept: Originally addressed to ${escapeHtml(originalOwnerEmail)}, routed to your test inbox.
        </p>
      </div>
    `
    : '';

  const phoneCell = rawPhone
    ? `<a href="tel:${escapeHtml(telDigits)}" style="color:#0f172a;text-decoration:none;font-weight:700;">${escapeHtml(rawPhone)}</a>`
    : `<span style="color:#94a3b8;font-style:italic;">Not provided</span>`;

  const notesBlock = summary.notes
    ? `
      <p style="margin:0 0 8px 0;color:#0f172a;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Client Notes</p>
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${accentHex};border-radius:0 10px 10px 0;padding:18px 20px;margin-bottom:26px;">
        <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(summary.notes)}</p>
      </div>
    `
    : `
      <div style="background-color:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;padding:14px 18px;margin-bottom:26px;">
        <p style="margin:0;color:#64748b;font-size:13px;font-style:italic;">No additional written notes were included with this request.</p>
      </div>
    `;

  const callButton = rawPhone
    ? `<a href="tel:${escapeHtml(telDigits)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background-color:#f1f5f9;border:1px solid #cbd5e1;color:#0f172a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;text-decoration:none;margin-left:8px;">Call Client</a>`
    : '';

  const bodyHtml = `
    ${testBanner}
    <p style="margin:0 0 20px 0;color:#3f3f46;font-size:15px;line-height:1.6;">
      <strong>${safeName}</strong> just submitted a new request through your storefront. Hit reply directly to start the conversation.
    </p>

    ${renderRequestSummaryCard(summary, accentHex)}

    <p style="margin:0 0 8px 0;color:#0f172a;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Client Contact</p>
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="34%" style="padding:6px 0;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Name</td>
              <td width="66%" style="padding:6px 0;color:#0f172a;font-size:15px;font-weight:700;">${safeName}</td>
            </tr>
            <tr>
              <td width="34%" style="padding:6px 0;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Email</td>
              <td width="66%" style="padding:6px 0;font-size:14px;">
                <a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;font-weight:600;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td width="34%" style="padding:6px 0;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Phone</td>
              <td width="66%" style="padding:6px 0;font-size:14px;">${phoneCell}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${notesBlock}

    <div style="text-align:left;padding-top:4px;">
      <a href="${replyHref}" style="display:inline-block;padding:13px 22px;border-radius:8px;background-color:${accentHex};color:${buttonTextHex};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;text-decoration:none;">Reply to ${safeName}</a>
      ${callButton}
    </div>
  `;

  return wrapLeadEmailHtml({
    businessName: payload.businessName,
    eyebrow: summary.ctaLabel ? `New Lead · ${summary.ctaLabel}` : 'New Storefront Inquiry',
    accentHex,
    preheader: `${payload.name} inquired about ${summary.inquiryType}${summary.preferredDate ? ` (${summary.preferredDate})` : ''}`,
    bodyHtml,
  });
}