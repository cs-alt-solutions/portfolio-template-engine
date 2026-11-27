/* src/actions/lead-emails/buildCustomerEmail.ts */
import { LeadPayload, ParsedLeadSummary, escapeHtml } from './parseLeadDetails';
import { renderRequestSummaryCard, wrapLeadEmailHtml } from './leadEmailShell';

interface CustomerEmailParams {
  payload: LeadPayload;
  summary: ParsedLeadSummary;
  accentHex: string;
}

export function buildCustomerReceiptEmail({
  payload,
  summary,
  accentHex,
}: CustomerEmailParams): string {
  const firstName = escapeHtml(payload.name.trim().split(/\s+/)[0] || payload.name);
  const safeBiz = escapeHtml(payload.businessName);

  const timingNote = summary.preferredDate
    ? `
      <p style="margin:0 0 22px 0;color:#64748b;font-size:13px;line-height:1.55;">
        <strong>Heads up:</strong> Your preferred timing is logged as a request, not a final booking. ${safeBiz} will reach out to confirm exact availability and next steps.
      </p>
    `
    : '';

  const notesBlock = summary.notes
    ? `
      <p style="margin:0 0 8px 0;color:#0f172a;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Your Notes</p>
      <div style="border-left:3px solid #cbd5e1;padding:12px 16px;background-color:#f8fafc;border-radius:0 8px 8px 0;margin-bottom:22px;">
        <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;white-space:pre-wrap;font-style:italic;">${escapeHtml(summary.notes)}</p>
      </div>
    `
    : '';

  const bodyHtml = `
    <h2 style="margin:0 0 12px 0;color:#0f172a;font-size:21px;font-weight:800;letter-spacing:-0.3px;">We&apos;ve got your request, ${firstName}.</h2>
    <p style="margin:0 0 24px 0;color:#3f3f46;font-size:15px;line-height:1.6;">
      Thanks for reaching out to <strong>${safeBiz}</strong>! Here is a copy of everything you sent over—we&apos;ll review your details and follow up soon.
    </p>

    ${renderRequestSummaryCard(summary, accentHex)}
    ${timingNote}
    ${notesBlock}

    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      Want to add extra details or send reference photos? Simply reply directly to this email and it will go straight to ${safeBiz}.
    </p>
  `;

  return wrapLeadEmailHtml({
    businessName: payload.businessName,
    eyebrow: 'Request Confirmation',
    accentHex,
    preheader: `We received your ${summary.inquiryType} request for ${payload.businessName}.`,
    bodyHtml,
    footerNote: `Sent on behalf of ${payload.businessName}`,
  });
}