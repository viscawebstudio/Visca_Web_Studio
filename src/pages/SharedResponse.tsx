import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import navLogo from '../assets/images/regenerated_image_1783781363157.jpg';
import './ClientQuestionnaire.css';

const DetailItem = ({ label, value }: { label: string, value: any }) => {
  if (!value || value === '-' || value === '') return null;
  return <div className="detail-item"><strong>{label}:</strong> {value}</div>;
};

const formatDate = (dStr: string) => {
  if (!dStr) return '';
  return new Date(dStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function SharedResponse() {
  const { token } = useParams<{ token: string }>();
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/questionnaire/shared/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setRes(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="cq-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !res) {
    return (
      <div className="cq-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <BrandLogo src={navLogo} />
        <h2 style={{ marginTop: '24px', color: 'var(--primary)' }}>Link Invalid or Expired</h2>
        <p style={{ color: 'var(--muted)', marginTop: '8px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="cq-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--body-bg)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <BrandLogo src={navLogo} />
          <h2 style={{ marginTop: '24px', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 700 }}>Client Questionnaire</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Submitted on {formatDate(res.submittedAt)}</p>
        </div>

        <div className="detail-grid">
          {/* Business Information */}
          {(res.business_address || res.business_industry || res.existing_website || res.existing_website_url) && (
          <div className="detail-section">
            <h4>Business Information</h4>
            <DetailItem label="Business Name" value={res.business_name} />
            <DetailItem label="Person Name" value={res.contact_person} />
            <DetailItem label="Phone" value={res.phone_number} />
            <DetailItem label="Email" value={res.email_address} />
            <DetailItem label="Address" value={res.business_address} />
            <DetailItem label="Industry" value={res.business_industry} />
            <DetailItem label="Existing Web" value={res.existing_website} />
            <DetailItem label="Website URL" value={res.existing_website_url} />
          </div>
          )}
          
          {/* Project Goals */}
          {(res.goal_primary || res.goal_products || res.goal_audience || res.goal_action) && (
          <div className="detail-section">
            <h4>Project Goals</h4>
            <DetailItem label="Primary Goal" value={res.goal_primary} />
            <DetailItem label="Products/Services" value={res.goal_products} />
            <DetailItem label="Audience" value={res.goal_audience} />
            <DetailItem label="Desired Action" value={res.goal_action} />
          </div>
          )}
          
          {/* Website Requirements */}
          {(res.req_pages || res.req_pages_other || res.req_features || res.req_features_other) && (
          <div className="detail-section">
            <h4>Website Requirements</h4>
            <DetailItem label="Required Pages" value={res.req_pages} />
            <DetailItem label="Other Pages" value={res.req_pages_other} />
            <DetailItem label="Required Features" value={res.req_features} />
            <DetailItem label="Other Features" value={res.req_features_other} />
          </div>
          )}

          {/* Branding */}
          {(res.brand_logo || res.brand_guidelines || res.brand_colors || res.brand_fonts || res.brand_notes) && (
          <div className="detail-section">
            <h4>Branding</h4>
            <DetailItem label="Logo" value={res.brand_logo} />
            <DetailItem label="Brand Guidelines" value={res.brand_guidelines} />
            <DetailItem label="Colors" value={res.brand_colors} />
            <DetailItem label="Fonts" value={res.brand_fonts} />
            <DetailItem label="Notes" value={res.brand_notes} />
          </div>
          )}

          {/* Design Preferences */}
          {(res.design_style || res.ref1_url || res.ref2_url || res.ref3_url) && (
          <div className="detail-section">
            <h4>Design Preferences</h4>
            <DetailItem label="Style" value={res.design_style} />
            <DetailItem label="Ref 1" value={res.ref1_url ? `${res.ref1_url} (Likes: ${res.ref1_like || ''})` : ''} />
            <DetailItem label="Ref 2" value={res.ref2_url ? `${res.ref2_url} (Likes: ${res.ref2_like || ''})` : ''} />
            <DetailItem label="Ref 3" value={res.ref3_url ? `${res.ref3_url} (Likes: ${res.ref3_like || ''})` : ''} />
          </div>
          )}

          {/* Content */}
          {(res.content_ready || res.content_photos || res.content_copywriting || res.content_stock || res.content_notes) && (
          <div className="detail-section">
            <h4>Content</h4>
            <DetailItem label="Ready?" value={res.content_ready} />
            <DetailItem label="Photos" value={res.content_photos} />
            <DetailItem label="Copywriting" value={res.content_copywriting} />
            <DetailItem label="Stock Img" value={res.content_stock} />
            <DetailItem label="Notes" value={res.content_notes} />
          </div>
          )}
          
          {/* Domain & Hosting */}
          {(res.domain_own || res.hosting_own || res.domain_hosting_help) && (
          <div className="detail-section">
            <h4>Domain & Hosting</h4>
            <DetailItem label="Domain" value={res.domain_own ? `${res.domain_own} (${res.domain_name || ''})` : ''} />
            <DetailItem label="Hosting" value={res.hosting_own ? `${res.hosting_own} (${res.hosting_provider || ''})` : ''} />
            <DetailItem label="Help Required" value={res.domain_hosting_help} />
          </div>
          )}

          {/* Project Details */}
          <div className="detail-section">
            <h4>Project Details</h4>
            <DetailItem label="Budget" value={res.project_budget} />
            <DetailItem label="Launch Date" value={res.project_launch_date} />
            <DetailItem label="Project Notes" value={res.project_notes} />
            <DetailItem label="Signed By" value={res.dec_name ? `${res.dec_name} (Agreed: ${res.dec_agree ? 'Yes' : 'No'})` : ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
