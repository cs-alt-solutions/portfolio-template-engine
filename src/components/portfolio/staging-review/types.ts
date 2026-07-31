// src/components/portfolio/staging-review/types.ts
import { AUDIT_ROADMAP as ROADMAP, AuditStep } from '@/utils/glossary';

export interface StorefrontAuditData {
  id?: string;
  business_name?: string;
  slug?: string;
  contact_email?: string;
  primary_cta?: string;
  status?: string;
  is_template?: boolean;
  [key: string]: unknown;
}

export interface ReviewStep {
  id: string;
  title: string;
  description: string;
  targetId?: string; 
}

export { ROADMAP as AUDIT_ROADMAP };
export type { AuditStep };