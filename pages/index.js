import { motion } from "framer-motion";
import Head from "next/head";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact" },
];

const features = [
  {
    icon: "🔁",
    title: "Real-time Sync",
    desc: "Instantly mirror your screen with zero lag.",
  },
  {
    icon: "🚀",
    title: "Ultra-low Latency",
    desc: "Experience seamless mirroring for work or play.",
  },
  {
    icon: "💰",
    title: "Affordable Plans",
    desc: "Premium features at a price you’ll love.",
  },
  {
    icon: "🎮",
    title: "Optimized for Gaming",
    desc: "Game-ready performance for every session.",
  },
];

const pricing = [
  {
    name: "Free Trial",
    price: "$0",
    features: ["Basic mirroring", "Standard latency", "Limited support"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$4.99/mo",
    features: ["Ultra-low latency", "Priority support", "All devices"],
    cta: "Go Pro",
  },
  {
    name: "Premium",
    price: "$9.99/mo",
    features: ["All Pro features", "Gaming mode", "Early access"],
    cta: "Get Premium",
  },
];

export default function Home() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white font-sans relative overflow-x-hidden">
      <Head>
        <title>NxV Reflect – Next-Gen Screen Mirroring</title>
        <meta name="description" content="Ultra low latency screen mirroring app. Experience lightning-fast mirroring at an affordable price." />
      </Head>
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-5 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* Logo SVG Placeholder */}
          <span className="text-2xl font-extrabold tracking-widest text-cyan-400 drop-shadow-glow">NxV Reflect</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-cyan-400 transition-colors duration-200">
              {link.name}
            </a>
          ))}
        </div>
        <a href="#download" className="ml-6 px-6 py-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30 text-white font-semibold text-sm hover:bg-cyan-400 transition-all duration-200 border border-cyan-400/30 animate-pulse-glow">
          Download
        </a>
      </nav>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center text-center py-24 px-4 relative">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white drop-shadow-glow">
          Next-Gen Screen Mirroring Experience
        </motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl font-medium mb-2 text-cyan-300">
          Ultra Low Latency. Zero Compromise.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="mb-8 text-base md:text-lg text-white/80">
          Experience lightning-fast mirroring at an affordable price.
        </motion.p>
        {/* Animated Device Visual */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="flex items-center justify-center gap-8 mb-10">
          {/* Phone SVG */}
          <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-glow">
            <rect x="5" y="5" width="70" height="150" rx="18" fill="#181f2f" stroke="#00fff7" strokeWidth="3" />
            <circle cx="40" cy="145" r="5" fill="#00fff7" />
          </svg>
          {/* Glowing connection */}
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-12 h-2 rounded-full bg-cyan-400/60 blur-md" />
          {/* PC SVG */}
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-glow">
            <rect x="10" y="10" width="100" height="50" rx="8" fill="#181f2f" stroke="#00fff7" strokeWidth="3" />
            <rect x="40" y="65" width="40" height="8" rx="2" fill="#00fff7" />
          </svg>
        </motion.div>
        <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} href="#download" className="inline-block px-10 py-4 rounded-full bg-cyan-500 shadow-xl shadow-cyan-500/40 text-white text-lg font-bold tracking-wide hover:bg-cyan-400 transition-all duration-200 border border-cyan-400/30 animate-pulse-glow">
          Download Now
        </motion.a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center text-white drop-shadow-glow">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white/5 border border-cyan-400/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg shadow-cyan-400/10 backdrop-blur-md hover:scale-105 hover:shadow-cyan-400/30 transition-transform duration-300"
            >
              <div className="text-4xl mb-4 drop-shadow-glow">{f.icon}</div>
              <div className="text-xl font-semibold mb-2 text-cyan-300">{f.title}</div>
              <div className="text-white/80 text-sm">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center text-white drop-shadow-glow">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white/5 border border-cyan-400/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg shadow-cyan-400/10 backdrop-blur-md hover:scale-105 hover:shadow-cyan-400/30 transition-transform duration-300"
            >
              <div className="text-2xl font-bold mb-2 text-cyan-300">{plan.name}</div>
              <div className="text-4xl font-extrabold mb-4 text-white drop-shadow-glow">{plan.price}</div>
              <ul className="mb-6 text-white/80 text-sm space-y-1">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a href="#download" className="mt-auto px-6 py-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30 text-white font-semibold text-sm hover:bg-cyan-400 transition-all duration-200 border border-cyan-400/30 animate-pulse-glow">
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-8 bg-white/5 border-t border-white/10 mt-16 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-widest text-cyan-400 drop-shadow-glow">NxV Reflect</span>
        </div>
        <div className="flex gap-6">
          <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms</a>
          <a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.338 2.396 3.511 2.338 4.788.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.33 2.45 1.298 3.417.967.967 2.14 1.24 3.417 1.298C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.058 2.45-.33 3.417-1.298.967-.967 1.24-2.14 1.298-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.33-2.45-1.298-3.417-.967-.967-2.14-1.24-3.417-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
        </div>
      </footer>

      {/* Glow/Glass Effects */}
      <style jsx global>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px #00fff7) drop-shadow(0 0 16px #00fff7);
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite alternate;
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 16px #00fff7, 0 0 32px #00fff7; }
          100% { box-shadow: 0 0 32px #00fff7, 0 0 64px #00fff7; }
        }
      `}</style>
    </div>
  );
}
