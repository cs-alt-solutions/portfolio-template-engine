/* src/actions/lead-emails/leadEmailShell.ts */
import { ParsedLeadSummary, escapeHtml } from './parseLeadDetails';

interface ShellOptions {
  businessName: string;
  eyebrow: string;
  accentHex: string;
  preheader: string;
  bodyHtml: string;
  footerNote?: string;
}

export function renderRequestSummaryCard(
  summary: ParsedLeadSummary,
  accentHex: string
): string {
  const topicText = escapeHtml(summary.inquiryType);
  const priceBadge = summary.packagePrice
    ? `<span style="display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;background-color:#e2e8f0;color:#0f172a;font-size:12px;font-weight:700;vertical-align:middle;">${escapeHtml(summary.packagePrice)}</span>`
    : '';

  const timingRow = summary.preferredDate
    ? `
      <tr>
        <td style="padding-top:16px;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Preferred Timing</p>
          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">&#128197;&nbsp; ${escapeHtml(summary.preferredDate)}</p>
        </td>
      </tr>
    `
    : '';

  const optionsRow =
    summary.selectedOptions.length > 0
      ? `
      <tr>
        <td style="padding-top:16px;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 10px 0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Selected Options</p>
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            ${summary.selectedOptions
              .map(
                (opt) => `
              <tr>
                <td width="16" valign="top" style="padding:3px 0;color:${accentHex};font-size:14px;font-weight:900;">&#9670;</td>
                <td style="padding:3px 0;color:#0f172a;font-size:14px;font-weight:600;line-height:1.45;">${escapeHtml(opt)}</td>
              </tr>`
              )
              .join('')}
          </table>
        </td>
      </tr>
    `
      : '';

  return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${accentHex};border-radius:10px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 22px;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom:${summary.preferredDate || summary.selectedOptions.length > 0 ? '16px' : '0'};">
                <p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Inquiry Topic</p>
                <p style="margin:0;color:#0f172a;font-size:19px;font-weight:800;line-height:1.25;">${topicText}${priceBadge}</p>
              </td>
            </tr>
            ${timingRow}
            ${optionsRow}
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function wrapLeadEmailHtml({
  businessName,
  eyebrow,
  accentHex,
  preheader,
  bodyHtml,
  footerNote = 'Powered by Alternative Solutions Infrastructure',
}: ShellOptions): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 6px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="height:4px;background-color:${accentHex};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color:#0b0a09;padding:28px 34px;text-align:left;">
              <p style="margin:0;color:${accentHex};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(eyebrow)}</p>
              <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.4px;">${escapeHtml(businessName)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 34px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#fafafa;border-top:1px solid #e4e4e7;padding:18px 34px;text-align:center;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(footerNote)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}