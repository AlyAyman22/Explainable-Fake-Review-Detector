/* =========================
   src/App.tsx
   ========================= */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  ChevronDown,
  Zap,
  Sparkles,
} from "lucide-react";
import { TypewriterText } from "./components/TypewriterText";
import DynamicBackground from "./components/figma/DynamicBackGround";
import { motion, AnimatePresence } from "framer-motion";

type AnalysisState = "idle" | "loading" | "complete";
type Verdict = "authentic" | "fake";
type Mode = "speed" | "insight";
type View = "review" | "about";

const INPUT_SPRING = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 };

export default function App() {
  const [view, setView] = useState<View>("review");
  const isAbout = view === "about";

  const [reviewText, setReviewText] = useState("");
  const [state, setState] = useState<AnalysisState>("idle");

  const [verdict, setVerdict] = useState<Verdict>("authentic");
  const [confidence, setConfidence] = useState<number>(92);
  const [explanation, setExplanation] = useState("");

  // we keep two versions to animate changes smoothly
  const [submittedReview, setSubmittedReview] = useState<string>("");
  const [displayedReview, setDisplayedReview] = useState<string>("");

  const [mode, setMode] = useState<Mode>("speed"); // next submit mode
  const [resultMode, setResultMode] = useState<Mode>("speed"); // locked per submission

  const [modeOpen, setModeOpen] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const [clearing, setClearing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const TEXTAREA_MAX = 200;

  // Auto expand textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newH = Math.min(ta.scrollHeight, TEXTAREA_MAX);
    ta.style.height = `${newH}px`;
    ta.style.overflowY = ta.scrollHeight > TEXTAREA_MAX ? "auto" : "hidden";
  }, [reviewText]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDown = () => setModeOpen(false);
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // Close dropdown when switching views
  useEffect(() => {
    setModeOpen(false);
  }, [view]);

  const layoutActive = state !== "idle" || displayedReview.length > 0;

  // Keep YOUR exact motion behavior/positions (unchanged)
  const inputY = useMemo(() => (layoutActive ? 300 : -50), [layoutActive]);

  const ModeLabel = (m: Mode) => (m === "speed" ? "Speed Mode" : "Insight Mode");
  const ModeDesc = (m: Mode) =>
    m === "speed"
      ? "Faster results for quick checks."
      : "More accurate analysis with a confidence score and deeper reasoning.";

  const animateReviewSwap = (next: string) => {
    // fade out current, swap, fade in (smooth transition)
    setClearing(true);
    setTimeout(() => {
      setDisplayedReview(next);
      setClearing(false);
    }, 180);
  };

  const resetToFreshReview = () => {
    setModeOpen(false);
    setShowLoader(false);
    setState("idle");
    setExplanation("");
    setSubmittedReview("");
    setDisplayedReview("");
    setReviewText("");
    setClearing(false);
    setView("review");
  };

  const handleAnalyze = () => {
    const trimmed = reviewText.trim();
    if (!trimmed) return;

    // lock the mode and store next review, reset input immediately
    setSubmittedReview(trimmed);
    setResultMode(mode);
    setReviewText("");

    // smooth transition for "Your Review" field
    animateReviewSwap(trimmed);

    setModeOpen(false);
    setState("loading");
    setShowLoader(false);

    // delay dots to avoid overlap while input moves
    setTimeout(() => setShowLoader(true), 280);

    setTimeout(() => {
      const isAuthentic = Math.random() > 0.5;
      const conf = Math.floor(Math.random() * 15) + 85;

      setVerdict(isAuthentic ? "authentic" : "fake");
      setConfidence(conf);

      if (mode === "speed") {
        setExplanation(
          isAuthentic
            ? "Looks like a genuine review with natural wording and balanced details."
            : "This review shows patterns that often appear in non-genuine or promotional reviews."
        );
      } else {
        setExplanation(
          isAuthentic
            ? "The wording feels natural and specific, with realistic details and a balanced tone. This usually aligns with genuine customer experiences."
            : "The review relies heavily on exaggerated phrasing and repeated product praise. These patterns often correlate with non-genuine or incentivized reviews."
        );
      }

      setState("complete");
    }, 2400);
  };

  const handleCheckAnother = () => {
    setClearing(true);
    setTimeout(() => {
      setState("idle");
      setShowLoader(false);
      setExplanation("");
      setSubmittedReview("");
      setDisplayedReview("");
      setClearing(false);
    }, 220);
  };

  const openAbout = () => {
    setModeOpen(false);
    setView("about");
  };

  const startReviewing = () => {
    // Always reset (like ChatGPT icon -> new chat)
    resetToFreshReview();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DynamicBackground />

      {/* ABOUT OVERLAY (fixed => no layout shift / no positional glitch) */}
      <motion.div
        initial={false}
        animate={{ opacity: isAbout ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: isAbout ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
        }}
      >
        <motion.div
          initial={false}
          animate={{ y: isAbout ? 0 : 10, scale: isAbout ? 1 : 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="input-card rounded-2xl"
          style={{
            maxWidth: 960,
            width: "72%",
            padding: "38px 34px", // more breathing room
            textAlign: "center",
          }}
        >
          <div
            className="logo-glow"
            style={{
              fontSize: 62,
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "#343434",
              marginBottom: 22, // more spacing
            }}
          >
            XFR-S
          </div>

          <div
            style={{
              fontSize: 18,
              lineHeight: 1.78,
              color: "rgba(52,52,52,0.82)",
              maxWidth: 820,
              margin: "0 auto",
            }}
          >
            <b>
              XFR-S helps shoppers and businesses identify deceptive online reviews and understand
              why they were flagged.
            </b>{" "}
            Paste any review and get a clear verdict in seconds. Speed Mode provides a quick
            check, while Insight Mode delivers higher accuracy with a confidence score and a
            short, human-readable explanation. Our goal is to strengthen trust in e-commerce by
            making review verification both effective and transparent.
          </div>

          <div style={{ height: 26 }} />

          <motion.button
            initial={false}
            animate={{ opacity: isAbout ? 1 : 0, y: isAbout ? 0 : 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={startReviewing}
            className="check-another-btn-hover rounded-lg"
            style={{
              background: "#343434",
              color: "#FFFFFF",
              padding: "11px 24px",
              fontSize: 16,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Start Reviewing
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header (fade out, but stays in layout => no shifting) */}
        <motion.header
          initial={false}
          animate={{ opacity: isAbout ? 0 : 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            pointerEvents: isAbout ? "none" : "auto",
          }}
          className="flex items-center justify-between px-20 pt-7 pb-5"
        >
          <div
            className="logo-glow"
            style={{
              fontSize: "30px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              paddingLeft: "40px",
              paddingTop: "20px",
              cursor: "pointer",
            }}
            onClick={startReviewing}
            title="Start Reviewing"
          >
            XFR-S
          </div>

          <nav
            className="flex items-center"
            style={{ gap: "40px", paddingRight: "8px", paddingTop: "10px" }}
          >
            <button
              className="nav-link"
              style={{ fontSize: "16px" }}
              onClick={openAbout}
              type="button"
            >
              About
            </button>
            <button
              className="nav-link"
              style={{ fontSize: "16px", paddingRight: "30px" }}
              onClick={startReviewing}
              type="button"
            >
              Start Reviewing
            </button>
          </nav>
        </motion.header>

        {/* Main (review page stays mounted; we only fade it under About overlay) */}
        <motion.main
          initial={false}
          animate={{ opacity: isAbout ? 0 : 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            pointerEvents: isAbout ? "none" : "auto",
          }}
          className="flex-1 relative px-20"
        >
          {/* ===========================
              YOUR REVIEW UI (UNCHANGED)
             =========================== */}

          {/* RESULTS (non-blocking wrapper) */}
          <div className="absolute inset-0 flex justify-center" style={{ pointerEvents: "none" }}>
            <AnimatePresence mode="wait">
              {(displayedReview || state === "complete") && (
                <motion.div
                  key="resultsWrap"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: clearing ? 0 : 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="w-full"
                  style={{
                    pointerEvents: "auto",
                    maxWidth: "840px",
                    width: "60%",
                    minWidth: "520px",
                    marginTop: "7.5vh",
                  }}
                >
                  {/* Submitted Review (smooth swap) */}
                  {displayedReview && (
                    <motion.div
                      key={displayedReview}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="input-card rounded-2xl"
                      style={{ padding: "16px 18px", marginBottom: 14 }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(52,52,52,0.55)",
                          marginBottom: 8,
                          fontWeight: 800,
                          letterSpacing: "0.2px",
                          textTransform: "uppercase",
                        }}
                      >
                        Your Review
                      </div>
                      <div
                        style={{
                          color: "rgba(52,52,52,0.92)",
                          fontSize: 15,
                          lineHeight: 1.55,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {displayedReview}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 13, color: "rgba(52,52,52,0.60)" }}>
                        Mode used: <b style={{ color: "#343434" }}>{ModeLabel(resultMode)}</b>
                      </div>
                    </motion.div>
                  )}

                  {/* Loading */}
                  {state === "loading" && showLoader && (
                    <div className="flex items-center justify-center" style={{ gap: 12, marginTop: "4vh" }}>
                      <div className="dot-1 rounded-full" style={{ width: 10, height: 10, backgroundColor: "rgba(52,52,52,0.30)" }} />
                      <div className="dot-2 rounded-full" style={{ width: 10, height: 10, backgroundColor: "rgba(52,52,52,0.30)" }} />
                      <div className="dot-3 rounded-full" style={{ width: 10, height: 10, backgroundColor: "rgba(52,52,52,0.30)" }} />
                    </div>
                  )}

                  {/* Results */}
                  {state === "complete" && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="flex flex-col items-center"
                    >
                      <div className="flex items-center" style={{ gap: 14, marginTop: 12, marginBottom: 10 }}>
                        <h1
                          className={verdict === "authentic" ? "glow-authentic" : "glow-fake"}
                          style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.5px", textTransform: "uppercase" }}
                        >
                          {verdict === "authentic" ? "Authentic" : "Fake"}
                        </h1>

                        {verdict === "authentic" ? (
                          <CheckCircle
                            className="icon-glow-hover"
                            style={{ width: 34, height: 34, color: "#16A34A", strokeWidth: 2.5, filter: "drop-shadow(0 0 10px rgba(22, 163, 74, 0.20))" }}
                          />
                        ) : (
                          <XCircle
                            className="icon-glow-hover"
                            style={{ width: 34, height: 34, color: "#DC2626", strokeWidth: 2.5, filter: "drop-shadow(0 0 10px rgba(220, 38, 38, 0.20))" }}
                          />
                        )}
                      </div>

                      {/* Confidence (Insight only) */}
                      {resultMode === "insight" && (
                        <div className="flex flex-col items-center" style={{ marginBottom: 18 }}>
                          <div style={{ fontSize: 16, color: "rgba(52,52,52,0.70)", marginBottom: 8 }}>
                            Confidence: {confidence}%
                          </div>
                          <div className="relative rounded-full overflow-hidden" style={{ width: 220, height: 7, backgroundColor: "rgba(52,52,52,0.12)" }}>
                            <div
                              className="absolute top-0 left-0 h-full rounded-full"
                              style={{
                                width: `${confidence}%`,
                                background: "linear-gradient(90deg, #A78BFA, #6366F1, #22D3EE)",
                                boxShadow: "0 0 14px rgba(167, 139, 250, 0.30)",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="text-center" style={{ width: "100%", fontSize: 18, color: "rgba(52,52,52,0.80)", lineHeight: 1.65, marginBottom: 18 }}>
                        <TypewriterText text={explanation} speed={30} />
                      </div>

                      {/* Check Another */}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        onClick={handleCheckAnother}
                        className="check-another-btn-hover rounded-lg"
                        style={{ background: "#343434", color: "#FFFFFF", padding: "10px 22px", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer" }}
                      >
                        Check Another
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT LAYER */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: "none" }}>
            <motion.div
              animate={{ y: inputY }}
              transition={INPUT_SPRING}
              style={{ width: "100%", willChange: "transform", pointerEvents: "auto" }}
            >
              <div className="w-full flex flex-col items-center">
                {/* Input card FIRST */}
                <div
                  className="input-card rounded-2xl relative"
                  style={{ width: "40%", maxWidth: "840px", minWidth: "520px", padding: 18, boxSizing: "border-box" }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <textarea
                        ref={textareaRef}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Paste or type a product review here..."
                        className="w-full bg-transparent outline-none resize-none"
                        style={{ color: "#343434", fontSize: 16, lineHeight: 1.5, minHeight: 60, maxHeight: 200, overflowY: "auto", padding: "8px 12px", border: "none", resize: "none" }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, paddingBottom: 6 }}>
                      {/* Mode selector */}
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          className="mode-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModeOpen((v) => !v);
                          }}
                          style={{
                            height: 42,
                            padding: "0 12px",
                            borderRadius: 999,
                            border: "1px solid rgba(52,52,52,0.14)",
                            background: "rgba(255,255,255,0.78)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#343434",
                            fontWeight: 800,
                          }}
                        >
                          {mode === "speed" ? <Zap size={16} className="icon-glow-hover" /> : <Sparkles size={16} className="icon-glow-hover" />}
                          <span style={{ fontSize: 13 }}>{ModeLabel(mode)}</span>
                          <ChevronDown size={16} />
                        </button>

                        <AnimatePresence>
                          {modeOpen && (
                            <motion.div
                              key="panel"
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              className="mode-panel"
                              style={{ position: "absolute", right: 0, bottom: 52, width: 320, borderRadius: 16, padding: 10 }}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              {(["speed", "insight"] as Mode[]).map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => {
                                    setMode(m);
                                    setModeOpen(false);
                                  }}
                                  className="w-full text-left rounded-xl"
                                  style={{
                                    padding: "10px 12px",
                                    border: "none",
                                    background: m === mode ? "rgba(167,139,250,0.14)" : "transparent",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div
                                      style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 12,
                                        background:
                                          m === "speed"
                                            ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.25))"
                                            : "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(99,102,241,0.25))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {m === "speed" ? <Zap size={18} /> : <Sparkles size={18} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 900, color: "#343434", fontSize: 14 }}>{ModeLabel(m)}</div>
                                      <div style={{ color: "rgba(52,52,52,0.62)", fontSize: 12, marginTop: 2 }}>{ModeDesc(m)}</div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Send */}
                      <button
                        onClick={handleAnalyze}
                        disabled={!reviewText.trim() || state === "loading"}
                        className="send-btn rounded-full flex items-center justify-center"
                        style={{ width: 42, height: 42, backgroundColor: "#343434", border: "none" }}
                      >
                        <Send className="w-[18px] h-[18px] text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hint UNDER the card, with fixed height so card never jumps */}
                <div
                  style={{
                    height: 28,
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <AnimatePresence>
                    {state === "idle" && !reviewText && !displayedReview && (
                      <motion.div
                        key="hint"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-center"
                        style={{ fontSize: 18, color: "rgba(52,52,52,0.42)", fontFamily: "Inter, sans-serif" }}
                      >
                        Enter a review below to analyze its authenticity
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Footer (fade out but keep space => no shift/glitch) */}
        <motion.footer
          initial={false}
          animate={{ opacity: isAbout ? 0 : 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            pointerEvents: isAbout ? "none" : "auto",
          }}
          className="flex items-center justify-center pb-10"
        >
          <div style={{ display: "flex", gap: 30, alignItems: "center", paddingBottom: 50 }}>
            <button className="footer-link" style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
              Privacy Policy
            </button>
            <span style={{ color: "rgba(52,52,52,0.35)", fontSize: 14 }}>•</span>
            <button className="footer-link" style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
              Contact
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
