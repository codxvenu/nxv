import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Q&A", href: "#faq" },
];

const userTypes = [
  { icon: "🧑‍💻", title: "Casual" },
  { icon: "🎮", title: "Pro Gamer" },
  { icon: "🚀", title: "Power User" },
];

const premiumFeatures = [
  {
    icon: "⚡",
    title: "Ultra-Low Latency",
    description: "Experience near real-time mirroring with our optimized streaming technology that reduces lag to under 50ms."
  },
  {
    icon: "🖥️",
    title: "4K Resolution",
    description: "Mirror your phone screen in stunning 4K resolution with HDR support for the most vibrant colors."
  },
  {
    icon: "🎯",
    title: "120FPS Smoothness",
    description: "Buttery smooth mirroring at 120 frames per second makes gaming and scrolling feel native."
  },
  {
    icon: "📶",
    title: "Wireless & Wired",
    description: "Connect via WiFi for convenience or USB for maximum performance and stability."
  },
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    description: "Your data stays private with military-grade encryption during transmission."
  },
  {
    icon: "🎮",
    title: "Game Mode",
    description: "Special optimizations for mobile gaming with controller support and performance tuning."
  }
];

const howItWorksSteps = [
  {
    number: "1",
    title: "Install NxV Cast on your PC",
    description: "Download and install our lightweight desktop application"
  },
  {
    number: "2", 
    title: "Connect your phone via USB or WiFi",
    description: "Choose your preferred connection method for optimal performance"
  },
  {
    number: "3",
    title: "Launch & enjoy ultra-smooth 4K mirroring",
    description: "Start mirroring instantly with zero configuration required"
  }
];

const testimonials = [
  {
    rating: 5,
    feedback: "Game changer! The 120FPS mode makes mobile gaming on PC feel native. No more lag or stuttering.",
    name: "Rahul",
    device: "Poco X4 Pro"
  },
  {
    rating: 5,
    feedback: "Perfect for streaming my phone screen during presentations. The 4K quality is incredible.",
    name: "Sarah",
    device: "iPhone 15 Pro"
  },
  {
    rating: 5,
    feedback: "Finally found a mirroring app that actually works without lag. Worth every penny!",
    name: "Alex",
    device: "Samsung Galaxy S23"
  }
];

const pricing = [
  {
    name: "Free Trial",
    price: "$0",
    features: [
      "720p quality",
      "10Mbps bitrate",
      "30/60 FPS",
      "Lowest latency",
      "Limited support"
    ],
    cta: "Start Free"
  },
  {
    name: "Basic",
    price: "$2.99/mo",
    features: [
      "Up to 1080p HD",
      "10–40Mbps bitrate",
      "30–90 FPS",
      "Low latency",
      "Email support"
    ],
    cta: "Choose Basic"
  },
  {
    name: "Pro",
    price: "$4.99/mo",
    features: [
      "Up to 1440p",
      "10–80Mbps bitrate",
      "30–120 FPS",
      "Ultra-low latency",
      "Priority support"
    ],
    cta: "Go Pro"
  },
  {
    name: "Premium",
    price: "$9.99/mo",
    features: [
      "Up to 4K (2160p)",
      "Max bitrate",
      "30–240 FPS ⚡",
      "Gaming mode 🎮",
      "All Pro features",
      "Early access"
    ],
    cta: "Get Premium"
  }
];


