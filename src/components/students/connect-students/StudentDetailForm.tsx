import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
export default function StudentDetailForm(){
    const [date, setDate] = useState<Date>();
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Netherlands", "Sweden", "Switzerland", "Japan", "South Korea"
  ];
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Details</h1>
        <p className="text-gray-600 mb-8">Fill in the fields to create a card which will be shown to other.</p>

       
        
        <div className="space-y-6">
         
          {/* date ad country applied to  */}
        <div className="grid grid-cols-2 gap-4">
 {/* Country Applied To */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-semibold">
              Country Applied To
            </Label>
            <Select >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            />
          
          </div>

         
        </div>

          {/* Intake Year and Month */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-semibold">
                Intake Year
              </Label>
              <Select>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-semibold">
                Intake Month
              </Label>
              <Select>
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
            </div>
          </div>


{/* level + appied on date */}
<div className="grid md:grid-cols-2 gap-3">

          {/* Study Level */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Study Level
            </Label>
            <RadioGroup defaultValue="bachelor" className="col-span-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem value="bachelor" id="bachelor" />
                <Label htmlFor="bachelor" className="cursor-pointer flex-1">Bachelor&apos;s Degree</Label>
              </div>
              {/* col span 2 for them bcz ui should look good */}
              <div className=" flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem value="masters" id="masters" />
                <Label htmlFor="masters" className="cursor-pointer flex-1">Master&apos;s Degree</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem value="phd" id="phd" />
                <Label htmlFor="phd" className="cursor-pointer flex-1">PhD</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem value="language" id="language" />
                <Label htmlFor="language" className="cursor-pointer flex-1">Language School</Label>
              </div>
            </RadioGroup>
          </div>
           {/* Applied On */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Applied On
            </Label>
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            />
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
            />
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-emerald-500" size="lg">
            Create Application
          </Button>
        </div>
      </div>
    </div>
  );
}