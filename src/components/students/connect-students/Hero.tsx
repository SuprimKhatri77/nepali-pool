"use client";

import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { japaneseCitiesForNepali, japanIntakes } from "@/information/Japan";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import StudentCards from "./student-card";

type Props = {
  students:
    | (ConnectStudentProfileSelectType & {
        user: UserSelectType | null;
      })[]
    | [];
    hasCurrentUserProfile: boolean,
    hasSession: boolean
};
export default function ConnectStudentHero({ students, hasCurrentUserProfile, hasSession }: Props) {
  return (
    <div className="pt-12">
      <div className="text-center mb-12 sm:mb-16 space-y-4 min-h-1/2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <div className="text-xs sm:text-sm font-medium text-emerald-700">
            Meet with your new friends
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight px-4">
          Find Your Future{" "}
          <motion.span
            initial={{ width: "0ch" }}
            animate={{ width: ["0ch", "22ch"] }}
            transition={{ duration: 11, ease: "linear" }}
            className="hidden text-emerald-700 overflow-hidden text-nowrap sm:inline-flex"
          >
            Roommates & Classmates.
          </motion.span>
          <span className="sm:hidden text-emerald-700">Friends</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
          Connect with future classmates heading to your city. Find peers at
          your university, coordinate travel plans, and start building your
          community before you even step off the plane.
        </p>
      </div>
      <StudentFilterSection hasSession={hasSession} hasCurrentUserProfile={hasCurrentUserProfile} students={students} />
    </div>
  );
}

// student filter section
export const StudentFilterSection = ({ students, hasCurrentUserProfile, hasSession }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedIntake, setSelectedIntake] = useState("");
  const [matchStudents, setMatchStudents] = useState(students);

  // for other countries it might required
  // const countries = [
  //   "United States", "United Kingdom", "Canada", "Australia", "Germany",
  //   "France", "Netherlands", "Sweden", "Switzerland", "Japan", "South Korea"
  // ];

  // const months = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  // const currentYear = new Date().getFullYear();

  const studyLevels = [
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Language School",
  ];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("");
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedLevel("");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCountry ||
    selectedYear ||
    selectedMonth ||
    selectedLevel;

  const filterByCity = (value: string) => {
    if (!value) return students;
    const matchStudents =
      students &&
      students.filter((student) =>
        student.cityAppliedTo.toLowerCase().includes(value.toLowerCase())
      );
    if (matchStudents.length === 0) {
      setSearchQuery("");
      return students;
    }
    setMatchStudents(matchStudents);
  };

  const filterBySchoolName = (value: string) => {
    if (!value) return students;
    const matchStudents = students.filter(
      (student) =>
        student.universityName.toLowerCase().includes(value.toLowerCase()) ||
        student.cityAppliedTo.toLowerCase().includes(value.toLowerCase())
    );
    if (matchStudents.length === 0) {
      return students;
    }
    setMatchStudents(matchStudents);
  };

  const filterByStudyLevel = (value: string) => {
    if (!value) return students;
    const matchStudents = students.filter((student) =>
      student.studyLevel.toLowerCase().includes(value.toLowerCase())
    );
    if (matchStudents.length === 0) {
      return students;
    }
    setMatchStudents(matchStudents);
  };

  const filterByIntake = (value: string) => {
    if (!value) return students;
    const removeIntakeWord = value.split(" ")[0];
    console.log(removeIntakeWord);
    const matchStudents = students.filter((student) =>
      student.intakeMonth.toLowerCase().includes(removeIntakeWord.toLowerCase())
    );
    if (matchStudents.length === 0) {
      return students;
    }
    setMatchStudents(matchStudents);
  };

  return (
    <div className="w-full p-3 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-900">
            Filter Applications
          </h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-slate-600 hover:text-slate-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by university or school name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              filterBySchoolName(e.target.value);
            }}
            className="pl-10"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {/* Country Filter */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* City Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">City</Label>
            <Select
              value={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
                filterByCity(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {japaneseCitiesForNepali.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Study Level Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Study Level
            </Label>
            <Select
              value={selectedLevel}
              onValueChange={(value) => {
                setSelectedLevel(value);
                filterByStudyLevel(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {studyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* intakes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Intakes
            </Label>
            <Select
              value={selectedIntake}
              onValueChange={(value) => {
                setSelectedIntake(value);
                filterByIntake(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Intakes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intakes</SelectItem>
                {japanIntakes.map((intake) => (
                  <SelectItem key={intake} value={intake}>
                    {intake}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Intake Year Filter */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Intake Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Intake Month Filter */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Intake Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-slate-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: {searchQuery}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}
            {selectedCountry && selectedCountry !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedCountry}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSelectedCountry("")}
                />
              </span>
            )}
            {selectedLevel && selectedLevel !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedLevel}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSelectedLevel("")}
                />
              </span>
            )}
            {selectedYear && selectedYear !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedYear}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSelectedYear("")}
                />
              </span>
            )}
            {selectedMonth && selectedMonth !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedMonth}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => setSelectedMonth("")}
                />
              </span>
            )}
          </div>
        )}
      </div>

      {matchStudents && <StudentCards hasSession={hasSession} hasCurrentUserProfile={hasCurrentUserProfile} students={matchStudents} />}
    </div>
  );
};
