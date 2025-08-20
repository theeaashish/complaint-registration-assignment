import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
      <div className="relative flex min-h-svh flex-col items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {children}

          <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of Service
          </span>{" "}
          and <span>Privacy Policy</span>
        </div>
      </div>
      </div>
    );
}