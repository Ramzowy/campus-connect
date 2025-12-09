import Image from "next/image";
import { AuthForm } from "@/components/ui/auth-form";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Welcome to Campus Connect
          </h1>
          <p className="text-muted-foreground text-balance">
            Sign in to your account or create a new one
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
