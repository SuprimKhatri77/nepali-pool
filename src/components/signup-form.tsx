"use client";

import { cn } from "./lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormState, SignUp } from "../../server/actions/auth/signup";
import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const initialState: FormState = {
    errors: {},
  } as FormState;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    SignUp,
    initialState
  );

  const router = useRouter();
  const params = useSearchParams();
  const roleFromParams = params.get("role");
  const [toggleInputType, setToggleInputType] = useState<"text" | "password">(
    "password"
  );
  const [toggleConfirmInputType, setToggleConfirmInputType] = useState<"text" | "password">(
    "password"
  );
  const [password,setPassword] = useState(state.inputs?.password || "");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [confirmErr,setConfirmErr]=useState<string | null>(null)

  const [role, setRole] = useState(() => {
    if (roleFromParams) {
      if (!["student", "mentor"].includes(roleFromParams)) {
        return "";
      }
      return roleFromParams;
    }
    if (state.inputs?.role) return state.inputs.role;
    return "";
  });

  useEffect(() => {

  if (!confirmPassword) {
    setConfirmErr(null); // nothing to chec
    return;
  }

  if (password === confirmPassword) {
    setConfirmErr(null);
  } else {
    setConfirmErr("Password doesn't match");
  }
}, [confirmPassword,  password]);


  useEffect(() => {
    if (state.success && state.message && state.redirectTo) {
      toast.success(state.message);
      setTimeout(() => {
        router.replace(state.redirectTo as string);
      }, 1100);
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.message, state.success, state.redirectTo, router, state.timestamp]);

  // console.log("roleFromParams:", roleFromParams);
  // console.log("state.inputs?.role:", state.inputs?.role);
  // console.log("current role state:", role);

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
        </div>
        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
            <Input
              id="firstname"
              type="text"
              name="firstname"
              placeholder="John"
              defaultValue={state.inputs?.firstname}
              required
            />

            {state.errors?.firstname && (
              <FieldError>{state.errors.firstname[0]}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
            <Input
              id="lastname"
              type="text"
              name="lastname"
              placeholder="Doe"
              defaultValue={state.inputs?.lastname}
              required
            />
            {state.errors?.lastname && (
              <FieldError>{state.errors.lastname[0]}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            defaultValue={state.inputs?.email}
            placeholder="m@example.com"
            required
          />
          {state.errors?.email && (
            <FieldError>{state.errors.email[0]}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              onChange={(e) => setPassword(e.target.value)}
              type={toggleInputType}
              name="password"
              defaultValue={state.inputs?.password}
            />
            <InputGroupAddon align="inline-end">
              {toggleInputType === "text" ? (
                <EyeIcon
                  onClick={() => setToggleInputType("password")}
                  className="cursor-default"
                />
              ) : (
                <EyeOffIcon
                  onClick={() => setToggleInputType("text")}
                  className="cursor-default"
                />
              )}
            </InputGroupAddon>
          </InputGroup>
          {state.errors?.password && (
            <FieldError>{state.errors.password[0]}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={toggleConfirmInputType}
              name="confirmPassword"
            />
            <InputGroupAddon align="inline-end">
              {toggleConfirmInputType === "text" ? (
                <EyeIcon
                  onClick={() => setToggleConfirmInputType("password")}
                  className="cursor-default"
                />
              ) : (
                <EyeOffIcon
                  onClick={() => setToggleConfirmInputType("text")}
                  className="cursor-default"
                />
              )}
            </InputGroupAddon>
          </InputGroup>
          {confirmErr !== null && (
            <FieldError>{confirmErr}</FieldError>
          )}
        </Field>
        <Field className="space-y-2">
          <FieldLabel htmlFor="role" className="text-title text-sm">
            Role
          </FieldLabel>

          <Select
            value={role}
            // defaultValue={state.inputs?.role}
            onValueChange={(value) => setRole(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent id="role">
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="mentor">Mentor</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="role" value={role} required />
          {state.errors?.role && (
            <FieldError>{state.errors.role[0]}</FieldError>
          )}
        </Field>
        <Field>
          <Button
            
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isPending || confirmErr !== null}
          >
            {isPending ? (
              <div className="inline-block border-white-600 h-5 w-5 animate-spin rounded-full border-2 border-solid border-e-transparent">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
