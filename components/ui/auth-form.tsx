"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authenticate, signUp } from "@/lib/actions";

export function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [signInError, signInAction, isSignInPending] = useActionState(
    authenticate,
    undefined
  );

  const [signUpError, signUpAction, isSignUpPending] = useActionState(
    signUp,
    undefined
  );

  const isPending = mode === "signin" ? isSignInPending : isSignUpPending;

  const error = mode === "signin" ? signInError : signUpError;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Toggle Switch */}
      <div className="inline-flex rounded-lg border bg-muted p-1 w-full">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            mode === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            mode === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form
        action={mode === "signin" ? signInAction : signUpAction}
        className="space-y-4"
      >
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select name="country">
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="mx">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? mode === "signin"
              ? "Signing In..."
              : "Signing Up..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
