import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share2, FileText } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import navLogo from "../assets/images/visca-header-logo.jpg";
import "./ClientQuestionnaire.css";
import BrandColorPicker from "../components/BrandColorPicker";

const DetailItem = ({
  label,
  value,
  render = false,
}: {
  label: string;
  value: unknown;
  render?: boolean;
}) => {
  if (!value && !render) return null;
  if (value === "-" || value === "") return null;

  if (label === "Colors") {
    try {
      const parsed = JSON.parse(value as string);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <div className="detail-item">
            <strong>{label}:</strong>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              {parsed.map((c: any, i: number) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: c.hex,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <span>
                    {c.name || "Color"} ({c.hex || "N/A"})
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="detail-item">
      <strong>{label}:</strong> {value}
    </div>
  );
};
const pagesOptions = [
  "Home",
  "About",
  "Services",
  "Portfolio",
  "Gallery",
  "Testimonials",
  "Contact",
  "FAQ",
  "Blog",
  "Careers",
  "Shop / E-Commerce",
  "Other",
];
const featuresOptions = [
  "Booking System",
  "WhatsApp Button",
  "Google Maps",
  "Contact Form",
  "Social Media Links",
  "Newsletter Signup",
  "Live Chat Widget",
  "Image/Video Slider",
  "Google Analytics",
  "Multi-Language",
  "Password Protected Pages",
  "Other",
];

export default function ClientQuestionnaire() {
  const navigate = useNavigate();
  const [view, setView] = useState<
    "form" | "success" | "admin-gate" | "admin-dashboard"
  >("form");
  const [viewHistory, setViewHistory] = useState<string[]>(["form"]);

  // Form states
  const [showUrl, setShowUrl] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [brandColors, setBrandColors] = useState([
    { name: "", hex: "#0057FF" },
  ]);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Admin states
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");
  const [responses, setResponses] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">(
    "newest",
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ids: string[];
  }>({ isOpen: false, ids: [] });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    let interval;
    if (view === "admin-dashboard") {
      fetchResponses();
      interval = setInterval(fetchResponses, 5000);
    }
    return () => clearInterval(interval);
  }, [view]);

  const showView = (
    newView: "form" | "success" | "admin-gate" | "admin-dashboard",
    isBack = false,
  ) => {
    if (!isBack && viewHistory[viewHistory.length - 1] !== newView) {
      setViewHistory([...viewHistory, newView]);
    }
    setView(newView);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      setViewHistory(newHistory);
      setView(newHistory[newHistory.length - 1] as any);
    } else {
      navigate(-1);
    }
  };

  // ----------------- FORM LOGIC -----------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    const pagesSelected = formData.getAll("req_pages");
    const featuresSelected = formData.getAll("req_features");

    for (const [key, value] of formData.entries()) {
      if (key !== "req_pages" && key !== "req_features") {
        data[key] = value;
      }
    }
    data.req_pages = pagesSelected.join(", ");
    data.req_features = featuresSelected.join(", ");
    data.email_address = emailInput.trim();

    // Validation
    const requiredBiz = [
      "business_name",
      "contact_person",
      "phone_number",
      "email_address",
    ];
    let bizValid = true;
    for (const id of requiredBiz) {
      if (!data[id]?.toString().trim()) bizValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      setFormError("Please enter a valid email address.");
      document
        .getElementById("section-1")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!bizValid) {
      setFormError("Please fill in all required Business Information fields.");
      document
        .getElementById("section-1")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const phoneVal = (data.phone_number || "").replace(/[^0-9]/g, "");
    if (phoneVal.length !== 10) {
      setFormError("Phone number must be exactly 10 digits.");
      document
        .getElementById("section-1")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    data.phone_number = phoneVal;

    const decName = data.dec_name?.toString().trim();
    const decAgree = formData.get("dec_agree");

    if (!decName || !decAgree) {
      setFormError(
        "Please enter your name and confirm the declaration before submitting.",
      );
      document
        .getElementById("section-9")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Store on server first
      const res = await fetch("/api/questionnaire/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.error ||
            "Failed to save questionnaire to dashboard. Please try again.",
        );
      }

      // 2. Redirect to success view
      (e.target as HTMLFormElement).reset();
      setEmailInput("");
      setBrandColors([{ name: "", hex: "#0057FF" }]);
      showView("success");
    } catch (err) {
      setFormError(
        err.message ||
          "Failed to submit. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  // ----------------- ADMIN LOGIC -----------------
  const tryAdminLogin = async () => {
    try {
      const res = await fetch("/api/questionnaire/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPin }),
      });
      if (res.ok) {
        setAdminError("");
        setAdminPin("");
        showView("admin-dashboard");
        fetchResponses();
      } else {
        const data = await res.json();
        setAdminError(data.error || "Incorrect code.");
      }
    } catch (e) {
      setAdminError("Network error.");
    }
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch(`/api/questionnaire/responses?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        data.sort(
          (a: any, b: any) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        );
        setResponses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = (ids: string[]) => {
    setDeleteModal({ isOpen: true, ids });
  };

  const executeDelete = async () => {
    try {
      const res = await fetch("/api/questionnaire/responses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: deleteModal.ids }),
      });
      if (res.ok) {
        setResponses((prev) =>
          prev.filter((r) => !deleteModal.ids.includes(String(r.id))),
        );
        setDeleteModal({ isOpen: false, ids: [] });
        setSelectedRows(new Set());
        fetchResponses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSelected = () => {
    if (selectedRows.size === 0) {
      alert("Please select at least one response to delete.");
      return;
    }
    confirmDelete(Array.from(selectedRows));
  };

  const toggleAllCheckboxes = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(responses.map((r) => String(r.id))));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleCheckbox = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedRows(newSelected);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const exportCSV = () => {
    if (filteredResponses.length === 0) return;

    // Define all possible fields with readable names and sections
    const fieldMapping: Record<string, string> = {
      submittedAt: "Submission Date",
      business_name: "Business Name",
      contact_person: "Person Name",
      email_address: "Email",
      phone_number: "Phone Number",

      // Business Information
      business_address: "Address",
      business_industry: "Industry",
      existing_website: "Existing Website",
      existing_website_url: "Website URL",

      // Project Goals
      goal_primary: "Primary Goal",
      goal_products: "Products/Services",
      goal_audience: "Target Audience",
      goal_action: "Desired Action",

      // Website Requirements
      req_pages: "Required Pages",
      req_pages_other: "Other Pages",
      req_features: "Required Features",
      req_features_other: "Other Features",

      // Branding
      brand_logo: "Logo",
      brand_guidelines: "Brand Guidelines",
      brand_colors: "Colors",
      brand_fonts: "Fonts",
      brand_notes: "Brand Notes",

      // Design Preferences
      design_style: "Design Style",
      ref1_url: "Reference 1 URL",
      ref1_like: "Reference 1 Likes",
      ref2_url: "Reference 2 URL",
      ref2_like: "Reference 2 Likes",
      ref3_url: "Reference 3 URL",
      ref3_like: "Reference 3 Likes",

      // Content
      content_ready: "Content Ready?",
      content_photos: "Photos",
      content_copywriting: "Copywriting",
      content_stock: "Stock Images",
      content_notes: "Content Notes",

      // Domain & Hosting
      domain_own: "Has Domain?",
      domain_name: "Domain Name",
      hosting_own: "Has Hosting?",
      hosting_provider: "Hosting Provider",
      domain_hosting_help: "Domain/Hosting Help Required",

      // Project Details
      project_budget: "Budget",
      project_launch_date: "Launch Date",
      project_notes: "Project Notes",
      dec_name: "Signed By",
      dec_agree: "Agreed to Terms",
    };

    // Determine which fields have data across all filtered responses
    const activeFields = Object.keys(fieldMapping).filter((key) => {
      return filteredResponses.some(
        (res) =>
          res[key] !== null &&
          res[key] !== undefined &&
          res[key] !== "" &&
          res[key] !== "-",
      );
    });

    if (activeFields.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for Excel

    // Header row
    csvContent +=
      activeFields.map((key) => `"${fieldMapping[key]}"`).join(",") + "\r\n";

    // Data rows
    filteredResponses.forEach((res) => {
      let row = activeFields.map((key) => {
        let val = res[key];
        if (key === "brand_colors") {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              val = parsed
                .map((c) => `${c.name || "Color"} (${c.hex || "N/A"})`)
                .join(" | ");
            }
          } catch (e) {}
        }
        if (key === "submittedAt") val = formatDate(val);
        if (val === null || val === undefined || val === "-") val = "";
        val = String(val).replace(/"/g, '""'); // Escape quotes
        return `"${val}"`;
      });
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `visca-responses-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = async (
    res: any,
    download: boolean = true,
  ): Promise<File | null> => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    return new Promise((resolve) => {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(6, 26, 80); // --primary
      doc.text("VISCA Web Studio", 14, y);
      y += 8;

      doc.setFontSize(14);
      doc.setTextColor(91, 107, 158); // --muted
      doc.text("Client Questionnaire Submission", 14, y);
      y += 12;

      const addSection = (
        title: string,
        data: { label: string; value: unknown }[],
      ) => {
        const validData = data.filter(
          (d) =>
            d.value !== null &&
            d.value !== undefined &&
            d.value !== "" &&
            d.value !== "-",
        );
        if (validData.length === 0) return;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(6, 26, 80);
        doc.text(title, 14, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [],
          body: validData.map((d) => [`${d.label}:`, String(d.value)]),
          theme: "plain",
          styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 2,
            textColor: [20, 20, 20],
          },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 50, textColor: [91, 107, 158] },
            1: { cellWidth: 130 },
          },
          margin: { left: 14 },
          didParseCell: (data: any) => {
            if (data.column.index === 1 && data.row.raw[0] === "Colors:") {
              try {
                const parsed = JSON.parse(data.row.raw[1]);
                if (Array.isArray(parsed)) {
                  data.cell.text = parsed.map(
                    (c: any) =>
                      `      ${c.name || "Color"} (${c.hex || "N/A"})`,
                  );
                }
              } catch (e) {}
            }
          },
          didDrawCell: (data: any) => {
            if (data.column.index === 1 && data.row.raw[0] === "Colors:") {
              try {
                const parsed = JSON.parse(data.row.raw[1]);
                if (Array.isArray(parsed)) {
                  let cy = data.cell.y + 2 + 0.5;
                  const fontSize = (doc as any).internal.getFontSize();
                  const lineHeight = (fontSize * 1.15) / 2.83465;
                  parsed.forEach((c: any) => {
                    doc.setFillColor(c.hex);
                    doc.rect(data.cell.x + 2, cy, 4, 4, "F");
                    doc.setDrawColor(200, 200, 200);
                    doc.rect(data.cell.x + 2, cy, 4, 4, "S");
                    cy += lineHeight;
                  });
                }
              } catch (e) {}
            }
          },
        });

        y = (doc as any).lastAutoTable.finalY + 10;
      };

      addSection("Client Information", [
        { label: "Submission Date", value: formatDate(res.submittedAt) },
        { label: "Business Name", value: res.business_name },
        { label: "Person Name", value: res.contact_person },
        { label: "Email", value: res.email_address },
        { label: "Phone", value: res.phone_number },
      ]);

      addSection("Business Information", [
        { label: "Address", value: res.business_address },
        { label: "Industry", value: res.business_industry },
        { label: "Existing Website", value: res.existing_website },
        { label: "Website URL", value: res.existing_website_url },
      ]);

      addSection("Project Goals", [
        { label: "Primary Goal", value: res.goal_primary },
        { label: "Products/Services", value: res.goal_products },
        { label: "Target Audience", value: res.goal_audience },
        { label: "Desired Action", value: res.goal_action },
      ]);

      addSection("Website Requirements", [
        { label: "Required Pages", value: res.req_pages },
        { label: "Other Pages", value: res.req_pages_other },
        { label: "Required Features", value: res.req_features },
        { label: "Other Features", value: res.req_features_other },
      ]);

      addSection("Branding", [
        { label: "Logo", value: res.brand_logo },
        { label: "Brand Guidelines", value: res.brand_guidelines },
        { label: "Colors", value: res.brand_colors },
        { label: "Fonts", value: res.brand_fonts },
        { label: "Notes", value: res.brand_notes },
      ]);

      addSection("Design Preferences", [
        { label: "Style", value: res.design_style },
        {
          label: "Ref 1",
          value: res.ref1_url
            ? `${res.ref1_url} (Likes: ${res.ref1_like || ""})`
            : "",
        },
        {
          label: "Ref 2",
          value: res.ref2_url
            ? `${res.ref2_url} (Likes: ${res.ref2_like || ""})`
            : "",
        },
        {
          label: "Ref 3",
          value: res.ref3_url
            ? `${res.ref3_url} (Likes: ${res.ref3_like || ""})`
            : "",
        },
      ]);

      addSection("Content", [
        { label: "Ready?", value: res.content_ready },
        { label: "Photos", value: res.content_photos },
        { label: "Copywriting", value: res.content_copywriting },
        { label: "Stock Img", value: res.content_stock },
        { label: "Notes", value: res.content_notes },
      ]);

      addSection("Domain & Hosting", [
        {
          label: "Domain",
          value: res.domain_own
            ? `${res.domain_own} (${res.domain_name || ""})`
            : "",
        },
        {
          label: "Hosting",
          value: res.hosting_own
            ? `${res.hosting_own} (${res.hosting_provider || ""})`
            : "",
        },
        { label: "Help Required", value: res.domain_hosting_help },
      ]);

      addSection("Project Details", [
        { label: "Budget", value: res.project_budget },
        { label: "Launch Date", value: res.project_launch_date },
        { label: "Project Notes", value: res.project_notes },
        {
          label: "Signed By",
          value: res.dec_name
            ? `${res.dec_name} (Agreed: ${res.dec_agree ? "Yes" : "No"})`
            : "",
        },
      ]);

      if (download) {
        const dateStr = new Date().toISOString().split("T")[0];
        const filename = `${res.business_name ? res.business_name.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "client"}_questionnaire_${dateStr}.pdf`;
        doc.save(filename);
        resolve(null);
      } else {
        const pdfBlob = doc.output("blob");
        const dateStr = new Date().toISOString().split("T")[0];
        const filename = `${res.business_name ? res.business_name.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "client"}_questionnaire_${dateStr}.pdf`;
        const file = new File([pdfBlob], filename, { type: "application/pdf" });
        resolve(file);
      }
    });
  };

  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    link: string;
  }>({ isOpen: false, link: "" });

  const shareResponse = async (res: any) => {
    // Check if native sharing supports files
    const canShareFiles =
      navigator.canShare &&
      navigator.canShare({
        files: [new File([""], "t.pdf", { type: "application/pdf" })],
      });

    if (canShareFiles && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        const file = await generatePDF(res, false);
        if (file) {
          await navigator.share({
            title: `${res.business_name || "Client"} Questionnaire`,
            text: `Questionnaire submission from ${res.contact_person || "Client"}`,
            files: [file],
          });
          return; // Success
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error sharing file:", err);
        } else {
          return;
        }
      }
    }

    // Fallback: Generate secure share link
    try {
      const response = await fetch("/api/questionnaire/responses/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: res.id }),
      });
      const data = await response.json();
      if (data.success) {
        const link = `${window.location.origin}/shared/${data.token}`;

        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
          try {
            await navigator.share({
              title: `${res.business_name || "Client"} Questionnaire`,
              url: link,
            });
            return;
          } catch (e: any) {
            if (e.name !== "AbortError") console.error(e);
          }
        }

        // Show desktop fallback modal
        setShareModal({ isOpen: true, link });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredResponses = responses
    .filter((r) => {
      const search = searchQuery.toLowerCase();
      if (!search) return true;
      return (
        (r.business_name || "").toLowerCase().includes(search) ||
        (r.contact_person || "").toLowerCase().includes(search) ||
        (r.email_address || "").toLowerCase().includes(search) ||
        (r.phone_number || "").toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "az")
        return (a.business_name || "").localeCompare(b.business_name || "");
      if (sortOrder === "za")
        return (b.business_name || "").localeCompare(a.business_name || "");
      const tA = new Date(a.submittedAt).getTime();
      const tB = new Date(b.submittedAt).getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });

  return (
    <div className="cq-wrapper">
      {/* 1. FORM VIEW */}
      {view === "form" && (
        <div id="view-form" style={{ position: "relative" }}>
          <header className="header">
            <div className="header-decoration"></div>
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "20px",
                paddingTop: "32px",
              }}
            >
              <BrandLogo src={navLogo} onClick={() => navigate("/")} />
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: 0,
                  color: "white",
                }}
              >
                Client Questionnaire
              </h1>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-modern-back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to VISCA Web Studio
              </button>
              <p
                style={{
                  maxWidth: "600px",
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginTop: "8px",
                }}
              >
                Please complete the form below so we can plan and scope your
                project accurately. It takes about 8–10 minutes — your answers
                save directly to our team when you submit.
              </p>
            </div>
          </header>

          <div className="container">
            <form id="questionnaire-form" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="honeypot"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />
              {/* Section 1 */}
              <div className="card" id="section-1">
                <div className="card-header">
                  <div className="card-number">1</div>
                  <h2 className="card-title">Business Information</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="business_name">
                    Business Name <span className="req-mark">*</span>
                  </label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact_person">
                    Person Name <span className="req-mark">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone_number">
                    Phone Number <span className="req-mark">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email_address">
                    Email Address <span className="req-mark">*</span>
                  </label>
                  <input
                    type="email"
                    id="email_address"
                    name="email_address"
                    value={emailInput}
                    onChange={(e) =>
                      setEmailInput(e.target.value.toLowerCase())
                    }
                    onBlur={() => setEmailInput(emailInput.trim())}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business_address">Business Address</label>
                  <input
                    type="text"
                    id="business_address"
                    name="business_address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business_industry">Business Industry</label>
                  <input
                    type="text"
                    id="business_industry"
                    name="business_industry"
                  />
                </div>
                <div className="form-group">
                  <label>Existing Website?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="existing_website"
                        value="Yes"
                        onChange={() => setShowUrl(true)}
                      />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="existing_website"
                        value="No"
                        onChange={() => setShowUrl(false)}
                        defaultChecked
                      />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                  <div
                    id="reveal-url"
                    className={`reveal-group ${showUrl ? "open" : ""}`}
                  >
                    <label htmlFor="existing_website_url">
                      Existing Website URL
                    </label>
                    <input
                      type="text"
                      id="existing_website_url"
                      name="existing_website_url"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">2</div>
                  <h2 className="card-title">Project Goals</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="goal_primary">
                    Primary goal of your website
                  </label>
                  <textarea id="goal_primary" name="goal_primary"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="goal_products">
                    Products or services you offer
                  </label>
                  <textarea id="goal_products" name="goal_products"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="goal_audience">
                    Who is your target audience?
                  </label>
                  <textarea id="goal_audience" name="goal_audience"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="goal_action">
                    What action do you want visitors to take?
                  </label>
                  <textarea id="goal_action" name="goal_action"></textarea>
                </div>
              </div>

              {/* Section 3 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">3</div>
                  <h2 className="card-title">Website Requirements</h2>
                </div>
                <div className="form-group">
                  <span className="sub-label">Pages required</span>
                  <div className="chip-grid" id="pages-grid">
                    {pagesOptions.map((item) => (
                      <label key={item} className="chip-label">
                        <input type="checkbox" name="req_pages" value={item} />
                        <span className="chip-content">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="req_pages_other">Other pages</label>
                  <input
                    type="text"
                    id="req_pages_other"
                    name="req_pages_other"
                  />
                </div>
                <div className="form-group mt-30">
                  <span className="sub-label">Features & integrations</span>
                  <div className="chip-grid" id="features-grid">
                    {featuresOptions.map((item) => (
                      <label key={item} className="chip-label">
                        <input
                          type="checkbox"
                          name="req_features"
                          value={item}
                        />
                        <span className="chip-content">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="req_features_other">Other features</label>
                  <input
                    type="text"
                    id="req_features_other"
                    name="req_features_other"
                  />
                </div>
              </div>

              {/* Section 4 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">4</div>
                  <h2 className="card-title">Branding</h2>
                </div>
                <div className="form-group">
                  <label>Do you have a logo?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="brand_logo" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="brand_logo" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="brand_logo"
                        value="Need one created"
                      />
                      <span className="chip-content">Need one created</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Brand guidelines on file?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="brand_guidelines" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="brand_guidelines" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="brand_colors">Brand colours</label>

                  <BrandColorPicker
                    colors={brandColors}
                    onChange={setBrandColors}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="brand_fonts">Preferred fonts</label>
                  <input type="text" id="brand_fonts" name="brand_fonts" />
                </div>
                <div className="form-group">
                  <label htmlFor="brand_notes">Logo & brand assets note</label>
                  <textarea
                    id="brand_notes"
                    name="brand_notes"
                    placeholder="e.g. Will email logo files to studio@viscawebstudio.com"
                  ></textarea>
                </div>
              </div>

              {/* Section 5 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">5</div>
                  <h2 className="card-title">Design Preferences</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="design_style">
                    Describe your preferred style
                  </label>
                  <textarea
                    id="design_style"
                    name="design_style"
                    placeholder="e.g. minimal, bold, corporate, playful, luxurious..."
                  ></textarea>
                </div>

                <div className="form-group mt-30">
                  <span className="sub-label">Reference website 1</span>
                  <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="ref1_url">URL</label>
                    <input type="text" id="ref1_url" name="ref1_url" />
                  </div>
                  <div>
                    <label htmlFor="ref1_like">What you like about it</label>
                    <input type="text" id="ref1_like" name="ref1_like" />
                  </div>
                </div>
                <div className="form-group mt-30">
                  <span className="sub-label">Reference website 2</span>
                  <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="ref2_url">URL</label>
                    <input type="text" id="ref2_url" name="ref2_url" />
                  </div>
                  <div>
                    <label htmlFor="ref2_like">What you like about it</label>
                    <input type="text" id="ref2_like" name="ref2_like" />
                  </div>
                </div>
                <div className="form-group mt-30">
                  <span className="sub-label">Reference website 3</span>
                  <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="ref3_url">URL</label>
                    <input type="text" id="ref3_url" name="ref3_url" />
                  </div>
                  <div>
                    <label htmlFor="ref3_like">What you like about it</label>
                    <input type="text" id="ref3_like" name="ref3_like" />
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">6</div>
                  <h2 className="card-title">Content</h2>
                </div>
                <div className="form-group">
                  <label>Website content ready?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="content_ready"
                        value="Yes, fully ready"
                      />
                      <span className="chip-content">Yes, fully ready</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="content_ready"
                        value="Partially ready"
                      />
                      <span className="chip-content">Partially ready</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="content_ready" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Professional photos?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="content_photos" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="content_photos" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Need copywriting help?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="content_copywriting"
                        value="Yes"
                      />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="content_copywriting"
                        value="No"
                      />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Need stock images sourced?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="content_stock" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="content_stock" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="content_notes">
                    Additional content notes
                  </label>
                  <input type="text" id="content_notes" name="content_notes" />
                </div>
              </div>

              {/* Section 7 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">7</div>
                  <h2 className="card-title">Domain & Hosting</h2>
                </div>
                <div className="form-group">
                  <label>Own a domain already?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="domain_own" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="domain_own" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="domain_name">
                    Domain name (if applicable)
                  </label>
                  <input type="text" id="domain_name" name="domain_name" />
                </div>
                <div className="form-group mt-30">
                  <label>Have hosting already?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input type="radio" name="hosting_own" value="Yes" />
                      <span className="chip-content">Yes</span>
                    </label>
                    <label className="chip-label">
                      <input type="radio" name="hosting_own" value="No" />
                      <span className="chip-content">No</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hosting_provider">
                    Hosting provider (if applicable)
                  </label>
                  <input
                    type="text"
                    id="hosting_provider"
                    name="hosting_provider"
                  />
                </div>
                <div className="form-group mt-30">
                  <label>Need us to purchase & configure?</label>
                  <div className="chip-grid">
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="domain_hosting_help"
                        value="Domain only"
                      />
                      <span className="chip-content">Domain only</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="domain_hosting_help"
                        value="Hosting only"
                      />
                      <span className="chip-content">Hosting only</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="domain_hosting_help"
                        value="Both"
                      />
                      <span className="chip-content">Both</span>
                    </label>
                    <label className="chip-label">
                      <input
                        type="radio"
                        name="domain_hosting_help"
                        value="Not required"
                      />
                      <span className="chip-content">Not required</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 8 */}
              <div className="card">
                <div className="card-header">
                  <div className="card-number">8</div>
                  <h2 className="card-title">Project Details</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="project_launch_date">
                    Preferred launch date
                  </label>
                  <input
                    type="date"
                    id="project_launch_date"
                    name="project_launch_date"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project_budget">Estimated budget</label>
                  <input
                    type="text"
                    id="project_budget"
                    name="project_budget"
                    placeholder="e.g. R15,000 – R25,000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project_notes">
                    Additional notes or special requirements
                  </label>
                  <textarea id="project_notes" name="project_notes"></textarea>
                </div>
              </div>

              {/* Section 9 */}
              <div className="card" id="section-9">
                <div className="card-header">
                  <div className="card-number">9</div>
                  <h2 className="card-title">Client Declaration</h2>
                </div>
                <div className="declaration-box">
                  By submitting this form, I confirm that the information
                  provided is accurate to the best of my knowledge. I understand
                  that agreed project timelines depend on the timely submission
                  of content, assets, approvals, and feedback, and that this
                  questionnaire does not itself constitute a formal project
                  agreement — a separate proposal and scope of work will follow.
                </div>
                <div className="form-group">
                  <label htmlFor="dec_name">
                    Full name (acts as your e-signature){" "}
                    <span className="req-mark">*</span>
                  </label>
                  <input type="text" id="dec_name" name="dec_name" required />
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="dec_agree"
                    name="dec_agree"
                    required
                  />
                  <label htmlFor="dec_agree">
                    I confirm the above information is accurate and I agree to
                    the terms described. <span className="req-mark">*</span>
                  </label>
                </div>
              </div>

              <div className="form-group text-center mt-30">
                <button
                  type="submit"
                  id="submit-btn"
                  className="btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Questionnaire"}
                </button>
                {formError && (
                  <div id="form-error" className="error-msg">
                    {formError}
                  </div>
                )}
                <div className="hint-text">
                  Your answers are sent securely to Visca Web Studio.
                </div>
              </div>
            </form>

            <div className="text-center mt-30 mb-20">
              <button
                type="button"
                onClick={() => showView("admin-gate")}
                className="text-link"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                Studio team login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUCCESS VIEW */}
      {view === "success" && (
        <div
          id="view-success"
          style={{ position: "relative", height: "100vh" }}
        >
          <div className="success-view">
            <div className="success-icon">&#10003;</div>
            <h2>Thank you — your questionnaire has been received</h2>
            <p>
              Our team will review your answers and follow up within 1–2
              business days with a tailored proposal and next steps.
            </p>
            <div className="mt-30">
              <button onClick={handleReturnHome} className="btn">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADMIN GATE VIEW */}
      {view === "admin-gate" && (
        <div
          id="view-admin-gate"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--body-bg)",
            padding: "20px",
          }}
        >
          <div className="admin-gate-card">
            <div className="admin-gate-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="admin-gate-title">Team Login</h2>
            <p className="admin-gate-desc">
              Authorized VISCA Web Studio team members only.
            </p>

            <div className="form-group admin-gate-input-group">
              <label htmlFor="admin_pin">Access Code</label>
              <div className="admin-input-wrapper">
                <input
                  type="password"
                  id="admin_pin"
                  placeholder="Enter PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryAdminLogin()}
                />
              </div>
              {adminError && (
                <div
                  id="admin_error"
                  className="error-msg"
                  style={{ textAlign: "left", marginTop: "8px" }}
                >
                  {adminError}
                </div>
              )}
            </div>

            <button onClick={tryAdminLogin} className="btn admin-btn">
              Authenticate
            </button>

            <div className="text-center mt-30">
              <button
                onClick={goBack}
                className="text-link admin-back-link"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                ← Return to Questionnaire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN DASHBOARD VIEW */}
      {view === "admin-dashboard" && (
        <div id="view-admin-dashboard" style={{ position: "relative" }}>
          <header className="admin-header">
            <div className="admin-header-left" style={{ paddingLeft: "80px" }}>
              <h1>Visca Web Studio</h1>
              <h2>Client Responses Dashboard</h2>
            </div>
            <button
              onClick={() => showView("form")}
              className="btn btn-outline"
            >
              View public form
            </button>
          </header>

          <div className="admin-container">
            <div
              className="admin-controls"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3>
                Submitted Questionnaires{" "}
                <span className="badge" id="response-count">
                  {filteredResponses.length}
                </span>
              </h3>
              <div
                className="admin-actions"
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                />
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "newest" | "oldest")
                  }
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Download size={16} /> Export CSV
                </button>
                <button
                  type="button"
                  onClick={deleteSelected}
                  className="btn btn-outline"
                  style={{ color: "var(--error)", borderColor: "var(--error)" }}
                >
                  Delete Selected
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table
                id="responses-table"
                className={responses.length === 0 ? "hidden" : ""}
              >
                <thead>
                  <tr>
                    <th style={{ width: "40px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        onChange={(e) => toggleAllCheckboxes(e.target.checked)}
                        checked={
                          selectedRows.size > 0 &&
                          selectedRows.size === filteredResponses.length
                        }
                      />
                    </th>
                    <th>Submission Date</th>
                    <th>Client Name</th>
                    <th>Business Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="responses-body">
                  {filteredResponses.map((res) => (
                    <React.Fragment key={res.id}>
                      <tr
                        className={`main-row ${res.is_read ? "read-row" : "unread-row"}`}
                        style={{
                          backgroundColor: res.is_read
                            ? "transparent"
                            : "rgba(0,0,0,0.03)",
                        }}
                      >
                        <td data-label="Select" style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            className="row-checkbox"
                            value={res.id}
                            checked={selectedRows.has(String(res.id))}
                            onChange={(e) =>
                              handleCheckbox(String(res.id), e.target.checked)
                            }
                          />
                        </td>
                        <td data-label="Submission Date">
                          {formatDate(res.submittedAt)}
                        </td>
                        <td data-label="Client Name">
                          <strong>{res.contact_person || "-"}</strong>
                        </td>
                        <td data-label="Business Name">
                          {res.business_name || "-"}
                        </td>
                        <td data-label="Email">{res.email_address || "-"}</td>
                        <td data-label="Phone Number">
                          {res.phone_number || "-"}
                        </td>
                        <td
                          data-label="Actions"
                          style={{ display: "flex", gap: "8px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-outline btn-small"
                            onClick={() => toggleRow(String(res.id))}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-small"
                            style={{
                              color: "var(--error)",
                              borderColor: "var(--error)",
                            }}
                            onClick={() => confirmDelete([String(res.id)])}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      <tr
                        className={`detail-row ${expandedRows.has(String(res.id)) ? "open" : ""}`}
                      >
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div className="detail-content">
                            <div className="detail-grid">
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginBottom: "24px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-outline btn-small"
                                  onClick={() => generatePDF(res)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <FileText size={16} /> Export PDF
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-small"
                                  onClick={() => shareResponse(res)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Share2 size={16} /> Share
                                </button>
                              </div>
                              {/* Business Information */}
                              {(res.business_address ||
                                res.business_industry ||
                                res.existing_website ||
                                res.existing_website_url) && (
                                <div className="detail-section">
                                  <h4>Business Information</h4>
                                  <DetailItem
                                    label="Business Name"
                                    value={res.business_name}
                                  />
                                  <DetailItem
                                    label="Person Name"
                                    value={res.contact_person}
                                  />
                                  <DetailItem
                                    label="Phone"
                                    value={res.phone_number}
                                  />
                                  <DetailItem
                                    label="Email"
                                    value={res.email_address}
                                  />
                                  <DetailItem
                                    label="Address"
                                    value={res.business_address}
                                  />
                                  <DetailItem
                                    label="Industry"
                                    value={res.business_industry}
                                  />
                                  <DetailItem
                                    label="Existing Web"
                                    value={res.existing_website}
                                  />
                                  <DetailItem
                                    label="Website URL"
                                    value={res.existing_website_url}
                                  />
                                </div>
                              )}

                              {/* Project Goals */}
                              {(res.goal_primary ||
                                res.goal_products ||
                                res.goal_audience ||
                                res.goal_action) && (
                                <div className="detail-section">
                                  <h4>Project Goals</h4>
                                  <DetailItem
                                    label="Primary Goal"
                                    value={res.goal_primary}
                                  />
                                  <DetailItem
                                    label="Products/Services"
                                    value={res.goal_products}
                                  />
                                  <DetailItem
                                    label="Audience"
                                    value={res.goal_audience}
                                  />
                                  <DetailItem
                                    label="Desired Action"
                                    value={res.goal_action}
                                  />
                                </div>
                              )}

                              {/* Website Requirements */}
                              {(res.req_pages ||
                                res.req_pages_other ||
                                res.req_features ||
                                res.req_features_other) && (
                                <div className="detail-section">
                                  <h4>Website Requirements</h4>
                                  <DetailItem
                                    label="Required Pages"
                                    value={res.req_pages}
                                  />
                                  <DetailItem
                                    label="Other Pages"
                                    value={res.req_pages_other}
                                  />
                                  <DetailItem
                                    label="Required Features"
                                    value={res.req_features}
                                  />
                                  <DetailItem
                                    label="Other Features"
                                    value={res.req_features_other}
                                  />
                                </div>
                              )}

                              {/* Branding */}
                              {(res.brand_logo ||
                                res.brand_guidelines ||
                                res.brand_colors ||
                                res.brand_fonts ||
                                res.brand_notes) && (
                                <div className="detail-section">
                                  <h4>Branding</h4>
                                  <DetailItem
                                    label="Logo"
                                    value={res.brand_logo}
                                  />
                                  <DetailItem
                                    label="Brand Guidelines"
                                    value={res.brand_guidelines}
                                  />
                                  <DetailItem
                                    label="Colors"
                                    value={res.brand_colors}
                                  />
                                  <DetailItem
                                    label="Fonts"
                                    value={res.brand_fonts}
                                  />
                                  <DetailItem
                                    label="Notes"
                                    value={res.brand_notes}
                                  />
                                </div>
                              )}

                              {/* Design Preferences */}
                              {(res.design_style ||
                                res.ref1_url ||
                                res.ref2_url ||
                                res.ref3_url) && (
                                <div className="detail-section">
                                  <h4>Design Preferences</h4>
                                  <DetailItem
                                    label="Style"
                                    value={res.design_style}
                                  />
                                  <DetailItem
                                    label="Ref 1"
                                    value={
                                      res.ref1_url
                                        ? `${res.ref1_url} (${res.ref1_like ? "Likes: " + res.ref1_like : ""})`
                                        : ""
                                    }
                                  />
                                  <DetailItem
                                    label="Ref 2"
                                    value={
                                      res.ref2_url
                                        ? `${res.ref2_url} (${res.ref2_like ? "Likes: " + res.ref2_like : ""})`
                                        : ""
                                    }
                                  />
                                  <DetailItem
                                    label="Ref 3"
                                    value={
                                      res.ref3_url
                                        ? `${res.ref3_url} (${res.ref3_like ? "Likes: " + res.ref3_like : ""})`
                                        : ""
                                    }
                                  />
                                </div>
                              )}

                              {/* Content */}
                              {(res.content_ready ||
                                res.content_photos ||
                                res.content_copywriting ||
                                res.content_stock ||
                                res.content_notes) && (
                                <div className="detail-section">
                                  <h4>Content</h4>
                                  <DetailItem
                                    label="Ready?"
                                    value={res.content_ready}
                                  />
                                  <DetailItem
                                    label="Photos"
                                    value={res.content_photos}
                                  />
                                  <DetailItem
                                    label="Copywriting"
                                    value={res.content_copywriting}
                                  />
                                  <DetailItem
                                    label="Stock Img"
                                    value={res.content_stock}
                                  />
                                  <DetailItem
                                    label="Notes"
                                    value={res.content_notes}
                                  />
                                </div>
                              )}

                              {/* Domain & Hosting */}
                              {(res.domain_own ||
                                res.hosting_own ||
                                res.domain_hosting_help) && (
                                <div className="detail-section">
                                  <h4>Domain & Hosting</h4>
                                  <DetailItem
                                    label="Domain"
                                    value={
                                      res.domain_own
                                        ? `${res.domain_own} ${res.domain_name ? "(" + res.domain_name + ")" : ""}`
                                        : ""
                                    }
                                  />
                                  <DetailItem
                                    label="Hosting"
                                    value={
                                      res.hosting_own
                                        ? `${res.hosting_own} ${res.hosting_provider ? "(" + res.hosting_provider + ")" : ""}`
                                        : ""
                                    }
                                  />
                                  <DetailItem
                                    label="Help Required"
                                    value={res.domain_hosting_help}
                                  />
                                </div>
                              )}

                              {/* Project Details */}
                              <div className="detail-section">
                                <h4>Project Details</h4>
                                <DetailItem
                                  label="Budget"
                                  value={res.project_budget}
                                />
                                <DetailItem
                                  label="Launch Date"
                                  value={res.project_launch_date}
                                />
                                <DetailItem
                                  label="Project Notes"
                                  value={res.project_notes}
                                />
                                <DetailItem
                                  label="Signed By"
                                  value={
                                    res.dec_name
                                      ? `${res.dec_name} (Agreed: ${res.dec_agree ? "Yes" : "No"})`
                                      : ""
                                  }
                                />
                                <DetailItem
                                  label="Submission Date"
                                  value={formatDate(res.submittedAt)}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {responses.length === 0 && (
              <div id="empty-state" className="empty-state">
                No client questionnaires have been submitted yet.
              </div>
            )}
          </div>
        </div>
      )}

      {shareModal.isOpen && (
        <div className="cq-modal-overlay">
          <div className="cq-modal-container">
            <h3 className="cq-modal-title">Share Questionnaire</h3>
            <p className="cq-modal-description">
              Anyone with this link can view the submission. It expires in 30
              days.
            </p>
            <div className="cq-modal-input-wrapper">
              <input
                type="text"
                readOnly
                value={shareModal.link}
                className="cq-modal-input"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <div className="cq-modal-actions">
              <button
                className="cq-modal-btn cq-modal-btn-secondary"
                onClick={() => setShareModal({ isOpen: false, link: "" })}
              >
                Close
              </button>
              <button
                className="cq-modal-btn cq-modal-btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(shareModal.link);
                  alert("Link copied!");
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="cq-modal-overlay">
          <div className="cq-modal-container">
            <h3 className="cq-modal-title">Delete Submission?</h3>
            <p className="cq-modal-description">
              This action cannot be undone.
            </p>
            <div className="cq-modal-actions">
              <button
                className="cq-modal-btn cq-modal-btn-secondary"
                onClick={() => setDeleteModal({ isOpen: false, ids: [] })}
              >
                Cancel
              </button>
              <button
                className="cq-modal-btn cq-modal-btn-danger"
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
