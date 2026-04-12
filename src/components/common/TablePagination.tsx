import { X } from "lucide-react";

interface Props {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  selectedCount?: number;
  onClearSelection?: () => void;
}

const TablePagination = ({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  selectedCount = 0,
  onClearSelection,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to   = Math.min(page * pageSize, total);

  const pageNums = (): (number | "…")[] => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40">
      {/* Left: result count / selection + page size */}
      <div className="flex items-center gap-2.5">
        {selectedCount > 0 ? (
          <span className="flex items-center gap-1.5 text-[11px] font-510 text-foreground">
            {selectedCount} selected
            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="h-4 w-4 rounded flex items-center justify-center
                           text-muted-foreground hover:text-foreground hover:bg-accent/60
                           transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground/60 tabular-nums font-510">
            {total === 0 ? "0 results" : `${from}–${to} of ${total.toLocaleString()}`}
          </span>
        )}

        {/* Page-size selector — Linear ghost input style */}
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="h-6 rounded border border-border/60 bg-transparent px-1.5
                     text-[11px] text-muted-foreground focus:outline-none
                     focus:ring-1 focus:ring-ring/30 cursor-pointer
                     hover:border-border transition-colors"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-0.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-6 w-6 rounded border border-border/50 text-[11px] flex items-center
                     justify-center text-muted-foreground disabled:opacity-25
                     disabled:cursor-not-allowed hover:bg-accent/50 hover:text-foreground
                     transition-colors"
        >
          ‹
        </button>

        {pageNums().map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="h-6 w-6 flex items-center justify-center text-[11px] text-muted-foreground/40"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`h-6 w-6 rounded text-[11px] flex items-center justify-center
                          transition-colors font-510
                          ${page === p
                            ? "bg-primary text-primary-foreground border border-primary"
                            : "border border-border/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-6 w-6 rounded border border-border/50 text-[11px] flex items-center
                     justify-center text-muted-foreground disabled:opacity-25
                     disabled:cursor-not-allowed hover:bg-accent/50 hover:text-foreground
                     transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
