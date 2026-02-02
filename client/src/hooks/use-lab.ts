import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type SubmitLabDataInput, type VerificationResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useLatestSubmission() {
  return useQuery({
    queryKey: [api.lab.latest.path],
    queryFn: async () => {
      const res = await fetch(api.lab.latest.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch latest submission");
      const data = await res.json();
      return api.lab.latest.responses[200].parse(data);
    },
  });
}

export function useSubmitLabData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SubmitLabDataInput) => {
      // Small artificial delay to simulate encryption
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const validated = api.lab.submit.input.parse(data);
      const res = await fetch(api.lab.submit.path, {
        method: api.lab.submit.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.lab.submit.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit lab data");
      }
      return api.lab.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.lab.latest.path] });
      toast({
        title: "Secure Enclave Updated",
        description: "Model weights encrypted and anchored to ledger.",
        variant: "default",
        className: "bg-green-900 border-green-700 text-green-100",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useVerifySubmission() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (submissionId: number) => {
      const res = await fetch(api.inspection.verify.path, {
        method: api.inspection.verify.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Submission not found");
        throw new Error("Verification failed");
      }
      return api.inspection.verify.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Verification Protocol Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
