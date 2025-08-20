import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4">
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          <h1 className="text-sm">Admin Login Credentials</h1>
          <p>Email: admin@gmail.com</p>
          <p>Password: admin@123</p>
        </div>
      </div>
    </div>
  );
}
