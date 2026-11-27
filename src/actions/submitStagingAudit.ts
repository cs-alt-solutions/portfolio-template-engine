/* src/actions/submitStagingAudit.ts */
'use server';

import { supabase } from '@/utils/supabase';

export type ApprovalTarget = 'CONTENT_ASSEMBLY' | 'ACTIVE';

export interface StagingAuditPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  sectionNotes: Record<number, string>;
  sectionLabels?: Record<number, string>;
  completedSteps: number[];
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  approvalTarget?: ApprovalTarget;
  contactName?: string;
  planTier?: string;
}

export interface StagingAuditResponse {
  success: boolean;
  auditId?: string | number;
  error?: string;
  warning?: string;
}

export async function submitStagingAudit(
  payload: StagingAuditPayload
): Promise<StagingAuditResponse> {
  try {
    const isApproved = payload.status === 'APPROVED';
    const nextStage = isApproved
      ? payload.approvalTarget || 'CONTENT_ASSEMBLY'
      : 'BUILDING_CORE';

    const historicalAuditTrail = {
      client_notes: payload.sectionNotes,
      section_labels: payload.sectionLabels || {},
      verified_checkpoints: payload.completedSteps,
      total_sections_verified: `${payload.completedSteps.length} Sections Checked`,
      next_stage: nextStage,
      legal_signoff: isApproved
        ? nextStage === 'ACTIVE'
          ? 'Client verified all checkpoints and cleared the storefront for Live Production.'
          : 'Client verified core architecture and moved into Content Assembly to add final photos/content.'
        : 'Client requested adjustments prior to approval.',
      logged_at: new Date().toISOString(),
      contact_name: payload.contactName || 'Founder',
      plan_tier: payload.planTier || 'Standard',
    };

    const combinedNotes = isApproved
      ? null
      : Object.entries(payload.sectionNotes)
          .map(([idx, text]) => {
            const label = payload.sectionLabels?.[Number(idx)];
            return label ? `[${label}]: ${text}` : text;
          })
          .join('\n\n');

    const { data, error: dbError } = await supabase
      .from('storefront_audits')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          business_name: payload.businessName,
          client_email: payload.contactEmail,
          client_name: payload.contactName || 'Founder',
          plan_tier: payload.planTier || 'Standard',
          notes: combinedNotes,
          audit_notes: JSON.stringify(historicalAuditTrail, null, 2),
          status: isApproved ? 'APPROVED' : 'CHANGES_REQUESTED',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase Audit Insertion Error:', dbError.message);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    return { success: true, auditId: data?.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record audit.';
    console.error('Staging Audit Fatal Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}