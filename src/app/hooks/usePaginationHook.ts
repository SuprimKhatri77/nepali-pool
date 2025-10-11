import { useMemo, useState } from "react";

export const usePagination = <T>(data: T[], pageSize = 8) => {
      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = Math.ceil(data.length / pageSize);
    
     
    
      const indexOfLastItem = currentPage * pageSize;
      const indexOfFirstItem = indexOfLastItem - pageSize
    
      const currentItems = data.slice(indexOfFirstItem,indexOfLastItem)
    
      const visiblePages = useMemo(() => {
       const  pages:  (number | "ellipsis")[] = []
       
        if(totalPages <= 4) {
            for (let i = 1; i<=totalPages; i++) pages.push(i)
        }
    else {
    pages.push(1) // show 1 always 
    
        if(currentPage > 3 ){
            pages.push("ellipsis")
        }
            const start = Math.min(2, currentPage -1)
            const end = Math.max(totalPages - 1, currentPage + 1)
            for(let i=start; i<=end; i++) pages.push(i)
    
       if(currentPage <= totalPages - 3){
        pages.push("ellipsis")
       }
       pages.push(totalPages)
    }
    
    return pages
        
        
      },[currentPage, totalPages])
    
    return {currentItems, visiblePages, setCurrentPage, currentPage, totalPages}
}