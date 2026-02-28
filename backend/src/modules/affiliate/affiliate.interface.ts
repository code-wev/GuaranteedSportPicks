import { AffiliateStatus } from 'src/model/affiliates/affiliate.model';

/**
 * Type definition for affiliate.
 *
 * This type defines the structure of a single affiliate object.
 * @interface TAffiliate
 */
export interface TCreateAffiliate {
  // Add fields as needed
  userId: string; // Linked user ID
  status?: AffiliateStatus;
  affiliateCode?: string; // Unique tracking code
  website?: string; // Optional affiliate website
  socialLinks?: string[]; // Optional social media links
  notes?: string; // Admin notes
}