const faqs = [
  {
    q: "What platforms does NxV Cast support?",
    a: "NxV Cast works on Windows, macOS, Android, and iOS devices.",
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    deviceModel: '',
    rating: 5,
    feedback: ''
  });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const cardRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Check user authentication on mount
  useEffect(() => {
    checkAuth();
    fetchReviews();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Fetch approved reviews
      const approvedResponse = await fetch('/api/get-reviews', {
        credentials: 'include'
      });
      const approvedData = await approvedResponse.json();
      
      // Fetch pending reviews for testing (since new reviews start as pending)
      const pendingResponse = await fetch('/api/get-pending-reviews', {
        credentials: 'include'
      });
      const pendingData = await pendingResponse.json();
      
      // Combine approved and pending reviews, prioritizing approved ones
      let allReviews = [];
      if (approvedData.success && approvedData.reviews) {
        allReviews = [...approvedData.reviews];
      }
      if (pendingData.success && pendingData.reviews) {
        allReviews = [...allReviews, ...pendingData.reviews];
      }
      
      // Take only the first 3 reviews
      setReviews(allReviews.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setShowProfile(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Scroll to card on tab click
  const handleTabClick = (idx) => {
    setActivePlan(idx);
    if (cardRefs.current[idx]) {
      cardRefs.current[idx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Video controls
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  // Payment handlers
  const handlePayment = async (plan) => {
    if (!user) {
      setPaymentError('Please sign in to purchase a plan');
      return;
    }

    setIsPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(null);

    try {
      // Get plan amount
      const planAmounts = {
        'Free Trial': 0,
        'Basic': 299,
        'Pro': 499,
        'Premium': 999
      };

      const amount = planAmounts[plan];

      if (plan === 'Free Trial') {
        // Handle free trial
        setPaymentSuccess('Free trial activated successfully!');
        await checkAuth(); // Refresh user data
        setIsPaymentLoading(false);
        return;
      }

      // Create payment order
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plan: plan,
          amount: amount,
          currency: 'INR'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'NxV Cast',
        description: `${plan} Plan`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setPaymentSuccess(`Payment successful! ${plan} plan activated.`);
              await checkAuth(); // Refresh user data
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            setPaymentError(error.message);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setIsPaymentLoading(false);
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

  // Copy to clipboard utility
  const handleCopyKey = async (key) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(key);
      } else {
        // fallback for older browsers/mobile
        const textArea = document.createElement('textarea');
        textArea.value = key;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setCopied(false);
      alert('Failed to copy. Please copy manually.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setReviewError('Please sign in to submit a review');
      return;
    }

    setIsReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const response = await fetch('/api/create-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (data.success) {
        setReviewSuccess(data.message);
        setReviewForm({
          name: '',
          deviceModel: '',
          rating: 5,
          feedback: ''
        });
        setShowReviewForm(false);
        setShowReviews(false); // Close mobile dropdown
        // Refresh reviews after submission to show the new review
        await fetchReviews();
      } else {
        setReviewError(data.message);
      }
    } catch (error) {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const handleReviewInputChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to approve the latest review for testing
  const approveLatestReview = async () => {
    try {
      const response = await fetch('/api/get-pending-reviews', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success && data.reviews && data.reviews.length > 0) {
        const latestReview = data.reviews[0];
        
        const approveResponse = await fetch('/api/approve-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            reviewId: latestReview.id
          }),
        });
        
        const approveData = await approveResponse.json();
        
        if (approveData.success) {
          alert('Review approved! Refreshing reviews...');
          await fetchReviews();
        } else {
          alert('Failed to approve review');
        }
      } else {
        alert('No pending reviews found');
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
      alert('Failed to approve review');
    }
  };

  return (
    <>
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="beforeInteractive"
    />
    <div className="bg-cover bg-center fixed top-0 left-0 w-screen h-screen z-[-1]" style={{backgroundImage: `url('/bg.avif')`}}></div>
    <div className=" min-h-screen text-white font-mono">
      <Head>
        <title>NxV Cast – Next-Gen Screen Mirroring</title>
        <meta name="description" content="Ultra low latency screen mirroring app. Experience lightning-fast mirroring at an affordable price." />
      </Head>

      {/* Payment Status Notifications */}
      {paymentSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{paymentSuccess}</span>
            <button 
              onClick={() => setPaymentSuccess(null)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {paymentError && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{paymentError}</span>
            <button 
              onClick={() => setPaymentError(null)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between max-[768px]:px-3 px-8 py-5 border-b border-neutral-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        {/* Left: Hamburger + Brand (mobile), Brand only (desktop) */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-white/10 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Open menu"
            type="button"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Brand name */}
          <span className="max-[768px]:text-[16px] text-2xl font-extrabold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>NxV Cast</span>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-base font-medium items-center flex-1 justify-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-blue-400 transition-colors duration-200">
              {link.name}
            </a>
          ))}
        </div>
        {/* User Authentication/Profile (right) */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {!isUserLoading && (
            <>
              {/* On mobile: show profile button if logged in, nothing if not logged in */}
              <div className="md:hidden">
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-[14px] font-medium uppercase" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {user.name}
                      </span>
                      <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {/* Profile Dropdown (mobile) */}
                    {showProfile && (
                      <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md !bg-black !bg-[rgba(0,0,0,0.7)] border border-white/20 rounded-xl p-4 shadow-lg z-50">
                        <div className="space-y-4">
                          <div className="border-b border-white/20 pb-3">
                            <h3 className="text-lg font-bold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                              {user.name}
                            </h3>
                            <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                              {user.email}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Current Plan:</span>
                              <span className="text-blue-400 font-semibold tracking-[2px]" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                                {user.currentPlan}
                              </span>
                            </div>
                            {user.planEndDate && (
                              <div className="flex justify-between items-center">
                                <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Expires:</span>
                                <span className="text-white/60 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                                  {new Date(user.planEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-white/20 pt-3">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Pc Key:</span>
                                <button
                                  onClick={() => handleCopyKey(user.apiKey)}
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                  type="button"
                                >
                                  Copy
                                </button>
                              </div>
                              {copied && (
                                <span className="ml-2 text-green-400 text-xs">Copied!</span>
                              )}
                              <div className="bg-black/30 p-2 rounded text-xs text-white/60 font-mono break-all">
                                {user.apiKey}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            style={{ fontFamily: 'Roboto Mono, monospace' }}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* On desktop: show profile or sign in/up as before */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white font-medium uppercase" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {user.name}
                      </span>
                      <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {/* Profile Dropdown (desktop) */}
                    {showProfile && (
                      <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md max-[768px]:!bg-black !bg-[rgba(0,0,0,0.7)] border border-white/20 rounded-xl p-4 shadow-lg z-50">
                        <div className="space-y-4">
                          <div className="border-b border-white/20 pb-3">
                            <h3 className="text-lg font-bold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                              {user.name}
                            </h3>
                            <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                              {user.email}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Current Plan:</span>
                              <span className="text-blue-400 font-semibold tracking-[2px]" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                                {user.currentPlan}
                              </span>
                            </div>
                            {user.planEndDate && (
                              <div className="flex justify-between items-center">
                                <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Expires:</span>
                                <span className="text-white/60 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                                  {new Date(user.planEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-white/20 pt-3">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Pc Key:</span>
                                <button
                                  onClick={() => handleCopyKey(user.apiKey)}
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                  type="button"
                                >
                                  Copy
                                </button>
                              </div>
                              {copied && (
                                <span className="ml-2 text-green-400 text-xs">Copied!</span>
                              )}
                              <div className="bg-black/30 p-2 rounded text-xs text-white/60 font-mono break-all">
                                {user.apiKey}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            style={{ fontFamily: 'Roboto Mono, monospace' }}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Only show sign in/up on desktop
                  <div className="flex gap-3">
                    <Link href="/login" className="px-4 py-2 text-white hover:text-blue-400 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
        >
          <div className="absolute top-0 left-0 right-0 bg-black/95 border-b border-neutral-800 p-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-extrabold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>NxV Cast</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-start justify-start h-full space-y-5 mt-20 px-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 text-lg font-[16px] tracking-[1px] text-white hover:text-blue-400 transition-colors duration-200 w-full py-3 border-b border-white/10"
                style={{ fontFamily: 'Roboto Mono, monospace' }}
              >
                {/* Icons for each link */}
                {link.name === "Home" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {link.name === "Features" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {link.name === "How It Works" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {link.name === "Pricing" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )}
                {link.name === "Testimonials" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
                {link.name === "Q&A" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {link.name}
              </motion.a>
            ))}
            
            {/* Mobile Auth Buttons */}
            {!isUserLoading && !user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex gap-4 mt-8 w-full px-4"
              >
                <Link 
                  href="/login" 
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-white hover:text-blue-400 transition-colors text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-[13px] hover:bg-white/20"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-[13px] bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 text-base"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up
                </Link>
              </motion.div>
            )}
            
            {/* Mobile User Profile */}
            {!isUserLoading && user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex flex-col items-center gap-4 mt-8 w-full"
              >
                <div className="text-center w-full">
                  <h3 className="text-xl font-bold tracking-[2px] text-white mb-2" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                    {user.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {user.email}
                  </p>
                  <p className="text-blue-400 font-semibold tracking-[2px]" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                    {user.currentPlan}
                  </p>
                </div>
                
                <div className="space-y-3 w-full">
                  <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>PC Key:</span>
                      <button
                        onClick={() => handleCopyKey(user.apiKey)}
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        type="button"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <div className="bg-black/50 p-2 rounded text-xs text-white/60 font-mono break-all" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      {user.apiKey}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Roboto Mono, monospace' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="backdrop-blur-[12px]">
      <section id="home" className="flex flex-col md:grid md:grid-cols-2 items-center justify-between gap-8 md:gap-12 px-4 md:px-8 py-12 md:py-24 max-w-7xl mx-auto relative min-h-[80vh] md:min-h-[100vh]">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl w-full">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[2px] my-4 md:my-[10px] text-white leading-tight md:leading-[70px]" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
            Next-Gen Screen Mirroring
          </motion.h1>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-base sm:text-lg md:text-2xl font-medium my-4 md:my-[20px] text-white" style={{ fontFamily: 'Roboto Mono, monospace' }}>
            Lightning-fast. Affordable. Built for gamers.
          </motion.h2>
          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} href="#download" className="inline-block px-6 md:px-8 py-2.5 md:py-3 rounded-[10px] bg-white text-black text-base md:text-lg font-bold tracking-wide hover:bg-neutral-200 transition-all duration-200 border border-white/10 mt-4 md:mt-[20px]">
            Download Now
          </motion.a>
        </div>
        {/* Right: Realistic Image Placeholder */}
        <div className="flex-1 flex items-center justify-center w-full max-[768px]:hidden">
          <Image className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]" src={"/mobile.png"} alt="Phone to PC" width={500} height={500} />
        </div>
      </section>
      </div>

      {/* Premium Features Section */}
      <div className="backdrop-blur-[12px] py-20">
        <section id="features" className="px-4 max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-extrabold tracking-[2px] mb-16 text-center text-white" 
            style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
          >
            Premium Features
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold tracking-[2px] mb-3 text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* How It Works Section */}
      <div className="backdrop-blur-[12px] py-20">
        <section id="how-it-works" className="px-4 max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-extrabold tracking-[2px] mb-16 text-center text-white" 
            style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
          >
            How NxV Cast Works
          </motion.h2>
          
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 capitalize ">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold tracking-[2px] mb-3 text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-white/80 text-base" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl min-[768px]:p-8 px-4 py-8 text-center">
              <h3 className="text-2xl font-bold tracking-[2px] mb-4 text-white max-[768px]:mb-6" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Watch How It Works
              </h3>
              <div 
                className="lg:h-[350px] bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer group max-[768px]:aspect-[16/9] mx-auto"
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                onClick={handleVideoClick}
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover max-[768px]:aspect-[16/9] mx-auto"
                  onEnded={handleVideoEnded}
                  muted
                >
                  <source src="https://youtu.be/dQw4w9WgXcQ" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Overlay UI */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isVideoPlaying ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div className={`text-white/60 text-lg transition-all duration-300 ${
                    isVideoHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    <svg 
                      className={`lg:w-16 lg:h-16 w-12 h-12 mx-auto  transition-all duration-300 ${
                        isVideoHovered ? 'scale-110 animate-bounce' : 'scale-100'
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                   
                  </div>
                </div>
                
                {/* Pause Button (shown when playing) */}
                {isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 rounded-full p-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </div>

     


      {/* Pricing Section with Vertical Tabs */}
      <section id="pricing" className="flex flex-col md:flex-row relative min-[768px]:min-h-[400vh]" ref={pricingSectionRef}>
        {/* Left: Vertical Tabs (becomes horizontal on mobile) */}
        <div className="w-full md:w-1/3 bg-black flex flex-col items-center justify-center max-[768px]:px-0 px-2 md:px-6 py-4 md:py-8 sticky top-0 h-fit md:h-screen z-10 pt-[80px]">
          <h3 className="text-lg md:text-2xl font-bold tracking-[2px] mb-4 md:mb-8 text-white w-full text-center" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>Choose Your Plan</h3>
          <div className="flex md:flex-col flex-row max-[768px]:gap-0  gap-2 md:gap-4 w-full lg:max-w-xs md:max-w-xs justify-center md:justify-start">
            {pricing.map((plan, idx) => (
              <button
              key={plan.name}
                onClick={() => handleTabClick(idx)}
                className={`max-[768px]:px-3 px-5 max-[768px]:text-[13px]  md:px-6 py-2 md:py-3 max-[768px]:py-[13px] min-[768px]:rounded-full max-[768px]:border-0 tracking-[2px] font-semibold transition-all duration-200 text-sm md:text-base focus:outline-none text-left ${activePlan === idx ? 'bg-blue-700 text-white shadow' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
                >
                {plan.name}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Pricing Cards Scrollable */}
        <div
          className="w-full md:w-2/3 flex flex-col items-center justify-start px-2 md:px-4 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
          style={{ }}
          ref={scrollContainerRef}
        >
          {pricing.map((plan, i) => (
            <div ref={el => cardRefs.current[i] = el} className="md:h-[100vh] md:h-screen w-full flex justify-center items-center " key={plan.name} style={{ marginBottom: i !== pricing.length - 1 ? '1rem' : 0 }}>
              <div
                className="w-full max-w-md md:max-w-xl flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-neutral-200 shadow-lg px-4 md:px-8 py-8 md:py-12 mb-8 md:mb-12 max-[768px]:h-[calc(100vh-194.73px)]"
              >
                <div className="text-2xl md:text-5xl font-bold tracking-[2px] mb-4 text-blue-700" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>{plan.name}</div>
                <div className="text-4xl md:text-7xl font-extrabold tracking-[2px] mb-8 text-neutral-900" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>{plan.price}</div>
                <ul className="mb-8 md:mb-10 text-neutral-700 text-base md:text-xl space-y-3 text-start" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <button 
                  onClick={() => handlePayment(plan.name)}
                  disabled={isPaymentLoading}
                  className={`px-8 md:px-10 py-3 md:py-4 rounded-[13px] font-semibold text-base md:text-lg transition-all duration-200 border ${
                    isPaymentLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-700 text-white hover:bg-blue-800 border-blue-700/10'
                  }`} 
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                >
                  {isPaymentLoading ? 'Processing...' : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
          {/* Testimonials Section */}
      </section>
      <div className="backdrop-blur-[12px] py-20">
        <section id="testimonials" className="px-4 max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-extrabold tracking-[2px] mb-16 text-center text-white" 
            style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
          >
            What Users Say
          </motion.h2>
          
          {/* Reviews Grid - Show existing reviews first */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {isReviewsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-pulse">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-gray-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <div className="h-20 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    "{review.feedback}"
                  </p>
                  <div className="text-white/70 text-xs" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {review.name} • {review.device_model}
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback to static testimonials if no reviews
              testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    "{testimonial.feedback}"
                  </p>
                  <div className="text-white/70 text-xs" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {testimonial.name} • {testimonial.device}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Review Form Section - Horizontal on big devices */}
          <div className=" md:grid-cols-2 gap-6">
            {/* Mobile Review Button - Only shown on mobile */}
            {!showReviews && (
            <div>
             <button
               onClick={() => setShowReviews(true)}
               className="mx-auto px-6 h-full backdrop-blur-md border bg-white/10 border-white/20 rounded-[13px] w-fit p-4  hover:bg-white/15 transition-all duration-300 flex flex-col items-center justify-center"
             >
              Write a Review ✍️
             </button>
           </div>)}
           
           {/* Mobile Review Form Dropdown */}
           {showReviews && (
           <div className="md:hidden col-span-full">
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 overflow-hidden"
             >
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                   Write a Review
                 </h3>
                 <button
                   onClick={() => setShowReviews(false)}
                   className="text-white/70 hover:text-white text-xl"
                 >
                   ×
                 </button>
               </div>
               
               {/* Review Status Messages */}
               {reviewSuccess && (
                 <div className="mb-4 p-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded text-sm">
                   {reviewSuccess}
                 </div>
               )}

               {reviewError && (
                 <div className="mb-4 p-2 bg-red-500/20 border border-red-400/50 text-red-300 rounded text-sm">
                   {reviewError}
                 </div>
               )}

               <form onSubmit={handleReviewSubmit} className="space-y-4">
                 {/* Name Field */}
                 <div>
                   <label className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                     Your Name *
                   </label>
                   <input
                     type="text"
                     value={reviewForm.name}
                     onChange={(e) => handleReviewInputChange('name', e.target.value)}
                     className="w-full px-3 py-2 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                     placeholder="Enter your name"
                     required
                   />
                 </div>

                 {/* Device Model Field */}
                 <div>
                   <label className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                     Device Model *
                   </label>
                   <input
                     type="text"
                     value={reviewForm.deviceModel}
                     onChange={(e) => handleReviewInputChange('deviceModel', e.target.value)}
                     className="w-full px-3 py-2 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                     placeholder="e.g., iPhone 15 Pro"
                     required
                   />
                 </div>

                 {/* Rating Field */}
                 <div>
                   <label className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                     Rating *
                   </label>
                   <div className="flex gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => handleReviewInputChange('rating', star)}
                         className={`text-xl transition-colors ${
                           star <= reviewForm.rating ? 'text-yellow-400' : 'text-white/30'
                         }`}
                       >
                         ⭐
                       </button>
                     ))}
                   </div>
                   <p className="text-sm text-white/60 mt-1">
                     {reviewForm.rating} out of 5 stars
                   </p>
                 </div>

                 {/* Feedback Field */}
                 <div>
                   <label className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                     Your Review *
                   </label>
                   <textarea
                     value={reviewForm.feedback}
                     onChange={(e) => handleReviewInputChange('feedback', e.target.value)}
                     className="w-full px-3 py-2 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent resize-none"
                     rows="4"
                     placeholder="Share your experience..."
                     required
                     minLength="10"
                   />
                   <p className="text-sm text-white/60 mt-1">
                     Min 10 characters
                   </p>
                 </div>

                 {/* Submit Button */}
                 <div className="flex gap-3 pt-2">
                   <button
                     type="button"
                     onClick={() => setShowReviews(false)}
                     className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                     style={{ fontFamily: 'Roboto Mono, monospace' }}
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={isReviewSubmitting}
                     className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                       isReviewSubmitting
                         ? 'bg-gray-500 text-white cursor-not-allowed'
                         : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}
                     style={{ fontFamily: 'Roboto Mono, monospace' }}
                   >
                     {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
                   </button>
                 </div>
               </form>
             </motion.div>
           </div>)}

            {/* Desktop Review Form - Hidden on mobile, shown on desktop */}
            <div className={showReviews ? "hidden md:block w-full max-w-[70vw] mx-auto" : "hidden"}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 h-full">
                <h3 className="text-lg font-bold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }} onClick={() => setShowReviews(false)}>
                  Write a Review
                </h3>
                
                {/* Review Status Messages */}
                {reviewSuccess && (
                  <div className="mb-4 p-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded text-sm">
                    {reviewSuccess}
                  </div>
                )}

                {reviewError && (
                  <div className="mb-4 p-2 bg-red-500/20 border border-red-400/50 text-red-300 rounded text-sm">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => handleReviewInputChange('name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Device Model Field */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      Device Model *
                    </label>
                    <input
                      type="text"
                      value={reviewForm.deviceModel}
                      onChange={(e) => handleReviewInputChange('deviceModel', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                      placeholder="e.g., iPhone 15 Pro"
                      required
                    />
                  </div>

                  {/* Rating Field */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleReviewInputChange('rating', star)}
                          className={`text-lg transition-colors ${
                            star <= reviewForm.rating ? 'text-yellow-400' : 'text-white/30'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      {reviewForm.rating} out of 5 stars
                    </p>
                  </div>

                  {/* Feedback Field */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      Your Review *
                    </label>
                    <textarea
                      value={reviewForm.feedback}
                      onChange={(e) => handleReviewInputChange('feedback', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-white/20 rounded bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-blue-400 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Share your experience..."
                      required
                      minLength="10"
                    />
                    <p className="text-xs text-white/60 mt-1">
                      Min 10 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isReviewSubmitting}
                    className={`w-fit mx-auto px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isReviewSubmitting
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    style={{ fontFamily: 'Roboto Mono, monospace' }}
                  >
                    {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ Section */}
      <div className="backdrop-blur-[12px] pt-20 pb-10">

      <section id="faq" className="px-4 max-w-5xl mx-auto min-[768px]:h-[70vh]">
        <h3 className="text-[xx-large] font-bold tracking-[2px] mb-14 text-center text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>Frequently Asked Questions</h3>
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
                className="block w-full text-left px-6 py-5 font-semibold tracking-[2px] flex justify-between items-center focus:outline-none" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
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

               
                 {/* Conversion Banner */}
   
        <section className="px-4 max-w-4xl mx-auto text-center max-[768px]:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-[2px] mb-4 text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
              Ready to Experience 4K 120FPS Mirroring?
            </h2>
            <p className="text-white/80 text-lg mb-8" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              Join thousands of users who have transformed how they use their phones with NxV Cast Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#download" className="px-8 py-3 rounded-[13px] bg-white text-black font-bold tracking-[2px] hover:bg-neutral-200 transition-all duration-200" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Download Now
              </a>
              <a href="#pricing" className="px-8 py-3 rounded-[13px] bg-blue-600 text-white font-bold tracking-[2px] hover:bg-blue-700 transition-all duration-200 border border-blue-600" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                View Pricing
              </a>
            </div>
          </motion.div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-8 bg-black border-t border-neutral-800  gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-[2px] text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>NxV Cast</span>
        </div>
        <div className="flex gap-6">
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          <a href="#terms" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
        <div className="flex gap-4">
          <a href="https://instagram.com/nvxcast" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* Instagram SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 448 512">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
    </svg>
          </a>
          <a href="https://twitter.com/nvxcast" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* Twitter SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
          <a href="https://youtube.com/nvxcast" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            {/* YouTube SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
        </div>
      </footer>
    </div>
    </>
  );
}