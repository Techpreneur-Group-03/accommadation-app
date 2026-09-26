import type { MouseEvent } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

// 1 … 4 5 6 … 10: first, last, and the pages around the current one.
function visiblePages(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= total)
  sorted.sort((a, b) => a - b)

  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? ["gap" as const, page] : [page]
  )
}

interface PagePaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function PagePagination({
  page,
  pageCount,
  onPageChange,
}: PagePaginationProps) {
  if (pageCount <= 1) return null

  const go = (target: number) => (event: MouseEvent) => {
    event.preventDefault()
    if (target >= 1 && target <= pageCount) onPageChange(target)
  }

  return (
    <Pagination className="mt-6 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text="Prev"
            aria-disabled={page === 1}
            className={cn(page === 1 && "pointer-events-none opacity-50")}
            onClick={go(page - 1)}
          />
        </PaginationItem>
        {visiblePages(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                className={cn(
                  "size-8 rounded-md",
                  item === page &&
                    "border-brand-dark bg-brand-dark text-brand-dark-foreground hover:bg-brand-dark/90 hover:text-brand-dark-foreground"
                )}
                onClick={go(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === pageCount}
            className={cn(
              page === pageCount && "pointer-events-none opacity-50"
            )}
            onClick={go(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PagePagination
