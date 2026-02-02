import { useState } from "react";
import { useLatestSubmission, useVerifySubmission } from "@/hooks/use-lab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Globe, Download, CheckCircle, AlertTriangle, Search, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock verification steps for visual effect
const VERIFICATION_STEPS = [
  "Handshaking with Remote Enclave...",
  "Verifying Hardware Identity (H100 Cluster)...",
  "Injecting Blind Evaluation Code...",
  "Calculating FLOPs vs Threshold...",
  "Checking Red Line Constraints...",
  "Retrieving Cryptographic Proof...",
];

export function InspectorView() {
  const { data: latestSubmission } = useLatestSubmission();
  const { mutate: verify, isPending: isVerifying, data: result, isError } = useVerifySubmission();
  
  const [currentStep, setCurrentStep] = useState(0);

  const handleVerify = () => {
    if (!latestSubmission) return;
    
    // Start visual sequence
    setCurrentStep(0);
    
    // Simulate steps timing matching the backend delay roughly
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= VERIFICATION_STEPS.length - 1) {
        clearInterval(interval);
      }
    }, 800);

    // Actual mutation
    verify(latestSubmission.id);
  };

  const downloadReport = (id: number) => {
    // In a real app this would trigger a file download
    window.open(`/api/inspection/report/${id}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono">Monitored Nodes</p>
              <p className="text-2xl font-bold font-mono">142</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono">Global Compute</p>
              <p className="text-2xl font-bold font-mono">4.2 ZettaFLOPs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono">Compliance Rate</p>
              <p className="text-2xl font-bold font-mono">98.4%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono">Protocol Version</p>
              <p className="text-xl font-bold font-mono">v2.4 STRICT</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* LEFT: Map / Target Selection */}
        <Card className="lg:col-span-2 glass-panel border-white/10 bg-black/60 overflow-hidden relative min-h-[500px]">
          <div className="scanline" />
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Surveillance Grid
              </CardTitle>
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 animate-pulse">
                LIVE FEED
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative h-full min-h-[400px]">
            {/* Abstract Map Visual - CSS based grid map */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-10 grayscale invert" />
            
            {/* Nodes */}
            <div className="absolute top-[30%] left-[20%] group cursor-pointer">
              <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-primary rounded-full relative border-2 border-black" />
              <div className="absolute top-4 left-4 bg-black/90 border border-primary/30 p-2 text-xs font-mono rounded hidden group-hover:block z-20 w-32">
                <div className="text-primary font-bold">SAN FRANCISCO</div>
                <div className="text-muted-foreground">Status: ACTIVE</div>
              </div>
            </div>

            <div className="absolute top-[28%] left-[48%] group cursor-pointer">
              <div className="w-2 h-2 bg-primary/50 rounded-full relative" />
              <div className="absolute top-4 left-4 bg-black/90 border border-primary/30 p-2 text-xs font-mono rounded hidden group-hover:block z-20 w-32">
                <div className="text-primary font-bold">LONDON</div>
              </div>
            </div>

             <div className="absolute top-[35%] left-[85%] group cursor-pointer">
              <div className="w-2 h-2 bg-primary/50 rounded-full relative" />
              <div className="absolute top-4 left-4 bg-black/90 border border-primary/30 p-2 text-xs font-mono rounded hidden group-hover:block z-20 w-32">
                <div className="text-primary font-bold">TOKYO</div>
              </div>
            </div>

            {/* Selected Target Overlay */}
            <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur border border-white/10 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/20 rounded flex items-center justify-center border border-primary/30">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium font-mono uppercase">Target Node: OMEGA-LABS-SF</h3>
                    <p className="text-sm text-muted-foreground font-mono">IP: 192.168.44.X [SECURE TUNNEL]</p>
                  </div>
                </div>
                
                {latestSubmission ? (
                   <Button 
                    size="lg"
                    onClick={handleVerify}
                    disabled={isVerifying || !!result}
                    className={cn(
                      "font-mono uppercase tracking-widest min-w-[200px] h-12 shadow-lg",
                      result?.compliant 
                        ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" 
                        : "bg-primary hover:bg-blue-600 shadow-blue-900/20"
                    )}
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <Activity className="animate-spin h-4 w-4" />
                        Scanning...
                      </span>
                    ) : result ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Initiate Inspection
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="text-muted-foreground font-mono text-sm px-4 py-2 bg-white/5 rounded">
                    Waiting for lab signal...
                  </div>
                )}
               
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Inspection Logs / Results */}
        <Card className="glass-panel border-t-4 border-t-primary bg-black/60 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-mono uppercase tracking-widest text-primary">
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            
            {/* Pending State - Terminal Output */}
            {isVerifying && (
              <div className="font-mono text-xs space-y-2 text-green-400/80 bg-black/50 p-4 rounded border border-green-900/30">
                {VERIFICATION_STEPS.slice(0, currentStep + 1).map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="opacity-50 mr-2">{`>`}</span>
                    {step}
                  </motion.div>
                ))}
                <motion.div 
                  className="w-2 h-4 bg-green-500 animate-pulse inline-block align-middle ml-1"
                />
              </div>
            )}

            {/* Result State */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "p-6 rounded-lg border-2 text-center space-y-4",
                    result.compliant 
                      ? "border-green-500/50 bg-green-500/10" 
                      : "border-red-500/50 bg-red-500/10"
                  )}
                >
                  <div className="flex justify-center">
                    {result.compliant ? (
                      <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 text-green-500">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50 text-red-500">
                        <AlertTriangle className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className={cn("text-xl font-bold font-mono uppercase", result.compliant ? "text-green-400" : "text-red-400")}>
                      {result.status}
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-1 break-all">
                      Proof: {result.proofHash}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left text-sm font-mono bg-black/20 p-3 rounded">
                    <div className="text-muted-foreground">Compute Check:</div>
                    <div className={result.details.computeCheck ? "text-green-400" : "text-red-400"}>
                      {result.details.computeCheck ? "PASS" : "FAIL"}
                    </div>
                    <div className="text-muted-foreground">CBRN Check:</div>
                    <div className={result.details.cbrnCheck ? "text-green-400" : "text-red-400"}>
                      {result.details.cbrnCheck ? "PASS" : "FAIL"}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 hover:bg-white/5"
                    onClick={() => latestSubmission && downloadReport(latestSubmission.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download UN Certificate
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isVerifying && !result && (
               <div className="text-center py-12 text-muted-foreground opacity-50">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-mono text-sm">System Ready for Inspection</p>
               </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
