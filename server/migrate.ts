import fs from 'fs';
import path from 'path';
import { db } from './db/index.ts';
import { submissions } from './db/schema.ts';

async function migrate() {
  const DATA_FILE = path.join(process.cwd(), 'submissions.json');
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    for (const item of data) {
      try {
        await db.insert(submissions).values({
          id: item.id,
          business_name: item.business_name || '',
          contact_person: item.contact_person || '',
          phone_number: item.phone_number || '',
          email_address: item.email_address || '',
          business_address: item.business_address || '',
          business_industry: item.business_industry || '',
          existing_website: item.existing_website || '',
          existing_website_url: item.existing_website_url || '',
          goal_primary: item.goal_primary || '',
          goal_products: item.goal_products || '',
          goal_audience: item.goal_audience || '',
          goal_action: item.goal_action || '',
          req_pages: item.req_pages || '',
          req_pages_other: item.req_pages_other || '',
          req_features: item.req_features || '',
          req_features_other: item.req_features_other || '',
          brand_colors: item.brand_colors || '',
          brand_fonts: item.brand_fonts || '',
          brand_notes: item.brand_notes || '',
          design_style: item.design_style || '',
          ref1_url: item.ref1_url || '',
          ref1_like: item.ref1_like || '',
          ref2_url: item.ref2_url || '',
          ref2_like: item.ref2_like || '',
          ref3_url: item.ref3_url || '',
          ref3_like: item.ref3_like || '',
          content_notes: item.content_notes || '',
          domain_name: item.domain_name || '',
          hosting_provider: item.hosting_provider || '',
          project_launch_date: item.project_launch_date || '',
          project_budget: item.project_budget || '',
          project_notes: item.project_notes || '',
          dec_name: item.dec_name || '',
          dec_agree: item.dec_agree || '',
          submittedAt: item.submittedAt || ''
        });
        console.log(`Migrated ${item.id}`);
      } catch (e) {
        console.error(`Failed to migrate ${item.id}`, e);
      }
    }
  }
}

migrate();
