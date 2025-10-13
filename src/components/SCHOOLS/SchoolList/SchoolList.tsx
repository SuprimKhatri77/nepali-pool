"use client"
import { usePagination } from "@/app/hooks/usePaginationHook";
import { SchoolSelectType } from "../../../../lib/db/schema";
import SchoolCard from "../reusableComponents/SchoolCard";
import { Pagination, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";


export default  function SchoolList({schools}:{schools: SchoolSelectType[]}) {
  const {setCurrentPage, visiblePages, currentItems, currentPage, totalPages} = usePagination(schools, 6)
  
  return (
    <section className="shadow-accent-foreground text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        {"Schools List"}
      </h1>
      <hr className="border-2 border-yellow-400 w-12 mx-auto" />
      <div id="container" className="mt-6 flex gap-12 flex-wrap justify-center">
        {/* load cards here! */}
        {currentItems.map((school, i) => {
          return <SchoolCard schoolDetail={school} key={i + 1} />;
        })}
      </div>
      {/* Shadcn Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          className="list-none"

        >
          <PaginationPrevious className={currentPage === 1 ? "opacity-70 pointer-events-none":"hover:bg-emerald-400 bg-background"} onClick={() => currentPage > 1 && setCurrentPage(currentPage-1)}><div className="flex gap-2"  >
            <ChevronLeftCircleIcon />
            Previous
            </div>
            </PaginationPrevious>
         
          {visiblePages.map((p: (number | "ellipsis"), i: number) =>
            p === "ellipsis" ? (
              <span key={i} className="px-2">…</span>
            ) : (
              <PaginationItem
                
                key={p}
                onClick={() => setCurrentPage(p as number)}
                className={`${currentPage === p ? "bg-emerald-500 text-white" : ""}  px-3 py-2 rounded-[4px]`}
              >
                {p}
              </PaginationItem>
            )
          )}
          <PaginationNext onClick={() =>  currentPage < totalPages && setCurrentPage(currentPage+1)} className={currentPage === totalPages ? "opacity-70 pointer-events-none":"hover:bg-emerald-400 bg-background"}>
            <div  >
            <ChevronRightCircleIcon />
            Next
            </div>
          </PaginationNext>
        </Pagination>
      </div>
    </section>
  );
}
