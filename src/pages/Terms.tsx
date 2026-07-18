import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { handleEmailClick } from '../utils/emailHandler';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12 text-slate-800">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#020b24] mb-6 tracking-tight">Terms & Conditions</h1>
        <p className="text-slate-500 mb-12">Last Updated: July 2026</p>

        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using the services provided by Visca Web Studio, you agree to be bound by these Terms and Conditions. If you do not agree to all of the terms and conditions stated on this page, do not continue to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Services</h2>
            <p className="text-slate-600">
              Visca Web Studio provides web design, development, UI/UX, and branding services. The specific scope of services will be outlined in a separate Statement of Work (SOW) or proposal provided to each client.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Pricing & Payments</h2>
            <p className="text-slate-600">
              All prices are subject to change. Payment terms are detailed in the individual project proposal. Typically, a non-refundable deposit is required before work commences, with the remaining balance due upon project completion or defined milestones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Intellectual Property</h2>
            <p className="text-slate-600">
              Upon final payment, the client will own the rights to the final deliverables as outlined in the project agreement. Visca Web Studio retains the right to display the completed work in our portfolio and marketing materials unless a Non-Disclosure Agreement (NDA) is signed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Client Responsibilities</h2>
            <p className="text-slate-600">
              Clients are responsible for providing necessary materials, feedback, and approvals in a timely manner. Delays in providing required assets or feedback may result in adjustments to the project timeline.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Project Timeline</h2>
            <p className="text-slate-600">
              Estimated timelines are provided in good faith. While we strive to meet all deadlines, timelines may be affected by factors outside our control, including client delays or requested changes to the project scope.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Limitation of Liability</h2>
            <p className="text-slate-600">
              Visca Web Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Termination</h2>
            <p className="text-slate-600">
              Either party may terminate a project with written notice. In the event of termination, the client is responsible for paying for all work completed up to the date of termination. Deposits are generally non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Governing Law</h2>
            <p className="text-slate-600">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Visca Web Studio operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Contact Information</h2>
            <p className="text-slate-600">
              If you have any questions about these Terms, please contact us at <a href="mailto:viscawebstudio@gmail.com" onClick={handleEmailClick} className="text-blue-600 hover:underline">viscawebstudio@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
