import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export default async function Home() {
  let count = 0;
  let dbError = null;

  try {
    // Check if any brand exists
    const result = await query("SELECT COUNT(*) as count FROM brands");
    count = parseInt(String(result.rows[0].count));
  } catch (error: any) {
    console.error("Database connection error in home page:", error);
    dbError = error.message || "Unknown database error";
  }

  if (dbError) {
    const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/tact";
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":******@");

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-xl glass p-8 border border-red-500/20 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.1)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h1 className="text-xl font-bold tracking-tight text-red-400">Database Connection Error</h1>
          </div>
          
          <p className="text-sm text-white/70 leading-relaxed">
            The application failed to connect to your PostgreSQL database. To run TACT Content OS locally, you must have a PostgreSQL instance running.
          </p>

          <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">Database URL</p>
            <code className="text-xs text-yellow-400 font-mono break-all">{maskedUrl}</code>
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">Error Details</p>
            <code className="text-xs text-red-400 font-mono block whitespace-pre-wrap">{dbError}</code>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">How to fix this:</h3>
            <ol className="text-xs text-white/60 list-decimal list-inside space-y-2 leading-relaxed">
              <li>
                <strong>Start PostgreSQL:</strong> Make sure your PostgreSQL server is active.
              </li>
              <li>
                <strong>Or run with Docker:</strong> Use this command to spin up a local instance:
                <pre className="mt-2 bg-black/60 p-3 rounded-lg border border-white/10 font-mono text-[11px] text-green-400 overflow-x-auto select-all">
                  docker run --name tact-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tact -p 5432:5432 -d postgres
                </pre>
              </li>
              <li>
                <strong>Check your environment:</strong> Ensure your credentials match the ones in your <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">.env</code> file.
              </li>
            </ol>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <a 
              href="/" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs font-medium transition-all duration-300"
            >
              Retry Connection
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (count === 0) {
    // No brands → go to onboarding
    redirect("/onboarding");
  } else {
    // Brand exists → go to dashboard
    redirect("/dashboard");
  }
}

