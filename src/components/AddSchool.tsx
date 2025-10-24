"use client";
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

import {
  type FormState,
  addSchool,
} from "../../server/actions/add-school/addSchool";
import { AddSchoolType } from "../../types/all-types";

export default function AddSchool({
  className,
  currentUserId,
  ...props
}: AddSchoolType) {
  const initialState: FormState = {
    errors: {},
  } as FormState;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    addSchool,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast(state.message);
      setTimeout(() => {
        // router.replace("/dashboard/student");
      }, 1500);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
   <div
  className={cn(
    "flex flex-col gap-6 max-w-[700px] mx-auto justify-center min-h-screen py-7",
    className
  )}
  {...props}
>
  <Card>
    <CardHeader>
      <CardTitle>Add New School</CardTitle>
      <CardDescription>
        Add a new school to provide students with more options.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form action={formAction}>
        <div className="flex flex-col gap-6">

          {/* School Info */}
          <div className="grid gap-3">
            <Label htmlFor="name">School Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={state.inputs?.name}
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Address Section */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                required
                defaultValue={state.inputs?.address}
              />
              {state.errors?.address && (
                <p className="text-sm text-destructive">{state.errors.address[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                required
                defaultValue={state.inputs?.city}
              />
              {state.errors?.city && (
                <p className="text-sm text-destructive">{state.errors.city[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="prefecture">Prefecture</Label>
              <Input
                type="text"
                id="prefecture"
                name="prefecture"
                required
                defaultValue={state.inputs?.prefecture}
              />
              {state.errors?.prefecture && (
                <p className="text-sm text-destructive">{state.errors.prefecture[0]}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={state.inputs?.email}
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                required
                defaultValue={state.inputs?.websiteUrl}
              />
              {state.errors?.websiteUrl && (
                <p className="text-sm text-destructive">{state.errors.websiteUrl[0]}</p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="grid gap-3">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              type="url"
              id="imageUrl"
              name="imageUrl"
              required
              defaultValue={state.inputs?.imageUrl}
            />
            {state.errors?.imageUrl && (
              <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>
            )}
          </div>

          {/* Submit Section */}
          <div className="flex flex-col gap-3 mt-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
            {state.message && !state.success && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
          </div>

          <input type="hidden" name="userId" value={currentUserId} />
        </div>
      </form>
    </CardContent>
  </Card>
</div>

  );
}
