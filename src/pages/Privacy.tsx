import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12 text-slate-800">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#020b24] mb-6 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last Updated: July 2026</p>

        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Introduction</h2>
            <p className="text-slate-600">
              Welcome to Visca Web Studio. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Information We Collect</h2>
            <p className="text-slate-600 mb-4">We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Personal Information Provided by You:</strong> Names, phone numbers, email addresses, contact preferences, and other similar information.</li>
              <li><strong>Automatically Collected Information:</strong> IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">How We Use Information</h2>
            <p className="text-slate-600 mb-4">We use personal information collected via our Website for a variety of business purposes described below:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your requests for services.</li>
              <li>To deliver targeted advertising to you.</li>
              <li>To respond to user inquiries/offer support to users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Cookies</h2>
            <p className="text-slate-600">
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Data Security</h2>
            <p className="text-slate-600">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Third-Party Services</h2>
            <p className="text-slate-600">
              The Website may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Website, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#020b24] mb-4">Contact Information</h2>
            <p className="text-slate-600">
              If you have questions or comments about this policy, you may email us at <a href="mailto:viscawebstudio@gmail.com" className="text-blue-600 hover:underline">viscawebstudio@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
