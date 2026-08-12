"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const SignInForm = () => {
  const handleSocialSignIn = (provider: "google" | "github") => {
    authClient.signIn.social({
      provider: provider,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6 text-center">
          {/* Vangrex Logo */}
          <div className="mx-auto -mb-3 flex size-12 items-center justify-center">
            <Logo height={100} width={100} />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Choose a provider to Sign Up with Vangrex.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={() => handleSocialSignIn("google")}
            type="button"
            variant="outline"
            className="w-full"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              />
              <path
                fill="currentColor"
                d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
              />
              <path
                fill="currentColor"
                d="M6.54 13.83A5.86 5.86 0 0 1 6.24 12c0-.64.11-1.26.3-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53Z"
              />
              <path
                fill="currentColor"
                d="M12 6.14c1.43 0 2.7.49 3.71 1.46l2.78-2.78C16.83 3.25 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to Vangrex&apos;s Terms of Service and
            Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
