import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login?message=Account created successfully! Please sign in.");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="bg-cover bg-center fixed top-0 left-0 w-screen h-screen z-[-1]" style={{backgroundImage: `url('/bg.avif')`}}></div>
      <div className="min-h-screen text-white font-mono flex items-center justify-center">
        <Head>
          <title>Sign Up - NxV Cast</title>
          <meta name="description" content="Create your NxV Cast account" />
        </Head>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md mx-4"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-[2px] text-white hover:text-blue-400 transition-colors" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                NxV Cast
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-[2px] mt-4 text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
              Create Account
            </h1>
            <p className="text-white/70 mt-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              Join thousands of users
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your full name"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your email"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Create a password (min 6 characters)"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Confirm your password"
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
} 