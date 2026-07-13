import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Footer from "./components/Footer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Lazy loaded sections
const Services = lazy(() => import("./sections/Services"));
const Portfolio = lazy(() => import("./sections/Portfolio"));
const Process = lazy(() => import("./sections/Process"));
const WhyVisca = lazy(() => import("./sections/WhyVisca"));
const Testimonials = lazy(() => import("./sections/Testimonials"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Pricing = lazy(() => import("./sections/Pricing"));
const Contact = lazy(() => import("./sections/Contact"));

function SectionLoader() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center bg-white py-24" aria-hidden="true">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-spin" />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Portfolio />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Process />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WhyVisca />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TechStack />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </>
  );
}

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
