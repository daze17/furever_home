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
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="hidden h-11 w-11 p-0 lg:flex"
            onClick={() => setPage(1)}
            disabled={meta.current_page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 w-11 p-0"
            onClick={() => setPage(meta.current_page - 1)}
            disabled={meta.current_page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Pagination>
            <PaginationContent>
              {pages.map((page, index) => {
                if (page === "...") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <Button
                      variant={
                        page === meta.current_page ? "default" : "outline"
                      }
                      className="min-h-11 min-w-11 p-0 text-xs font-light transition-opacity"
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
            className="h-11 w-11 p-0"
            onClick={() => setPage(meta.current_page + 1)}
            disabled={meta.current_page === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-11 w-11 p-0 lg:flex"
            onClick={() => setPage(totalPages)}
            disabled={meta.current_page === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
