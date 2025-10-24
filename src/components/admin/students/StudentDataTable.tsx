"use client"
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { StudentProfileWithUser } from "../../../../types/all-types";
import { Button } from "../../ui/button";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon, Ellipsis } from "lucide-react";
import { Pagination, PaginationItem, PaginationNext, PaginationPrevious } from "../../ui/pagination";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usePaginationHook";
import { useSortData } from "@/hooks/useSortTable";

export default function StudentDataTable({ data, itemsToShow = 4 }: { data: Omit<StudentProfileWithUser, "videoCall">[] | [], itemsToShow?: number }) {
  const router = useRouter();

  // Pagination
  const { currentItems, currentPage, visiblePages, setCurrentPage, totalPages } = usePagination(data, itemsToShow);

  // Sorting
  const { items: sortedItems, requestSort, sortConfig } = useSortData(currentItems);

  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No data available</p>;
  }

  const keysToShow = ["userId", "district", "city", "favoriteDestination"];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {keysToShow.map((key) => (
              <TableCell
                key={key}
                className="font-bold capitalize cursor-pointer"
                onClick={() => requestSort(key as keyof Omit<StudentProfileWithUser, "videoCall">)}
              >
                {key}
                {sortConfig?.key === key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : null}
              </TableCell>
            ))}
            <TableCell className="font-bold capitalize">View Profile</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedItems.map((row, i) => (
            <TableRow key={i}>
              {keysToShow.map((key) => (
                <TableCell key={key}>
                  {String(row[key as keyof typeof row]).toLocaleUpperCase()}
                </TableCell>
              ))}
              <TableCell onClick={() => router.push(`/admin/students/${row.userId}`)}>
                <Button className="bg-emerald-400 transition-colors ease-linear duration-150">
                  View <ChevronRightCircleIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="list-none items-center justify-center mt-4">
        <PaginationPrevious
          onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1)}
          className={`${currentPage < 2 ? "opacity-75 pointer-events-none" : ""}`}
        >
          <ChevronLeftCircleIcon /> Previous
        </PaginationPrevious>

        {visiblePages.map((p) =>
          p === "ellipsis" ? (
            <PaginationItem key={p} className="ml-1">
              <Ellipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              onClick={() => setCurrentPage(p)}
              key={p}
              className={`px-2 py-1 ml-1 rounded-[4px] ${p === currentPage ? "bg-emerald-400 text-foreground" : "hover:bg-emerald-400"}`}
            >
              {p}
            </PaginationItem>
          )
        )}

        <PaginationNext
          onClick={() => currentPage !== totalPages && setCurrentPage(currentPage + 1)}
          className={`${currentPage === totalPages ? "opacity-75 pointer-events-none" : ""}`}
        >
          Next <ChevronRightCircleIcon />
        </PaginationNext>
      </Pagination>
    </>
  );
}
