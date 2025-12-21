"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LoginForm from "./LoginForm";

const LoginFormAny: any = LoginForm;

export function LoginDialog({ open, onOpenChange, onSwitchToSignup }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 rounded-2xl">
        {/* Required for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Login</DialogTitle>
        </VisuallyHidden>

        <LoginFormAny onSwitchToSignup={onSwitchToSignup} />
      </DialogContent>
    </Dialog>
  );
}
