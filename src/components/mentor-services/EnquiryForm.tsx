"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";
import {
  createMentorEnquiry,
  type EnquiryField,
  type EnquiryFormState,
} from "../../../server/actions/mentor-enquiry/create-enquiry";
import { BUDGET_READINESS_LABELS, ENGLISH_LEVEL_LABELS } from "./format";

type Props = {
  mentorId: string;
  intakeMonths: readonly string[];
  intakeYears: readonly string[];
  // Server's "now", so the month options match the server-side check.
  currentYear: number;
  currentMonthIndex: number;
  defaults: { fullName: string; email: string; whatsappNumber: string };
};

type Field = EnquiryField;

const STEP_ONE_FIELDS: Field[] = [
  "fullName",
  "email",
  "whatsappNumber",
  "question",
];

const initialState: EnquiryFormState = {};

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive";

export default function EnquiryForm({
  mentorId,
  intakeMonths,
  intakeYears,
  currentYear,
  currentMonthIndex,
  defaults,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    createMentorEnquiry,
    initialState,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [intakeYear, setIntakeYear] = useState("");
  const [handledState, setHandledState] = useState(state);
  const stepOneRef = useRef<HTMLDivElement>(null);

  // When a submission comes back with errors, show the step that has them
  // (step 1 first). Adjusting state during render on a new result, per
  // React's guidance.
  if (state !== handledState) {
    setHandledState(state);
    const fieldsWithErrors = Object.keys(state.errors ?? {}) as Field[];
    if (fieldsWithErrors.some((field) => STEP_ONE_FIELDS.includes(field))) {
      setStep(1);
    } else if (fieldsWithErrors.length > 0) {
      setStep(2);
    }
  }

  // Success redirects server-side, so only failures land here.
  useEffect(() => {
    if (state !== initialState && state.message) toast.error(state.message);
  }, [state]);

  const goToStepTwo = () => {
    const fields = stepOneRef.current?.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input, textarea");
    const firstInvalid = Array.from(fields ?? []).find(
      (el) => !el.checkValidity(),
    );
    if (firstInvalid) {
      firstInvalid.reportValidity();
      return;
    }
    setStep(2);
  };

  // Submit via onSubmit instead of <form action>: React resets forms after an
  // `action` completes, which on a validation error would wipe the student's
  // answers (selects can't even be restored from defaultValue). Without the
  // reset every field simply keeps what was entered.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    // Pressing Enter in a step-1 input submits the form; treat it as Continue
    // rather than sending an empty step 2.
    if (step === 1) {
      goToStepTwo();
      return;
    }
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };
  const error = (field: Field) =>
    state.errors?.[field] ? (
      <FieldError>{state.errors[field]![0]}</FieldError>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input type="hidden" name="mentorId" value={mentorId} />
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Step {step} of 2 · {step === 1 ? "Your question" : "Your background"}
      </p>

      {/* Step 1 stays mounted (just hidden) so its values are submitted too. */}
      <div ref={stepOneRef} className={step === 1 ? "space-y-4" : "hidden"}>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            defaultValue={defaults.fullName}
          />
          {error("fullName")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              defaultValue={defaults.email}
            />
            {error("email")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsappNumber">WhatsApp number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="+9779812345678"
              defaultValue={defaults.whatsappNumber}
            />
            {error("whatsappNumber")}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="question">Your question</Label>
          <Textarea
            id="question"
            name="question"
            rows={4}
            required
            minLength={10}
            maxLength={1000}
            placeholder="e.g. Which course would suit my background, and what are the intakes?"
            defaultValue=""
          />
          {error("question")}
        </div>
        <Button
          type="button"
          onClick={goToStepTwo}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className={step === 2 ? "space-y-4" : "hidden"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="qualification">Current / last qualification</Label>
            <Input
              id="qualification"
              name="qualification"
              maxLength={200}
              placeholder="e.g. +2 Science, BBS 3rd year"
              defaultValue=""
            />
            {error("qualification")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="targetCourse">Course / field you want</Label>
            <Input
              id="targetCourse"
              name="targetCourse"
              maxLength={200}
              placeholder="e.g. Master's in IT"
              defaultValue=""
            />
            {error("targetCourse")}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="englishLevel">English level</Label>
            <select
              id="englishLevel"
              name="englishLevel"
              className={selectClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select…
              </option>
              {Object.entries(ENGLISH_LEVEL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {error("englishLevel")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="englishTestScore">
              IELTS / PTE score (optional)
            </Label>
            <Input
              id="englishTestScore"
              name="englishTestScore"
              maxLength={50}
              placeholder="e.g. IELTS 6.5"
              defaultValue=""
            />
            {error("englishTestScore")}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="intakeMonth">Intake month</Label>
            <select
              id="intakeMonth"
              name="intakeMonth"
              className={selectClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Month…
              </option>
              {intakeMonths.map((month, index) => (
                <option
                  key={month}
                  value={month}
                  disabled={
                    intakeYear === String(currentYear) &&
                    index < currentMonthIndex
                  }
                >
                  {month}
                </option>
              ))}
            </select>
            {error("intakeMonth")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="intakeYear">Intake year</Label>
            <select
              id="intakeYear"
              name="intakeYear"
              className={selectClassName}
              defaultValue=""
              onChange={(e) => setIntakeYear(e.target.value)}
            >
              <option value="" disabled>
                Year…
              </option>
              {intakeYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {error("intakeYear")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budgetReadiness">Finances</Label>
            <select
              id="budgetReadiness"
              name="budgetReadiness"
              className={selectClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select…
              </option>
              {Object.entries(BUDGET_READINESS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {error("budgetReadiness")}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="goals">
            Your goals &amp; why you want to study abroad
          </Label>
          <Textarea
            id="goals"
            name="goals"
            rows={4}
            maxLength={1000}
            placeholder="Where you see yourself after your studies, and why this country/course."
            defaultValue=""
          />
          {error("goals")}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isPending}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send free enquiry
          </Button>
        </div>
      </div>
    </form>
  );
}
