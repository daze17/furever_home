import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import "client-only";
import { type PaginationMeta } from "customer_api";

import {
  Button,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "ui";

type PaginationProps = {
  meta: PaginationMeta;
  setPage: (page: number) => void;
};

const paginate = (current: number, total: number): Array<number | "..."> => {
  const pages: Array<number | "..."> = [1];

  // Handle edge case where there is only one page
  if (current === 1 && total === 1) {
    return pages;
  }

  // Add a leading ellipsis if the current page is beyond 4
  if (current > 4) {
    pages.push("...");
  }

  // Calculate the range of pages to display around the current page
  const range = 2;
  const start = Math.max(2, current - range);
  const end = Math.min(total, current + range);

  // Add the pages within the range to the items list
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add a trailing ellipsis if there are pages after the range
  if (end < total - 1) {
    pages.push("...");
  }

  // Always include the last page if it's not already included
  if (end < total) {
    pages.push(total);
  }

  return pages;
};
export const CustomPagination: React.FC<PaginationProps> = ({
  meta,
  setPage,
}) => {
  const totalPages = Math.ceil(meta.total / meta.per_page);
  const pages = paginate(meta.current_page, totalPages);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="hidden h-9 w-9 rounded-lg border-gray-200 p-0 transition-colors hover:border-[#11D0BC] hover:bg-[#11D0BC]/5 lg:flex"
          onClick={() => setPage(1)}
          disabled={meta.current_page === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-lg border-gray-200 p-0 transition-colors hover:border-[#11D0BC] hover:bg-[#11D0BC]/5"
          onClick={() => setPage(meta.current_page - 1)}
          disabled={meta.current_page === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Pagination>
          <PaginationContent className="gap-1">
            {pages.map((page, index) => {
              if (page === "...") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-gray-400" />
                  </PaginationItem>
                );
              }
              const isActive = page === meta.current_page;
              return (
                <PaginationItem key={page}>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className={`h-9 w-9 rounded-lg p-0 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#11D0BC] text-white hover:bg-[#0fb8a6]"
                        : "border-gray-200 hover:border-[#11D0BC] hover:bg-[#11D0BC]/5"
                    }`}
                    onClick={() => setPage(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-lg border-gray-200 p-0 transition-colors hover:border-[#11D0BC] hover:bg-[#11D0BC]/5"
          onClick={() => setPage(meta.current_page + 1)}
          disabled={meta.current_page === totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-9 w-9 rounded-lg border-gray-200 p-0 transition-colors hover:border-[#11D0BC] hover:bg-[#11D0BC]/5 lg:flex"
          onClick={() => setPage(totalPages)}
          disabled={meta.current_page === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
