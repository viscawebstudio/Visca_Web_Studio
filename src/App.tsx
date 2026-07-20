import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ClientQuestionnaire = lazy(() => import("./pages/ClientQuestionnaire"));
const SharedResponse = lazy(() => import("./pages/SharedResponse"));

function PageLoader() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-white"
      aria-hidden="true"
    >
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
    </div>
  );
}

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let title = "Visca Web Studio | Premium Website Design & Development";
    let description = "Visca Web Studio creates modern, high-performance websites for businesses, startups, restaurants, gyms, clinics, salons, and more. Fast, responsive, and built to grow your business.";
    
    if (pathname === "/privacy") {
      title = "Privacy Policy | Visca Web Studio";
      description = "Privacy Policy for Visca Web Studio. Read about how we collect, use, and protect your personal information.";
    } else if (pathname === "/terms") {
      title = "Terms & Conditions | Visca Web Studio";
      description = "Terms and Conditions for Visca Web Studio. Read the rules, guidelines, and agreements for using our services.";
    } else if (pathname === "/client-questionnaire") {
      title = "Client Questionnaire | Visca Web Studio";
      description = "Complete the Visca Web Studio client questionnaire to help us understand your website project requirements.";
    }
    
    document.title = title;
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) metaDesc.setAttribute("content", description);
    
    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc) ogDesc.setAttribute("content", description);
    
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute("content", title);
    
    const twitterTitle = document.querySelector("meta[name='twitter:title']");
    if (twitterTitle) twitterTitle.setAttribute("content", title);
    
    const twitterDesc = document.querySelector("meta[name='twitter:description']");
    if (twitterDesc) twitterDesc.setAttribute("content", description);

    // Update canonical link
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    const siteUrl = import.meta.env.VITE_SITE_URL && !import.meta.env.VITE_SITE_URL.includes("vercel.app") 
      ? import.meta.env.VITE_SITE_URL 
      : "https://viscawebstudio.com";
    canonicalLink.setAttribute("href", `${siteUrl}${pathname}`);

    // Manage JSON-LD Schema only for homepage
    const existingSchema = document.getElementById("structured-data");
    if (existingSchema) {
      existingSchema.remove();
    }
    
    if (pathname === "/") {
      const script = document.createElement("script");
      script.id = "structured-data";
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            "name": "Visca Web Studio",
            "url": `${siteUrl}`,
            "logo": `${siteUrl}/android-chrome-512x512.png`,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+919446054420",
              "email": "viscawebstudio@gmail.com",
              "contactType": "customer service"
            }
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            "url": `${siteUrl}`,
            "name": "Visca Web Studio",
            "publisher": {
              "@id": `${siteUrl}/#organization`
            }
          },
          {
            "@type": "WebPage",
            "@id": `${siteUrl}/#webpage`,
            "url": `${siteUrl}`,
            "name": "Visca Web Studio | Premium Website Design & Development",
            "isPartOf": {
              "@id": `${siteUrl}/#website`
            },
            "about": {
              "@id": `${siteUrl}/#organization`
            }
          },
          {
            "@type": "LocalBusiness",
            "@id": `${siteUrl}/#localbusiness`,
            "name": "Visca Web Studio",
            "description": "Visca Web Studio creates modern, high-performance websites for businesses, startups, restaurants, gyms, clinics, salons, and more. Fast, responsive, and built to grow your business.",
            "url": `${siteUrl}`,
            "telephone": "+919446054420",
            "email": "viscawebstudio@gmail.com",
            "image": `${siteUrl}/social-preview.png`
          }
        ]
      });
      document.head.appendChild(script);
    }

    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-900">
      <Navbar />
      <main className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/client-questionnaire"
              element={<ClientQuestionnaire />}
            />
            <Route path="/shared/:token" element={<SharedResponse />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
