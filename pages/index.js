import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Q&A", href: "#faq" },
];

const userTypes = [
  { icon: "🧑‍💻", title: "Casual" },
  { icon: "🎮", title: "Pro Gamer" },
  { icon: "🚀", title: "Power User" },
];

const pricing = [
  { name: "Free Trial", price: "$0", features: ["Basic mirroring", "Standard latency", "Limited support"], cta: "Start Free" },
  { name: "Basic", price: "$2.99/mo", features: ["HD mirroring", "Low latency", "Email support"], cta: "Choose Basic" },
  { name: "Pro", price: "$4.99/mo", features: ["Ultra-low latency", "Priority support", "All devices"], cta: "Go Pro" },
  { name: "Premium", price: "$9.99/mo", features: ["All Pro features", "Gaming mode", "Early access"], cta: "Get Premium" },
];

const faqs = [
  {
    q: "What platforms does NxV Reflect support?",
    a: "NxV Reflect works on Windows, macOS, Android, and iOS devices.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! You can try all basic features for free with our trial plan.",
  },
  {
    q: "Is it good for gaming?",
    a: "Absolutely. Our Pro and Premium plans are optimized for ultra-low latency gaming.",
  },
  {
    q: "How do I get support?",
    a: "All paid plans include priority support. Free users get community support.",
  },
  {
    q: "Can I use it on multiple devices?",
    a: "Yes, Pro and Premium plans support unlimited devices.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activePlan, setActivePlan] = useState(0);
  const cardRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const pricingSectionRef = useRef(null);

  // Scroll to card on tab click
  const handleTabClick = (idx) => {
    setActivePlan(idx);
    if (cardRefs.current[idx]) {
      cardRefs.current[idx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Update active tab on window scroll, only when pricing section is in view
  useEffect(() => {
    const handleScroll = () => {
      if (!cardRefs.current.length || !pricingSectionRef.current) return;
      const sectionRect = pricingSectionRef.current.getBoundingClientRect();
      // Only update if the section is in the viewport
      if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) return;
      let closestIdx = 0;
      let minDist = Infinity;
      cardRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // Compare the card's center to the window's center
          const cardCenter = rect.top + rect.height / 2;
          const windowCenter = window.innerHeight / 2;
          const dist = Math.abs(cardCenter - windowCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
          }
        }
      });
      setActivePlan(closestIdx);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
    <div className="bg-cover bg-center fixed top-0 left-0 w-screen h-screen z-[-1]" style={{backgroundImage: `url('/bg.avif')`}}></div>
    <div className=" min-h-screen text-white font-mono">
      <Head>
        <title>NxV Reflect – Next-Gen Screen Mirroring</title>
        <meta name="description" content="Ultra low latency screen mirroring app. Experience lightning-fast mirroring at an affordable price." />
      </Head>
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-5 border-b border-neutral-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-widest text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>NxV Reflect</span>
        </div>
        <div className="hidden md:flex gap-8 text-base font-medium items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-blue-400 transition-colors duration-200">
              {link.name}
            </a>
          ))}
          <a href="#download" className="ml-6 px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all duration-200 border border-white/10">
            Download
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="backdrop-blur-[12px]">
      <section id="home" className="grid grid-cols-2  items-center justify-between gap-12 px-8 py-24 max-w-7xl mx-auto relative min-h-[100vh] " >
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-5xl font-extrabold my-[10px] tracking-tight text-white leading-[70px]" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
            Next-Gen Screen Mirroring
          </motion.h1>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl font-medium my-[20px] text-white" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            Lightning-fast. Affordable. Built for gamers.
          </motion.h2>
          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} href="#download" className="inline-block px-8 py-3 rounded-full bg-white text-black text-lg font-bold tracking-wide hover:bg-neutral-200 transition-all duration-200 border border-white/10 mt-[20px]">
            Download Now
          </motion.a>
        </div>
        {/* Right: Realistic Image Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <Image className="w-[500px] h-[500px] " src={"/mobile.png"} alt="Phone to PC" width={500} height={500} />
        </div>
      </section>
      </div>

      {/* Pricing Section with Vertical Tabs */}
      <section id="pricing" className="flex flex-row relative min-h-[400vh]" ref={pricingSectionRef}>
        {/* Left: Vertical Tabs */}
        <div className="md:w-1/3 w-full bg-black flex flex-col items-center justify-center px-6 py-8 md:py-0 sticky top-0 h-screen">
          <h3 className="text-2xl font-bold mb-8 text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>Choose Your Plan</h3>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {pricing.map((plan, idx) => (
              <button
                key={plan.name}
                onClick={() => handleTabClick(idx)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 text-base focus:outline-none text-left ${activePlan === idx ? 'bg-blue-700 text-white shadow' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Pricing Cards Scrollable */}
        <div
          className="md:w-2/3 w-full flex flex-col items-center justify-start px-4 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
          style={{ height: '400vh' }}
          ref={scrollContainerRef}
        >
          {pricing.map((plan, i) => (
            <div ref={el => cardRefs.current[i] = el} className="h-screen w-full flex justify-center items-center" key={plan.name} style={{ height: '100vh', marginBottom: i !== pricing.length - 1 ? '2rem' : 0 }}>
            <div
              
              className="w-full max-w-xl flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-neutral-200 shadow-lg px-8 py-12 mb-12"
              
            >
              <div className="text-3xl md:text-5xl font-bold mb-4 text-blue-700" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>{plan.name}</div>
              <div className="text-5xl md:text-7xl font-extrabold mb-8 text-neutral-900" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>{plan.price}</div>
              <ul className="mb-10 text-neutral-700 text-lg md:text-xl space-y-3" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a href="#download" className="px-10 py-4 rounded-full bg-blue-700 text-white font-semibold text-lg md:text-xl hover:bg-blue-800 transition-all duration-200 border border-blue-700/10" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {plan.cta}
              </a>
            </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <div className="backdrop-blur-[12px] py-20">

      <section id="faq" className="px-4 max-w-5xl mx-auto h-[70vh]">
        <h3 className="text-[xx-large] font-bold mb-14 text-center text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <motion.div
            key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="border border-neutral-800 rounded-xl bg-white text-black overflow-hidden h-fit min-w-0"
              >
              <span
                className="block w-full text-left px-6 py-5 font-semibold flex justify-between items-center focus:outline-none" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <span className={`ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </span>
              <div
                className={`px-6 pb-5 text-neutral-800 text-base transition-all duration-300 ease-in-out ${openFaq === i ? ' block' : ' hidden'} overflow-hidden`}
                style={{ fontFamily: 'Roboto Mono, monospace' }}
              >
                <h2> {faq.a} </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

                </div>
      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-8 bg-black border-t border-neutral-800  gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-widest text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>NxV Reflect</span>
        </div>
        <div className="flex gap-6">
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          <a href="#terms" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* Instagram SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.338 2.396 3.511 2.338 4.788.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.33 2.45 1.298 3.417.967.967 2.14 1.24 3.417 1.298C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.058 2.45-.33 3.417-1.298.967-.967 1.24-2.14 1.298-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.33-2.45-1.298-3.417-.967-.967-2.14-1.24-3.417-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* Twitter SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* YouTube SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.692 3.5 12 3.5 12 3.5s-7.692 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 7.88 0 12 0 12s0 4.12.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.308 20.5 12 20.5 12 20.5s7.692 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 16.12 24 12 24 12s0-4.12-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </footer>
    </div>
    </>
  );
}