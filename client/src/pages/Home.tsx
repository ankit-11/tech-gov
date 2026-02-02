import { useState } from "react";
import { RoleSwitcher } from "@/components/ui/RoleSwitcher";
import { LabView } from "@/components/LabView";
import { InspectorView } from "@/components/InspectorView";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

type Role = "inspector" | "lab";

export default function Home() {
  const [role, setRole] = useState<Role>("inspector");

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary h-8 w-8 rounded flex items-center justify-center text-white shadow-[0_0_15px_-3px_rgba(0,102,255,0.6)]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase text-white">
                UN AI Oversight
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-mono">
                Department of Peacekeeping Operations
              </p>
            </div>
          </div>
          
          <RoleSwitcher currentRole={role} onRoleChange={setRole} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {role === "lab" ? <LabView /> : <InspectorView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          <div>System Status: OPERATIONAL</div>
          <div>Secure Connection: TLS 1.3 / AES-256</div>
        </div>
      </footer>

    </div>
  );
}
