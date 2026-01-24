"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { ConnectStudentProfileSelectType, countryAppliedToEnum, intakeMonthEnum, intakeYearEnum, studyLevelEnum } from '../../../lib/db/schema';
import { useForm } from "react-hook-form"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger,SelectValue,SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, LoaderIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import { updateStudentCard, UpdateStudentProfile, UpdateStudentProfileResponse } from "../../../server/actions/connect-student/update-student-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";


export const studentFormSchema = z.object({
  date: z.date("Applied date is required" ),

  studyLevel: z.enum(studyLevelEnum.enumValues as [string, ...string[]], {message: "Study level is required"},
  ),

  country: z.enum(countryAppliedToEnum.enumValues as [string, ...string[]],{message: "Country is required"}),

  city: z.string().min(1, "City is required"),

  intakeYear: z.enum(intakeYearEnum.enumValues as [string, ...string[]], {message: "Intake year is required"},
  ),

  intakeMonth: z.enum(intakeMonthEnum.enumValues as [string, ...string[]],{message: "Intake month is required"},
  ),

  university: z.string().min(1, "University is required"),

  currentStatus: z.string().min(1, "Current status is required"),

  whatsAppNumber: z.string().nullable(),

  facebookProfileLink: z.string().nullable(),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

type Props = {
  student: ConnectStudentProfileSelectType;
};
export default function UpdateStudentCardForm({ student }: Props) {
  const router = useRouter()
    const form  = useForm<StudentFormValues>({
  defaultValues: {
    date: student.appliedOn,
    studyLevel: student.studyLevel,
    country: student.countryAppliedTo,
    city: student.cityAppliedTo,
    intakeYear: student.intakeYear,
    intakeMonth: student.intakeMonth,
    university: student.universityName,
    currentStatus: student.currentStatus,
    whatsAppNumber: student.whatsAppNumber,
    facebookProfileLink: student.facebookProfileLink,
  },
  resolver: zodResolver(studentFormSchema),
  mode: "onBlur"
})


 const { mutate,  reset, isPending } = useMutation<
     UpdateStudentProfileResponse,
     { message: string },
     UpdateStudentProfile
   >({
     mutationFn: (data) => {
       return updateStudentCard(data);
     },
     onSuccess: (result) => {
       if (!result.success) {
         form.setError("root",{message: "Something went wrong"});
         toast.error(result.message);
         reset();
         return;
       }
 
       toast.success(result.message);
       router.push("/connect-student");
       reset();
     },
     onError: (error) => {
      console.log(error)
       console.log("error: ", error);
       toast.error(error.message);
       reset();
     },
   });
   const onSubmit = () => {
    
     form.handleSubmit((values)=>{
     const payload: UpdateStudentProfile = {
    countryAppliedTo: values.country as typeof countryAppliedToEnum.enumValues[number],
    cityAppliedTo: values.city,
    appliedOn: new Date(values.date),
    universityName: values.university,
    studyLevel: values.studyLevel as typeof studyLevelEnum.enumValues[number],
    intakeYear: values.intakeYear as typeof intakeYearEnum.enumValues[number],
    intakeMonth: values.intakeMonth as typeof intakeMonthEnum.enumValues[number],
    currentStatus: values.currentStatus,
    whatsAppNumber: values.whatsAppNumber as string,
    facebookProfileLink: values.facebookProfileLink || undefined,
  }
mutate(payload);
   })()
   }
 
     
   

  return  (
    <Card className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Student Card Update
        </h1>
        <p className="text-gray-600 mb-8 md:block hidden">
          Fill in the fields to update your student card which will be shown to
          other students.
        </p>
   <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto"
  >
    {/* Date */}
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Applied On</FormLabel>
          <FormControl>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button
                               variant="outline"
                               className="mt-1 w-full justify-start text-left font-normal"
                             >
                               <CalendarIcon className="mr-2 h-4 w-4" />
                               {field.value ? field.value.toLocaleDateString() : "Pick a date"}
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                             <Calendar
                               mode="single"
                               selected={field.value}
                               onSelect={(date) => {
                                form.setValue("date", date)
                               }}
                               required={true}
                             />
                           </PopoverContent>
                         </Popover>
                      
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="studyLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Study Level</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select study level" />
                </SelectTrigger>
                <SelectContent>
                  {studyLevelEnum.enumValues.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country Applied To</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryAppliedToEnum.enumValues.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* City */}
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input placeholder="City" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Intake Year & Month */}
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="intakeYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intake Year</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year"/>
                </SelectTrigger>
                <SelectContent>
                  {intakeYearEnum.enumValues.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="intakeMonth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intake Month</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="min-w-[100px] w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="min-w-[100px] w-full">
                  {intakeMonthEnum.enumValues.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* University & Current Status */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University / College / School Name</FormLabel>
            <FormControl>
              <Input placeholder="University" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Status</FormLabel>
            <FormControl>
              <Input placeholder="Current Status" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* WhatsApp & Facebook */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="whatsAppNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp Number</FormLabel>
            <FormControl>
              <Input placeholder="WhatsApp Number" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facebookProfileLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook Profile Link</FormLabel>
            <FormControl>
              <Input placeholder="Facebook Profile Link" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Submit Button */}
    <Button type="submit" onClick={(e) => {
      e.preventDefault();
      onSubmit()
    }} disabled={isPending} className="w-full disabled:opacity-75 bg-emerald-600 hover:bg-emerald-700">
      {isPending ? <LoaderIcon className="animate-spin" /> : "Update Student"}
    </Button>
  </form>
</Form>
    </Card>

  )
}

