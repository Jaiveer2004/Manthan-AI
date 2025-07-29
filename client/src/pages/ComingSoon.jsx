import ParticleBackground from "../components/ParticlesBackground";
import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async () => {
    if (!email) {
      showNotification("error", "Please enter an email!");
      return;
    }

    if (!validateEmail(email)) {
      showNotification("error", "Please enter a valid email address!");
      return;
    }

    // Prevent duplicate submissions for the same email
    if (email === lastSubmittedEmail && isLoading) {
      return;
    }

    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "edu",
    ];
    const domain = email.split("@")[1];
    const isCommonDomain = commonDomains.some((commonDomain) => {
      return domain.includes(commonDomain);
    });

    if (!isCommonDomain) {
      const confirmUncommon = confirm(
        "We noticed you're using a less common email provider. Would you like to continue?"
      );
      if (!confirmUncommon) return;
    }

    setIsLoading(true);
    setLastSubmittedEmail(email);

    try {
      // Add timeout for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/email/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok) {
        showNotification(
          "success",
          "Successfully subscribed! Check your email for confirmation. 🎉"
        );
        setEmail("");
      } else {
        showNotification("error", data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      if (err.name === 'AbortError') {
        showNotification(
          "error",
          "Request timeout. Please try again."
        );
      } else {
        showNotification(
          "error",
          "Network error. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white flex flex-col items-center justify-center px-6 py-16 space-y-8 overflow-hidden">
      {/* Particles in background layer */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full h-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="heading font-extrabold tracking-tight animate-fade-in-up">
            Manthan.
          </h1>
          <p className="sub-heading text-xl md:text-2xl text-gray-300 opacity-80">
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
            className="email-id px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:bg-slate-900 focus:ring-blue-500 w-72 disabled:opacity-50 disabled:cursor-not-allowed"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-slate-950 hover:bg-slate-900 transition text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                Notify Me <span>🚀</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-700/50 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6">
            {/* Left side - Brand */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold text-lg">Manthan</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">AI Study Companion</span>
            </div>

            {/* Right side - Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                © 2025 Manthan AI. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Built with ❤️ for students
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Loading Modal - highest z-index */}
      {isLoading && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)', // Add for Safari support
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-slate-800 rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-white text-lg">Subscribing...</p>
            <p className="text-gray-400 text-sm">
              Please wait while we process your request
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-600 border-l-4 border-green-400"
              : "bg-red-600 border-l-4 border-red-400"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="text-white font-medium">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:text-gray-200 ml-4"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
