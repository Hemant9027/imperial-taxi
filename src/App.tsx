import { useCallback, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import FareEstimator from "./components/FareEstimator.jsx";
import Tours from "./components/Tours.jsx";
import BookingForm from "./components/BookingForm.jsx";
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Steps from "./components/Steps.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";

type BookingPayload = { nonce: number } & Record<string, unknown>;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function App() {
  const [prefill, setPrefill] = useState<BookingPayload | null>(null);

  const requestBooking = useCallback((payload: BookingPayload) => {
    setPrefill(payload);
    const target = document.getElementById("booking");
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      <a
        href="#estimator"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-coral focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <FareEstimator onRequest={requestBooking} />
        <Tours onRequest={requestBooking} />
        <BookingForm prefill={prefill} />
        <Services />
        <About />
        <Steps />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
