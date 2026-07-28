// src/actions/submitStagingAudit.ts (PORTFOLIO-TEMPLATE-ENGINE REPO)
'use server';

import { supabase } from '@/utils/supabase';

export interface StagingAuditPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  sectionNotes: Record<number, string>;
  completedSteps: number[];
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  contactName?: string;
  planTier?: string;
}

// ⚡ Add explicit response typing so StagingReviewOverlay knows 'warning' is valid!
export interface StagingAuditResponse {
  success: boolean;
  auditId?: string | number;
  error?: string;
  warning?: string;
}

export async function submitStagingAudit(payload: StagingAuditPayload): Promise<StagingAuditResponse> {
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
      contact_name: payload.contactName || 'Founder',
      plan_tier: payload.planTier || 'Standard Starter'
    };

    // 1. Drop the audit payload into our Supabase Ledger
    const { data, error: dbError } = await supabase
      .from('storefront_audits')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          business_name: payload.businessName,
          client_email: payload.contactEmail,
          audit_notes: JSON.stringify(historicalAuditTrail, null, 2),
          status: isApproved ? 'APPROVED_PENDING_BILLING' : 'CHANGES_REQUESTED',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Supabase Audit Insertion Error:', dbError.message);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    console.log('✅ Audit safely logged to Supabase! Webhook will trigger email engine.');
    return { success: true, auditId: data?.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record audit.';
    console.error('Staging Audit Fatal Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}