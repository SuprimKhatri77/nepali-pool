import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import React from "react"
import { cn } from "./lib/utils"
import { ChevronDownCircleIcon } from "lucide-react"

export type FilterOption = {
  label: string
  value: string
}

export type FilterConfig = {
  key: string
  label: string
  options: FilterOption[]
}

type FilterBarProps = {
  filters: FilterConfig[]
  onClear: () => void
  onChange: (key: string, value: string) => void,
  values: Record<string, string>
  
}& Omit<React.ComponentProps<"div">, "onChange">
// since div don't have onchange we omit this 

export default function FilterBar({
  filters,
  onClear,
  onChange,
  values,
  className,
  ...props
}: FilterBarProps) {
  console.log("the values are : ", values)
  return (
    <div className={cn("flex flex-wrap gap-3 px-4",className)}  {...props}>
      {filters.map((filter) => {
        const activeValue = values[filter.key] ? decodeURIComponent(values[filter.key]) : undefined;
        const activeOption = filter.options.find((op)=>
            op.value === activeValue
        )
        return  <DropdownMenu key={filter.key}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              {activeOption ? `${activeOption.label} ` :  `${filter.label}`}
              <ChevronDownCircleIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {filter.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onChange(filter.key, option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
})}

 
         {/* <Button variant="ghost" onClick={onClear}>
        Clear
      </Button> */}
   
    </div>
  )
}
