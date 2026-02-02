import { Shield, Lock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "inspector" | "lab";

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "w-[240px] justify-between border-white/10 bg-black/40 backdrop-blur text-sm font-medium transition-all duration-300",
              currentRole === "inspector" 
                ? "border-primary/50 text-primary shadow-[0_0_15px_-3px_rgba(0,102,255,0.4)]" 
                : "border-purple-500/50 text-purple-400 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
            )}
          >
            <div className="flex items-center gap-2">
              {currentRole === "inspector" ? (
                <>
                  <Shield className="h-4 w-4" />
                  <span>UN Inspector Access</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Lab Secure Enclave</span>
                </>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px] bg-card border-white/10 text-white">
          <DropdownMenuItem 
            onClick={() => onRoleChange("inspector")}
            className="flex items-center gap-2 cursor-pointer focus:bg-primary/20 focus:text-primary"
          >
            <Shield className="h-4 w-4" />
            UN Inspector Access
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onRoleChange("lab")}
            className="flex items-center gap-2 cursor-pointer focus:bg-purple-500/20 focus:text-purple-400"
          >
            <Lock className="h-4 w-4" />
            Lab Secure Enclave
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
