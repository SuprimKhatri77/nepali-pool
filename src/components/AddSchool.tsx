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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

import {
  type FormState,
  addSchool,
} from "../../server/actions/add-school/addSchool";
import CustomProfileUploader from "./CustomImageButton";
import { AddSchoolType } from "../../types/all-types";

export default function AddSchool({
  className,
  currentUserId,
  ...props
}: AddSchoolType) {
  const initialState: FormState = {
    errors: {},
    success: false,
    message: "",
  } as FormState;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    addSchool,
    initialState
  );

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { position: "top-right" });
      setTimeout(() => setProfilePhotoUrl(""), 0);
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
          <CardTitle className="text-center">Add New Language School</CardTitle>
          <CardDescription className="text-center">
            Add a new school to provide students with more options.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-4">
                <Label
                  htmlFor="profilePhotoUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  Image of school*
                </Label>
                <CustomProfileUploader
                  currentImage={profilePhotoUrl}
                  onUploadComplete={(url: string) => setProfilePhotoUrl(url)}
                  imageUploadName="Upload School Photo"
                />
                <Input
                  type="hidden"
                  name="imageUrl"
                  value={profilePhotoUrl}
                  required
                />
                {state.errors?.imageUrl && (
                  <p className="text-red-500 text-sm">
                    {state.errors.imageUrl[0]}
                  </p>
                )}
              </div>

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
                  <p className="text-sm text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Address Section */}
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    required
                    defaultValue={state.inputs?.address}
                  />
                  {state.errors?.address && (
                    <p className="text-sm text-destructive">
                      {state.errors.address[0]}
                    </p>
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
                    <p className="text-sm text-destructive">
                      {state.errors.city[0]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    defaultValue={state.inputs?.postalCode}
                  />
                  {state.errors?.postalCode && (
                    <p className="text-sm text-destructive">
                      {state.errors.postalCode[0]}
                    </p>
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
                    <p className="text-sm text-destructive">
                      {state.errors.prefecture[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email of School</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    defaultValue={state.inputs?.email}
                  />
                  {state.errors?.email && (
                    <p className="text-sm text-destructive">
                      {state.errors.email[0]}
                    </p>
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
                    <p className="text-sm text-destructive">
                      {state.errors.websiteUrl[0]}
                    </p>
                  )}
                </div>
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
