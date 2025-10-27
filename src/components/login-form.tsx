"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "./lib/utils";
import { FormState, SignIn } from "../../server/actions/auth/signin";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [toggleInputType, setToggleInputType] = useState<"text" | "password">(
    "password"
  );
  const initialState: FormState = {
    errors: {},
  };

  const router = useRouter();
  const params = useSearchParams();
  const message = params.get("message");
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    SignIn,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message && state.redirectTo) {
      toast(state.message);
      router.push(state.redirectTo);
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.timestamp, state.message, state.redirectTo, router, state.success]);

  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { position: "top-right", action:{
        label:"X",
        onClick: () => toast.dismiss()
      },
      duration: 3000});

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState(null, "", url.toString());
    }
  }, [message]);

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            defaultValue={state.inputs?.email}
            type="email"
            placeholder="m@example.com"
            disabled={isPending}
            required
            className="border-1 border-black rounded-[8px]"
          />
          {state.errors?.email && (
            <FieldError>{state.errors.email[0]}</FieldError>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            
          </div>
          <InputGroup className="border-1 border-black rounded-[8px]">
            <InputGroupInput
              id="password"
              disabled={isPending}
              name="password"
              defaultValue={state.inputs?.password}
              type={toggleInputType}
              required
            />
            <InputGroupAddon align="inline-end">
              {toggleInputType === "password" ? (
                <EyeOff
                  className="cursor-default"
                  onClick={() => setToggleInputType("text")}
                />
              ) : (
                <Eye
                  className="cursor-default"
                  onClick={() => setToggleInputType("password")}
                />
              )}
            </InputGroupAddon>
          </InputGroup>
          <div className="relative mb-1">
            <Link
              href="/forgot-password"
              className="absolute right-0 text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
         </div>
          {state.errors?.password && (
            <FieldError>{state.errors.password[0]}</FieldError>
          )}
         
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? (
              <div className="inline-block border-white-600 h-5 w-5 animate-spin rounded-full border-2 border-solid border-e-transparent">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="sm:px-6 text-center">
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
