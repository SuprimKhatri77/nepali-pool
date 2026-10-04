"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";
import CustomProfileUploader from "@/components/CustomImageButton";
import {
  createServiceBooking,
  type BookingFormState,
} from "../../../server/actions/service-booking/create-booking";

type Props = {
  serviceId: string;
  defaults: { fullName: string; email: string; whatsappNumber: string };
};

const initialState: BookingFormState = {};

export default function BookServiceForm({ serviceId, defaults }: Props) {
  const [state, formAction, isPending] = useActionState(
    createServiceBooking,
    initialState,
  );
  const [proofUrl, setProofUrl] = useState("");

  // Success redirects server-side to the student's bookings page, so only failures land here.
  useEffect(() => {
    if (state !== initialState && state.message) toast.error(state.message);
  }, [state]);

  const value = (field: keyof typeof defaults) =>
    state.inputs?.[field] ?? defaults[field];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="space-y-1.5">
        <Label>Payment screenshot</Label>
        <CustomProfileUploader
          endpoint="paymentImageUploader"
          imageUploadName="Payment screenshot"
          currentImage={proofUrl || undefined}
          onUploadComplete={setProofUrl}
        />
        <input type="hidden" name="paymentProofUrl" value={proofUrl} />
        {state.errors?.paymentProofUrl && (
          <FieldError>{state.errors.paymentProofUrl[0]}</FieldError>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="paymentReference">Transaction ID (optional)</Label>
        <Input
          id="paymentReference"
          name="paymentReference"
          maxLength={100}
          placeholder="Helps the mentor find your payment"
          defaultValue={state.inputs?.paymentReference ?? ""}
        />
        {state.errors?.paymentReference && (
          <FieldError>{state.errors.paymentReference[0]}</FieldError>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          maxLength={100}
          autoComplete="name"
          defaultValue={value("fullName")}
        />
        {state.errors?.fullName && <FieldError>{state.errors.fullName[0]}</FieldError>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            maxLength={255}
            autoComplete="email"
            defaultValue={value("email")}
          />
          {state.errors?.email && <FieldError>{state.errors.email[0]}</FieldError>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="whatsappNumber">WhatsApp number</Label>
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            placeholder="+9779812345678"
            defaultValue={value("whatsappNumber")}
          />
          {state.errors?.whatsappNumber && (
            <FieldError>{state.errors.whatsappNumber[0]}</FieldError>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Notes for the mentor (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Your background, goals, preferred time to talk…"
          defaultValue={state.inputs?.message ?? ""}
        />
        {state.errors?.message && <FieldError>{state.errors.message[0]}</FieldError>}
      </div>

      <Button
        type="submit"
        disabled={isPending || !proofUrl}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
      >
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {proofUrl ? "Submit booking" : "Upload your payment screenshot to continue"}
      </Button>
    </form>
  );
}
