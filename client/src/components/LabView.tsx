import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLabSubmissionSchema } from "@shared/schema";
import { useSubmitLabData, useLatestSubmission } from "@/hooks/use-lab";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, FileKey, ShieldCheck, Activity, Cpu, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

// Enhance schema for form validation with refine/transform if needed
// using z.coerce in the component before submission if schema is strict
const formSchema = insertLabSubmissionSchema;

export function LabView() {
  const { mutate: submitData, isPending } = useSubmitLabData();
  const { data: latestSubmission } = useLatestSubmission();
  const [encryptionStep, setEncryptionStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labName: "",
      modelName: "",
      compute: 0,
      cbrnSafeguards: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Simulate multi-step encryption process visual
    setEncryptionStep(1);
    setTimeout(() => setEncryptionStep(2), 800);
    setTimeout(() => {
      submitData(data, {
        onSuccess: () => {
          setEncryptionStep(0);
          form.reset();
        }
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-8">
      
      {/* LEFT: Input Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel border-l-4 border-l-purple-500 bg-black/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-mono uppercase tracking-wider text-purple-100">
                  Data Ingestion
                </CardTitle>
                <CardDescription className="text-purple-300/60">
                  Secure pipeline for model registration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="labName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">Organization ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="e.g. OMEGA-LABS-SF" {...field} className="bg-black/50 border-white/10 font-mono text-purple-100 focus:border-purple-500/50 pl-10 h-12" />
                          <Activity className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">Model Codename</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="e.g. PROJECT-TITAN-V9" {...field} className="bg-black/50 border-white/10 font-mono text-purple-100 focus:border-purple-500/50 pl-10 h-12" />
                          <FileKey className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono uppercase text-muted-foreground">Training Compute (FLOPs)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            step="any"
                            placeholder="1.5e25" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="bg-black/50 border-white/10 font-mono text-purple-100 focus:border-purple-500/50 pl-10 h-12" 
                          />
                          <Cpu className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground font-mono">
                        Scientific notation supported (e.g. 1.2e26)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cbrnSafeguards"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 bg-black/30 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-500 border-white/20"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-purple-100">
                          CBRN Safeguards Enabled
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Model weights include alignment for Chemical, Biological, Radiological, and Nuclear safety.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending || encryptionStep > 0}
                  className="w-full h-14 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-mono uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-900/20"
                >
                  {isPending || encryptionStep > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {encryptionStep === 1 && "Hashing Weights..."}
                      {encryptionStep === 2 && "Anchoring to Ledger..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Encrypt & Anchor
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* RIGHT: Status Monitor */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <Card className="glass-panel border-t-4 border-t-purple-500 bg-black/60 h-full">
          <CardHeader>
            <CardTitle className="text-xl font-mono uppercase text-purple-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              Secure Enclave Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-sm space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Enclave ID</span>
                <span className="text-purple-300">ENC-8839-ALPHA</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Encryption</span>
                <span className="text-purple-300">AES-256-GCM + ZK-SNARK</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Node Status</span>
                <span className="text-green-400 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  ONLINE
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Latest Ledger Entry</h3>
              
              <AnimatePresence mode="wait">
                {latestSubmission ? (
                  <motion.div 
                    key={latestSubmission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded border border-purple-500/30 bg-purple-500/5 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                      <Lock className="h-12 w-12 text-purple-500/10" />
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">CONFIRMED</Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(latestSubmission.createdAt || "").toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-[10px] uppercase text-muted-foreground font-mono">Model</div>
                          <div className="text-sm font-medium text-white">{latestSubmission.modelName}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-muted-foreground font-mono">Compute</div>
                          <div className="text-sm font-medium text-white font-mono">{latestSubmission.compute.toExponential(2)} FLOPs</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-purple-500/20">
                        <div className="text-[10px] uppercase text-muted-foreground font-mono mb-1">Cryptographic Signature</div>
                        <div className="font-mono text-[10px] text-purple-300 break-all bg-black/30 p-2 rounded border border-purple-500/20">
                          {latestSubmission.signature}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded">
                    No active models anchored in this session.
                  </div>
                )}
              </AnimatePresence>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
