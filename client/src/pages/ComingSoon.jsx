import ParticleBackground from "../components/ParticlesBackground";
import { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    if (!email) {
      return alert("Please enter an email!");
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Subscribed!");
        setEmail("");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white flex flex-col items-center justify-center px-6 py-16 space-y-8 overflow-hidden">
      <ParticleBackground />
      {/* Header */}
      <div className="text-center space-y-2 mt-20">
        <h1 className="heading font-extrabold tracking-tight animate-fade-in-up">
          Manthan.
        </h1>
        <p className="sub-heading text-xl md:text-2xl text-gray-300 opacity-80">
          {" "}
          Your AI-powered Study Companion
        </p>
      </div>

      {/* Subheading */}
      <p className="coming-soon max-w-2xl text-center text-gray-400 text-md md:text-lg">
        Coming Soon...
      </p>

      {/* Email Form */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for early access"
          className="email-id px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:bg-slate-900 focus:ring-blue-500 w-72"
        />
        <button 
          onClick={handleSubmit}
        className="bg-slate-950 hover:bg-slate-900 transition text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold">
          Notify Me <span>🚀</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <p className="footer">Manthan-AI Copyright 2025</p>
      </div>
    </div>
  );
}
