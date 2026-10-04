"use client";

import {
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomProfileUploader from "@/components/CustomImageButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mentorDashboardKeys,
  mentorServicesQueryOptions,
} from "@/modules/mentor-dashboard/queries";
import { QueryErrorState } from "@/components/data-states/query-error-state";
import { MentorServicesSkeleton } from "@/components/dashboard/skeletons";
import type { MentorServicesData } from "../../../server/actions/mentor-dashboard/services";
import type { MentorServiceSelectType } from "../../../lib/db/schema";
import {
  saveMentorPaymentDetails,
  saveMentorService,
  setMentorServiceActive,
  type PaymentDetailsFormState,
  type ServiceFormState,
} from "../../../server/actions/mentor-services/manage-services";
import { formatDuration, formatNpr } from "./format";

// Loads the mentor's services and payment details on the client.
export default function ManageServices() {
  const { data, error, isError, refetch, isFetching } = useQuery(
    mentorServicesQueryOptions(),
  );

  // A failed background refetch keeps showing the data we have.
  if (data) return <ManageServicesContent {...data} />;
  if (!isError) return <MentorServicesSkeleton />;
  return (
    <div className="mx-auto max-w-5xl">
      <QueryErrorState
        title="Couldn't load your services"
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    </div>
  );
}

