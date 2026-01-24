"use client"
import { StudentEmptyState } from '@/modules/connect-student/student-empty-state';
import { StudentErrorState } from '@/modules/connect-student/student-error-state';
import React, { useEffect, useMemo, useState } from 'react'
import { getPaginatedStudentProfiles } from '../../../../server/helper/connect-student/get-paginated-student-profiles';
import { useQuery } from '@tanstack/react-query';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from 'next/navigation';
import { ConnectStudentProfileSelectType, intakeMonthEnum, studyLevelEnum } from '../../../../lib/db/schema';
import {motion} from "framer-motion"
import { GraduationCap, SearchIcon } from 'lucide-react';
import { StudentCardSkeleton } from '@/modules/connect-student/student-card-skeleton';
import FilterBar, { FilterConfig } from '@/components/Filter';
import { japaneseCitiesForNepali } from '@/information/Japan';
import StudentCards from './student-card';
import { Input } from '@/components/ui/input';
import StudentDetailForm from './StudentDetailForm';


type Props = {
  hasCurrentUserProfile: boolean;
  hasSession: boolean;
  role: "student" | "mentor" | "admin" | null;
  user: ConnectStudentProfileSelectType | undefined
};
export default function ConnectStudent({
  hasCurrentUserProfile,
  hasSession,
  role,
  user
}: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const searchQuery = useSearchParams();
    const router = useRouter()
    const city = searchQuery.get("city") as string ?? "";
    const studyLevel: ConnectStudentProfileSelectType["studyLevel"] = searchQuery.get("studyLevel") as ConnectStudentProfileSelectType["studyLevel"] ?? "";
    const intake = searchQuery.get("intake") as ConnectStudentProfileSelectType["intakeMonth"] ?? ""
    const search = searchQuery.get("search") as string ?? ""
    const [debounceSearch, setDebounceSearch] = useState(search)
      const limit = 90;
    // NOTE
      const {
        data: studentsProfiles,
        isPending,
        isError,
      } = useQuery({
        queryKey: ["all-student-profiles", currentPage],
        queryFn: () => getPaginatedStudentProfiles(currentPage, limit),
    
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
      });
    
      const students = useMemo(() => {
        return studentsProfiles?.students ?? []
      },[studentsProfiles]);
      console.log(students)
      const totalStudents = studentsProfiles?.total ?? 0;
      const totalPages = Math.ceil(totalStudents / limit);

         useEffect(() => {
  const timer = setTimeout(() => {
    setDebounceSearch(search);
  }, 1000); // 1 second

  return () => clearTimeout(timer);
}, [search]);

    //   since the following func is trigger when the dependencies change no worry to put although it is fetched after it 
        const filterStudents =  useMemo(() => {
       return students?.filter((std)=>{
        if(city && std.cityAppliedTo.trim().toLocaleLowerCase() !== city.trim().toLocaleLowerCase()){
            return false
        }
        if(studyLevel && std.studyLevel.toLocaleLowerCase() !== studyLevel.toLocaleLowerCase()){
            return false
        }
        if(debounceSearch && !std.universityName.toLocaleLowerCase().includes(debounceSearch.toLocaleLowerCase())){
            return false
        }
        if(intake && std.intakeMonth.toLocaleLowerCase() !== intake.toLocaleLowerCase()){
          return false
        }
        return true 
      })
      },[students,studyLevel,debounceSearch, city, intake])
    
      if (!isPending && !isError && students?.length === 0) {
        return <StudentEmptyState />;
      }
    
      if (isError) {
        return <StudentErrorState />;
      }

    
    
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
    
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      const filterConfig: FilterConfig[] = [
        {
            key: "city",
            label: "City",
            options: japaneseCitiesForNepali.map((city) => {
                return {
                    label: city,
                    value: city
                }
            })
        },
        {
            key: "studyLevel",
            label: "Level",
            options: studyLevelEnum.enumValues.map((level)=>{
                return {
                    label: level,
                    value: level
                }
            })
        },
        {
            key: "intake",
            label: "Intake",
            options: intakeMonthEnum.enumValues.map((intake)=>{
                return {
                    label: intake,
                    value: intake
                }
            })
        },
      ]

      const onFilterChange = (key: string, value: string) => {
        const queries = new URLSearchParams(searchQuery.toString());
        const currentValue = queries.get(key)
    ? decodeURIComponent(queries.get(key)!)
    : null;

  if (currentValue === value) return;
        queries.set(key, value);
        router.push(`?${queries.toString()}`, {scroll: false})
      }
      const onFilterClear = () => {
        router.push(`?`, {scroll: false})
      }

   

 
  return (
    <section>
        
        
    <div className="pt-12">
        {/* hero seciton */}
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

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {Array.from({ length: limit }).map((_, i) => (
            <StudentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
        <div className='flex md:flex-row flex-col space-y-4 justify-between px-4'>
             <div className='flex relative'>
            <Input onChange={(e) => onFilterChange("search", e.target.value)} placeholder='Search using school name' className='min-w-[240px] sm:min-w-xs lg:min-w-2xl'/>
            <SearchIcon className='absolute top-2 right-2'/>
          </div>
        {/* filter options aunxa yeha */}
          <FilterBar 
           filters={filterConfig}
           onChange={(key: string, value: string) =>  onFilterChange(key, value)}
           onClear={onFilterClear}
           values={{city, studyLevel, intake}}
           className='md:justify-end grid grid-cols-3 md:flex'
          />

         

        </div>
         {
            filterStudents.length !== 0 ? (

                <StudentCards className='mt-10' user={user}  students={filterStudents}  hasCurrentUserProfile={hasCurrentUserProfile} hasSession={hasSession} />
            ) : ( <div className="space-y-4">
    {/* Heading */}
    <h2 className="text-2xl font-semibold text-center px-2">
      No students found {city || studyLevel && "for"}
      {city && `${city}`} {city && studyLevel && " & "}{" "}
      {studyLevel && `${studyLevel}`}
    </h2>

  
    <p className="text-center text-muted-foreground px-2">
      Explore students in other cities or meet other friends.
    </p>

    {/* Show all students when there is no match found we can show qr also */}
    <StudentCards
      user={user}
      students={students} 
      hasCurrentUserProfile={hasCurrentUserProfile}
      hasSession={hasSession}
    />
  </div>
            )
         }
         {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="mt-8 mb-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(0, currentPage - 1))
                      }
                      className={
                        currentPage === 0
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* First page */}
                  {currentPage > 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(0)}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i)
                    .filter((page) => {
                      return (
                        page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1 ||
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      );
                    })
                    .map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 3 && (
                    <>
                      {currentPage < totalPages - 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages - 1)}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(totalPages - 1, currentPage + 1),
                        )
                      }
                      className={
                        currentPage === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>

    {/* show this form to student  when first time coming to this page. */}
          {!hasCurrentUserProfile && hasSession && role === "student" && (

              <StudentDetailForm />
          )}
    </section>
  )
}
