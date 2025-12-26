"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  countryAppliedToEnum,
  intakeMonthEnum,
  intakeYearEnum,
  studyLevelEnum,
} from "../../../../lib/db/schema";
import { useMutation } from "@tanstack/react-query";
import {
  CreateStudentProfile,
  createStudentProfile,
  CreateStudentProfileResponse,
} from "../../../../server/actions/connect-student/create-student-profile";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";

const countries = countryAppliedToEnum.enumValues;
const months = intakeMonthEnum.enumValues;
const years = intakeYearEnum.enumValues;
const studyLevels = studyLevelEnum.enumValues;

export default function StudentDetailForm() {
  const [date, setDate] = useState<Date>();
  const [studyLevel, setStudyLevel] =
    useState<(typeof studyLevelEnum.enumValues)[number]>("Bachelor's Degree");
  const [country, setCountry] =
    useState<(typeof countryAppliedToEnum.enumValues)[number]>();
  const [city, setCity] = useState<string>("");
  const [intakeYear, setIntakeYear] =
    useState<(typeof intakeYearEnum.enumValues)[number]>();
  const [intakeMonth, setIntakeMonth] =
    useState<(typeof intakeMonthEnum.enumValues)[number]>();
  const [university, setUniversity] = useState<string>();
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [errors, setErrors] = useState<CreateStudentProfileResponse["errors"]>(
    {}
  );
  const router = useRouter();

  const { mutate, isPending, reset } = useMutation<
    CreateStudentProfileResponse,
    { message: string },
    CreateStudentProfile
  >({
    mutationFn: (data) => {
      return createStudentProfile(data);
    },
    onSuccess: (result) => {
      if (!result.success) {
        console.log("validation error: ", result.errors);
        setErrors(result.errors);
        toast.error(result.message);
        reset();
        return;
      }

      toast.success(result.message);
      router.refresh();
      reset();
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(error.message);
      reset();
    },
  });
  const handleSubmit = () => {
    if (
      !country ||
      !intakeYear ||
      !intakeMonth ||
      !date ||
      !city ||
      !currentStatus ||
      !university
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    mutate({
      countryAppliedTo: country,
      cityAppliedTo: city,
      intakeYear,
      intakeMonth,
      studyLevel,
      appliedOn: date,
      universityName: university,
      currentStatus,
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Student Details
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the fields to create a card which will be shown to other.
        </p>

        <div className="space-y-6">
          {/* date and country applied to  */}
          <div className="grid grid-cols-2 gap-4">
            {/* Country Applied To */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-semibold">
                Country Applied To
              </Label>
              <Select
                value={country}
                onValueChange={(value) =>
                  setCountry(
                    value as (typeof countryAppliedToEnum.enumValues)[number]
                  )
                }
              >
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.countryAppliedTo && (
                <FieldError>{errors.countryAppliedTo[0]}</FieldError>
              )}
            </div>

            {/* city applied to  : */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold">
                City Applied To
              </Label>

              <Input
                id="city"
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errors?.cityAppliedTo && (
                <FieldError>{errors.cityAppliedTo[0]}</FieldError>
              )}
            </div>
          </div>

          {/* Intake Year and Month */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-semibold">
                Intake Year
              </Label>
              <Select
                value={intakeYear}
                onValueChange={(val) =>
                  setIntakeYear(
                    val as (typeof intakeYearEnum.enumValues)[number]
                  )
                }
              >
                <SelectTrigger id="year" className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.intakeYear && (
                <FieldError>{errors.intakeYear[0]}</FieldError>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-semibold">
                Intake Month
              </Label>
              <Select
                value={intakeMonth}
                onValueChange={(val) =>
                  setIntakeMonth(
                    val as (typeof intakeMonthEnum.enumValues)[number]
                  )
                }
              >
                <SelectTrigger id="month" className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.intakeMonth && (
                <FieldError>{errors.intakeMonth[0]}</FieldError>
              )}
            </div>
          </div>

          {/* level + appied on date */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Study Level */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Study Level</Label>

              {studyLevels.map((lvl, idx) => (
                <RadioGroup
                  key={lvl + "-" + idx}
                  className="col-span-2"
                  value={studyLevel}
                  onValueChange={(value) => {
                    setStudyLevel(
                      value as (typeof studyLevelEnum.enumValues)[number]
                    );
                  }}
                >
                  <div
                    key={`${lvl}-${idx}`}
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <RadioGroupItem value={lvl} id={lvl} />
                    <Label htmlFor={lvl} className="cursor-pointer flex-1">
                      {lvl}
                    </Label>
                  </div>
                </RadioGroup>
              ))}
              {errors?.studyLevel && (
                <FieldError>{errors.studyLevel[0]}</FieldError>
              )}
            </div>
            {/* Applied On */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Applied On</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-1 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
              {errors?.appliedOn && (
                <FieldError>{errors.appliedOn[0]}</FieldError>
              )}
            </div>
          </div>

          {/* University/College/School Name */}
          <div className="space-y-2">
            <Label htmlFor="institution" className="text-sm font-semibold">
              University / College / School Name
            </Label>
            <Input
              id="institution"
              type="text"
              placeholder="Enter institution name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            {errors?.universityName && (
              <FieldError>{errors.universityName[0]}</FieldError>
            )}
          </div>

          {/* at what phase currently the student is : current status */}
          <div className="space-y-2">
            <Label htmlFor="institution" className="text-sm font-semibold">
              Current Status
            </Label>
            <Input
              id="status"
              type="text"
              placeholder="Currently you are in what process?"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
            />
            {errors?.currentStatus && (
              <FieldError>{errors.currentStatus[0]}</FieldError>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            size="lg"
          >
            {isPending ? (
              <>
                <Spinner />
                creating profile....
              </>
            ) : (
              "Create Application"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
