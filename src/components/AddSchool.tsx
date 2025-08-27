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
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

import { type FormState, addSchool } from "../../server/actions/addSchool";

type AddSchoolType = {
  className?: string;
  currentUserId: string;
};

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
  const router = useRouter();

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
  }, [state.success, router]);

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
            Add a new school for the students to get more options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={state.inputs?.name}
                />
                {state.errors?.name && (
                  <p className="text-sm text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={state.inputs?.address}
                  required
                />
                {state.errors?.address && (
                  <p className="text-sm text-destructive">
                    {state.errors.address[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={state.inputs?.city}
                  required
                />
                {state.errors?.city && (
                  <p className="text-sm text-destructive">
                    {state.errors.city[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="perfecture">Perfecture</Label>
                <Input
                  type="text"
                  id="perfecture"
                  name="perfecture"
                  defaultValue={state.inputs?.prefecture}
                  required
                />
                {state.errors?.prefecture && (
                  <p className="text-sm text-destructive">
                    {state.errors.prefecture[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="websiteUrl">Website Link</Label>
                <Input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  defaultValue={state.inputs?.websiteUrl}
                  required
                />
                {state.errors?.websiteUrl && (
                  <p className="text-sm text-destructive">
                    {state.errors.websiteUrl[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={state.inputs?.email}
                  required
                />
                {state.errors?.email && (
                  <p className="text-sm text-destructive">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="imageUrl">Image url</Label>
                <Input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={state.inputs?.imageUrl}
                  required
                />
                {state.errors?.imageUrl && (
                  <p className="text-sm text-destructive">
                    {state.errors.imageUrl[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting...." : "Submit"}
                </Button>
                {state.message && !state.success && (
                  <p className="text-sm text-destructive">{state.message}</p>
                )}
              </div>
            </div>
            <input type="hidden" name="userId" value={currentUserId} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
