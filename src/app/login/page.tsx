"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogIn, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de red al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setGoogleLoading(true);
    // Mock standard Google OAuth popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "",
      "Google Sign In",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Sign in with Google</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { background-color: #0b0f19; color: #ffffff; font-family: sans-serif; }
            </style>
          </head>
          <body class="flex flex-col items-center justify-center h-screen p-6 select-none">
            <div class="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-6 backdrop-blur-xl">
              <div class="flex justify-center">
                <svg class="h-10 w-10" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.83 2.97C6.18 7.35 8.87 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.89c2.26-2.09 3.54-5.17 3.54-8.71z"/>
                  <path fill="#FBBC05" d="M5.25 10.51c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.42 2.92C.52 4.73 0 6.78 0 8.94s.52 4.21 1.42 6.02l3.83-2.97z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.89-2.98c-1.08.72-2.47 1.15-4.07 1.15-3.13 0-5.82-2.31-6.75-5.43L1.42 14.8C3.37 18.69 7.35 21 12 23z"/>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-white">Choose account</h2>
              <div class="space-y-3">
                <button id="select-account" class="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-left transition-all">
                  <div class="h-8 w-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    NC
                  </div>
                  <div>
                    <p class="text-xs font-bold text-white">Next Content Digital</p>
                    <p class="text-[10px] text-white/40">admin@nextcontent.digital</p>
                  </div>
                </button>
              </div>
              <p class="text-[10px] text-white/30">To continue, Google will share your name, email address, and profile picture with Tact Content OS.</p>
            </div>
            <script>
              document.getElementById('select-account').addEventListener('click', () => {
                window.opener.postMessage({ type: 'google-login-success', email: 'admin@nextcontent.digital' }, '*');
                window.close();
              });
            </script>
          </body>
        </html>
      `);
    }

    // Listen for mock popup response
    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === "google-login-success") {
        window.removeEventListener("message", handleMessage);
        try {
          // Log in using mock google credentials
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: event.data.email, password: "tact2026!" }),
          });
          if (res.ok) {
            router.push("/");
          } else {
            setError("Google Mock Authentication failed on database sync.");
          }
        } catch (err) {
          setError("Network error finishing Google sign-in.");
        } finally {
          setGoogleLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a1a] overflow-hidden px-4 select-none">
      {/* Aurora Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,136,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#00ff88]/5 blur-[120px] pointer-events-none animate-pulse" />

      {/* Main card */}
      <div className="w-full max-w-md glass border border-white/[0.08] p-8 space-y-6 z-10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] font-bold text-lg mb-2 shadow-[0_0_24px_rgba(0,255,136,0.12)]">
            T
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight heading-brutal">
            TACT CONTENT OS
          </h2>
          <p className="text-xs text-white/40 font-mono tracking-wider uppercase">
            Workspace Authentication
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-white/30" />
              <Input
                type="email"
                placeholder="admin@nextcontent.digital"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input pl-10 h-10 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-white/30" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input pl-10 h-10 text-xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#00ff88] hover:bg-[#00e077] text-black font-bold h-10 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.15)] flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">O bien</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        {/* Google OAuth Mockup */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/8 text-white rounded-xl h-10 text-xs transition-all duration-300 font-bold"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#00ff88]" />
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.83 2.97C6.18 7.35 8.87 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.89c2.26-2.09 3.54-5.17 3.54-8.71z"/>
                <path fill="#FBBC05" d="M5.25 10.51c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.42 2.92C.52 4.73 0 6.78 0 8.94s.52 4.21 1.42 6.02l3.83-2.97z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.89-2.98c-1.08.72-2.47 1.15-4.07 1.15-3.13 0-5.82-2.31-6.75-5.43L1.42 14.8C3.37 18.69 7.35 21 12 23z"/>
              </svg>
              Sign In with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
