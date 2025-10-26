"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormState,
  UpdateUserRole,
} from "../../server/actions/select-role/selectRole";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { UserCircle, GraduationCap, Users } from "lucide-react";

export default function SelectRolePage() {
  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
    timestamp: Date.now(),
    redirectTo: "",
  };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    UpdateUserRole,
    initialState
  );
  const [role, setRole] = useState("");
  const params = useSearchParams();
  const router = useRouter();

  const message = params.get("message");

  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { position: "top-right" });

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState(null, "", url.toString());
    }
  }, [message]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (state.success && state.message) {
      toast.message(state.message);
      timeout = setTimeout(() => {
        router.replace(state.redirectTo as string);
      }, 2000);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
    return () => clearTimeout(timeout);
  }, [state.message, state.success, state.timestamp, router, state.redirectTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <UserCircle className="w-9 h-9 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            One More Step!
          </h1>

          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            It looks like you skipped role selection during sign-up. No worries!
            Let&apos;s get you set up with the right account type.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`relative bg-white border-2 rounded-xl p-6 text-left transition-all hover:shadow-lg ${
              role === "student"
                ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "border-gray-200 hover:border-emerald-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  role === "student" ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <GraduationCap
                  className={`w-6 h-6 ${
                    role === "student" ? "text-emerald-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  Student
                  {role === "student" && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      Selected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  Looking to learn, grow, and connect with experienced mentors
                  in your field.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`relative bg-white border-2 rounded-xl p-6 text-left transition-all hover:shadow-lg ${
              role === "mentor"
                ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "border-gray-200 hover:border-emerald-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  role === "mentor" ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <Users
                  className={`w-6 h-6 ${
                    role === "mentor" ? "text-emerald-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  Mentor
                  {role === "mentor" && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      Selected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  Ready to share your expertise and guide the next generation of
                  professionals.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Form Section */}
        <form action={formAction} className="space-y-6">
          {/* Hidden Select for Form Submission */}
          <div className="hidden">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setRole(value)} value={role}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent id="role">
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} required />
          </div>

          {/* Error Display */}
          {state.errors?.role && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">
                {state.errors.role[0]}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending || !role}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? "Setting up your account..." : "Continue"}
          </Button>

          {/* Helper Text */}
          <p className="text-center text-sm text-gray-500">
            You can&apos;t change this later.
          </p>
        </form>

        {/* Info Banner */}
        <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p className="text-sm text-emerald-800 text-center">
            <span className="font-semibold">💡 Quick tip:</span> Your role
            determines what features and content you&apos;ll see. Choose the one
            that best fits your goals!
          </p>
        </div>
      </div>
    </div>
  );
}