function ManageServicesContent({
  services,
  paymentInstructions,
  paymentQrUrl,
}: MentorServicesData) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MentorServiceSelectType | null>(null);
  // Remount the form each time the dialog opens so stale errors/inputs from a
  // previous submission don't leak into the next one.
  const [formKey, setFormKey] = useState(0);

  const openDialog = (service: MentorServiceSelectType | null) => {
    setEditing(service);
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  };

  const hasPaymentDetails = Boolean(paymentInstructions || paymentQrUrl);
  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-600 mt-1">
                List the services students can book and pay for.
              </p>
            </div>
            <Button
              onClick={() => openDialog(null)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add service
            </Button>
          </div>
        </div>

        {!hasPaymentDetails && (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              Students can&apos;t book your services until you add payment
              details below, because they need to know where to send the money.
            </p>
          </div>
        )}

        <PaymentDetailsCard
          paymentInstructions={paymentInstructions}
          paymentQrUrl={paymentQrUrl}
        />

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Services ({activeCount} active)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  You haven&apos;t added any services yet.
                </p>
                <Button
                  onClick={() => openDialog(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add your first service
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    onEdit={() => openDialog(service)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit service" : "Add a service"}</DialogTitle>
            <DialogDescription>
              Price is in NPR. Changes don&apos;t affect bookings already made.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            key={formKey}
            service={editing}
            onSaved={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceItem({
  service,
  onEdit,
}: {
  service: MentorServiceSelectType;
  onEdit: () => void;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const duration = formatDuration(service.durationMinutes);

  const toggle = () =>
    startTransition(async () => {
      const result = await setMentorServiceActive(service.id, !service.isActive);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
      // Refetch either way: on failure the service may have changed elsewhere.
      await queryClient.invalidateQueries({ queryKey: mentorDashboardKeys.all });
    });

  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-3 ${
        service.isActive ? "border-emerald-100 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 break-words min-w-0">
          {service.title}
        </h3>
        <Badge
          variant="outline"
          className={
            service.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0"
              : "bg-gray-100 text-gray-600 border-gray-200 shrink-0"
          }
        >
          {service.isActive ? "Active" : "Hidden"}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3 break-words">
        {service.description}
      </p>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-gray-900">{formatNpr(service.priceNpr)}</span>
        {duration && (
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" /> {duration}
          </span>
        )}
      </div>
      <div className="flex gap-2 pt-1 mt-auto">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button size="sm" variant="outline" onClick={toggle} disabled={isPending}>
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : service.isActive ? (
            <EyeOff className="w-4 h-4 mr-1" />
          ) : (
            <Eye className="w-4 h-4 mr-1" />
          )}
          {service.isActive ? "Hide" : "Show"}
        </Button>
      </div>
    </div>
  );
}

const initialServiceState: ServiceFormState = {};

function ServiceForm({
  service,
  onSaved,
}: {
  service: MentorServiceSelectType | null;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [state, formAction, isPending] = useActionState(
    saveMentorService,
    initialServiceState,
  );

  const onResult = useEffectEvent((result: ServiceFormState) => {
    if (!result.message) return;
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: mentorDashboardKeys.all });
      onSaved();
    } else {
      toast.error(result.message);
    }
  });
  // `state` only changes when a submission returns.
  useEffect(() => {
    if (state !== initialServiceState) onResult(state);
  }, [state]);

  const value = (field: keyof NonNullable<ServiceFormState["inputs"]>, fallback: string) =>
    state.inputs?.[field] ?? fallback;

  return (
    <form action={formAction} className="space-y-4">
      {service && <input type="hidden" name="serviceId" value={service.id} />}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          maxLength={120}
          placeholder="e.g. SOP & document review"
          defaultValue={value("title", service?.title ?? "")}
        />
        {state.errors?.title && <FieldError>{state.errors.title[0]}</FieldError>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          placeholder="What the student gets from this session"
          defaultValue={value("description", service?.description ?? "")}
        />
        {state.errors?.description && (
          <FieldError>{state.errors.description[0]}</FieldError>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="priceNpr">Price (NPR)</Label>
          <Input
            id="priceNpr"
            name="priceNpr"
            inputMode="numeric"
            placeholder="1500"
            defaultValue={value("priceNpr", service ? String(service.priceNpr) : "")}
          />
          {state.errors?.priceNpr && <FieldError>{state.errors.priceNpr[0]}</FieldError>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="durationMinutes">Duration (minutes, optional)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            inputMode="numeric"
            placeholder="45"
            defaultValue={value(
              "durationMinutes",
              service?.durationMinutes ? String(service.durationMinutes) : "",
            )}
          />
          {state.errors?.durationMinutes && (
            <FieldError>{state.errors.durationMinutes[0]}</FieldError>
          )}
        </div>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {service ? "Save changes" : "Add service"}
      </Button>
    </form>
  );
}

const initialPaymentState: PaymentDetailsFormState = {};

function PaymentDetailsCard({
  paymentInstructions,
  paymentQrUrl,
}: {
  paymentInstructions: string | null;
  paymentQrUrl: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    saveMentorPaymentDetails,
    initialPaymentState,
  );
  const [qrUrl, setQrUrl] = useState(paymentQrUrl ?? "");
  const queryClient = useQueryClient();

  const onResult = useEffectEvent((result: PaymentDetailsFormState) => {
    if (!result.message) return;
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: mentorDashboardKeys.all });
    } else {
      toast.error(result.message);
    }
  });
  // `state` only changes when a submission returns.
  useEffect(() => {
    if (state !== initialPaymentState) onResult(state);
  }, [state]);

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" /> Payment details
        </CardTitle>
        <p className="text-sm text-gray-500">
          Shown to students on the booking page. They pay you directly and upload
          a screenshot, which you verify before confirming.
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6 md:grid-cols-[1fr_220px]">
          <div className="space-y-1.5">
            <Label htmlFor="paymentInstructions">How should students pay you?</Label>
            <Textarea
              id="paymentInstructions"
              name="paymentInstructions"
              rows={6}
              maxLength={1000}
              placeholder={"e.g. eSewa: 98XXXXXXXX (Your Name)\nBank: Nabil Bank, A/C 0123456789"}
              defaultValue={state.inputs?.paymentInstructions ?? paymentInstructions ?? ""}
            />
            {state.errors?.paymentInstructions && (
              <FieldError>{state.errors.paymentInstructions[0]}</FieldError>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Payment QR code (optional)</Label>
            <CustomProfileUploader
              endpoint="paymentImageUploader"
              imageUploadName="Payment QR code"
              currentImage={qrUrl || undefined}
              onUploadComplete={setQrUrl}
            />
            <input type="hidden" name="paymentQrUrl" value={qrUrl} />
            {qrUrl && (
              <button
                type="button"
                onClick={() => setQrUrl("")}
                className="text-xs text-red-600 hover:underline"
              >
                Remove QR code
              </button>
            )}
            {state.errors?.paymentQrUrl && (
              <FieldError>{state.errors.paymentQrUrl[0]}</FieldError>
            )}
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save payment details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
