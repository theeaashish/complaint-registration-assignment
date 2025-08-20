import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Header = async () => {
  const session = await getSession();

  async function logoutAction() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("session", "", { expires: new Date(0), path: "/" });
    redirect("/login");
  }

  return (
    <header className="flex items-center justify-between h-18  px-10">
      <div>
        <h1 className="text-lg font-semibold">Complaint Central</h1>
      </div>

      <div>
        {session?.user ? (
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <User className="size-4" /> Logout
            </Button>
          </form>
        ) : (
          <Button asChild variant="secondary" className="flex items-center gap-2">
            <Link href="/login">
              <LogOut className="size-4" /> Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
