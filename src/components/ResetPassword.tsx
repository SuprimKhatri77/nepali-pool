"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "../../server/actions/reset-password/resetPassword";
import { Spinner } from "./ui/spinner";

export default function ResetPassword({ token }: { token: string }) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [inputType, setInputType] = useState<string>("password");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<{ newPassword: string[] | undefined }>({
    newPassword: undefined,
  });

  const router = useRouter();

  const handleClick = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsPending(true);

    try {
      const result = await resetPassword(newPassword, token);
      if (!result.success && result.error && result.message) {
        toast.error(result.message);
        setError(result.error);
      }

      if (result.success && result.message && result.redirectTo) {
        toast.success(result.message);
        setTimeout(() => {
          router.replace(result.redirectTo as string);
        }, 1500);
      }
    } catch{
      toast.error("Something went wrong!");
    } finally {
      setNewPassword("");
      setConfirmNewPassword("");
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Reset your Password
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600">
            Enter your new password and confirm it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={inputType}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                onClick={() =>
                  setInputType(inputType === "password" ? "text" : "password")
                }
              >
                {inputType === "password" ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmNewPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={inputType}
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                onClick={() =>
                  setInputType(inputType === "password" ? "text" : "password")
                }
              >
                {inputType === "password" ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            {error.newPassword !== undefined ? (
              <p className="text-sm text-center text-red-600">
                {error.newPassword[0]}
              </p>
            ) : (
              <p className="text-sm text-center text-gray-700">
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={isPending || !newPassword || !confirmNewPassword}
            onClick={handleClick}
          >
            {isPending ? <Spinner /> : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
