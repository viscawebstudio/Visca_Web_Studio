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
    if (pathname === "/privacy") {
      document.title = "Privacy Policy | Visca Web Studio";
    } else if (pathname === "/terms") {
      document.title = "Terms & Conditions | Visca Web Studio";
    } else if (pathname === "/client-questionnaire") {
      document.title = "Client Questionnaire | Visca Web Studio";
    } else {
      document.title =
        "Visca Web Studio | Premium Website Design & Development";
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
