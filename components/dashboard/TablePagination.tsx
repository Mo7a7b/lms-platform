import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export function TablePagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-disabled={page === 1}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <PaginationItem className="cursor-pointer" key={p}>
              <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
