"use client";
import React from "react";
import { CheckCircle, XCircle, Clock, ChevronRightCircleIcon, ChevronLeftCircleIcon, Ellipsis } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../ui/button";
import { Pagination, PaginationItem, PaginationNext, PaginationPrevious } from "../../ui/pagination";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usePaginationHook";
import { useSortData } from "@/hooks/useSortTable";
import { MentorProfileWithUser } from "../../../../types/all-types";

type Props = {
  data: MentorProfileWithUser[];
  openImage: boolean;
  setOpenImage: (val: boolean) => void;
  setImageUrl: (url: string) => void;
  itemToShow?: number;
};

export default function MentorDataTable({ data,  setOpenImage, setImageUrl, itemToShow = 4 }: Props) {
  const router = useRouter();

  // Pagination
  const { currentItems, currentPage, visiblePages, setCurrentPage, totalPages } = usePagination(data, itemToShow);

  // Sorting
  const { items, requestSort, sortConfig } = useSortData(currentItems);

  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No data available</p>;
  }

  const keysToShow = ["userId", "country", "city", "sex", "verifiedStatus", "citizenshipPhotoUrl", "resume"];

  const getSortIndicator = (key: string) => {
    if (!sortConfig) return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 pl-2">
      <Table>
        <TableHeader>
          <TableRow>
            {keysToShow.map((key) => (
              <TableCell
                key={key}
                className="font-bold capitalize cursor-pointer select-none"
                onClick={() => requestSort(key as keyof MentorProfileWithUser)}
              >
                {key} {getSortIndicator(key)}
              </TableCell>
            ))}
            <TableCell className="font-bold capitalize">View Profile</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((row, i) => (
            <TableRow key={i}>
              {keysToShow.map((key) => (
                <TableCell key={key}>
                  {key === "citizenshipPhotoUrl" || key === "resume" ? (
                    <Button
                      className="bg-emerald-400 hover:bg-emerald-500 text-white transition-colors duration-150"
                      onClick={() => {
                        setImageUrl(row[key as keyof typeof row] as string);
                        setOpenImage(true);
                      }}
                    >
                      View
                    </Button>
                  ) : key === "verifiedStatus" ? (
                    <>
                      {row.verifiedStatus === "accepted" && <CheckCircle className="text-green-500 mx-auto" />}
                      {row.verifiedStatus === "rejected" && <XCircle className="text-red-500 mx-auto" />}
                      {row.verifiedStatus === "pending" && <Clock className="text-yellow-500 mx-auto" />}
                    </>
                  ) : (
                    String(row[key as keyof typeof row]).toLocaleUpperCase()
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  className="bg-emerald-400 hover:bg-emerald-500 text-white flex items-center gap-1"
                  onClick={() => router.push(`/admin/mentors/${row.userId}`)}
                >
                  View <ChevronRightCircleIcon className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="list-none flex items-center justify-center mt-4 gap-2">
        <PaginationPrevious
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={`${currentPage < 2 ? "opacity-50 pointer-events-none" : ""}`}
        >
          <ChevronLeftCircleIcon className="w-4 h-4 mr-1" /> Previous
        </PaginationPrevious>

        {visiblePages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`} className="px-2 py-1">
              <Ellipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-2 py-1 rounded-md cursor-pointer ${
                p === currentPage ? "bg-emerald-400 text-white" : "hover:bg-emerald-200"
              }`}
            >
              {p}
            </PaginationItem>
          )
        )}

        <PaginationNext
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          className={`${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
        >
          Next <ChevronRightCircleIcon className="w-4 h-4 ml-1" />
        </PaginationNext>
      </Pagination>
    </div>
  );
}
