import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { fetchLogs } from "./logExplorer.thunks";
import type {
  LogExplorerState,
  LogFilters,
  LogSort,
  LogSeverity,
  SortField,
  SortOrder,
} from "./logExplorer.types";
import type { RootState } from "@/store/store";

/* ─── Initial state ─────────────────────────────────────────────────────── */
const initialFilters: LogFilters = {
  keyword:     "",
  searchField: "all",
  dateFrom:    "",
  dateTo:      "",
  severity:    [],
  services:    [],
  ipKeyword:   "",
  httpStatus:  "",
  country:     "",
};

const initialState: LogExplorerState = {
  allLogs:     [],
  selectedLog: null,
  filters:     initialFilters,
  sort:        { field: "timestamp", order: "desc" },
  pagination:  { page: 1, pageSize: 10 },
  loading:     false,
};

/* ─── Slice ──────────────────────────────────────────────────────────────── */
const logExplorerSlice = createSlice({
  name: "logExplorer",
  initialState,
  reducers: {
    setKeyword(state, { payload }: PayloadAction<string>) {
      state.filters.keyword    = payload;
      state.pagination.page    = 1;
    },
    setSearchField(state, { payload }: PayloadAction<LogFilters["searchField"]>) {
      state.filters.searchField = payload;
      state.pagination.page     = 1;
    },
    setDateFrom(state, { payload }: PayloadAction<string>) {
      state.filters.dateFrom = payload;
      state.pagination.page  = 1;
    },
    setDateTo(state, { payload }: PayloadAction<string>) {
      state.filters.dateTo  = payload;
      state.pagination.page = 1;
    },
    toggleSeverity(state, { payload }: PayloadAction<LogSeverity>) {
      const idx = state.filters.severity.indexOf(payload);
      if (idx === -1) state.filters.severity.push(payload);
      else            state.filters.severity.splice(idx, 1);
      state.pagination.page = 1;
    },
    setServices(state, { payload }: PayloadAction<string[]>) {
      state.filters.services = payload;
      state.pagination.page  = 1;
    },
    setIpKeyword(state, { payload }: PayloadAction<string>) {
      state.filters.ipKeyword = payload;
      state.pagination.page   = 1;
    },
    setHttpStatus(state, { payload }: PayloadAction<string>) {
      state.filters.httpStatus = payload;
      state.pagination.page    = 1;
    },
    setCountry(state, { payload }: PayloadAction<string>) {
      state.filters.country = payload;
      state.pagination.page = 1;
    },
    setSort(state, { payload }: PayloadAction<{ field: SortField; order: SortOrder }>) {
      state.sort = payload;
    },
    toggleSortField(state, { payload }: PayloadAction<SortField>) {
      if (state.sort.field === payload) {
        state.sort.order = state.sort.order === "asc" ? "desc" : "asc";
      } else {
        state.sort = { field: payload, order: "desc" };
      }
    },
    setPage(state, { payload }: PayloadAction<number>) {
      state.pagination.page = payload;
    },
    setPageSize(state, { payload }: PayloadAction<number>) {
      state.pagination.pageSize = payload;
      state.pagination.page     = 1;
    },
    setSelectedLog(state, { payload }: PayloadAction<LogExplorerState["selectedLog"]>) {
      state.selectedLog = payload;
    },
    clearFilters(state) {
      state.filters         = initialFilters;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error   = undefined;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.allLogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });
  },
});

export const {
  setKeyword, setSearchField, setDateFrom, setDateTo,
  toggleSeverity, setServices, setIpKeyword, setHttpStatus, setCountry,
  setSort, toggleSortField, setPage, setPageSize, setSelectedLog, clearFilters,
} = logExplorerSlice.actions;

export default logExplorerSlice.reducer;

/* ─── Selectors ─────────────────────────────────────────────────────────── */
const SEVERITY_ORDER: Record<string, number> = {
  critical: 0, error: 1, warning: 2, info: 3, debug: 4,
};

export const selectFilteredPaginatedLogs = createSelector(
  [(s: RootState) => s.logExplorer.allLogs,
   (s: RootState) => s.logExplorer.filters,
   (s: RootState) => s.logExplorer.sort,
   (s: RootState) => s.logExplorer.pagination],
  (allLogs, filters, sort, pagination) => {
    let result = [...allLogs];

    // keyword search
    if (filters.keyword.trim()) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter((log) => {
        switch (filters.searchField) {
          case "message":   return log.message.toLowerCase().includes(kw);
          case "source_ip": return log.source_ip.includes(kw);
          case "service":   return log.service.toLowerCase().includes(kw);
          default:
            return (
              log.message.toLowerCase().includes(kw) ||
              log.source_ip.includes(kw) ||
              log.service.toLowerCase().includes(kw) ||
              log.endpoint.toLowerCase().includes(kw)
            );
        }
      });
    }

    // severity filter
    if (filters.severity.length > 0) {
      result = result.filter((log) => filters.severity.includes(log.severity));
    }

    // service filter
    if (filters.services.length > 0) {
      result = result.filter((log) => filters.services.includes(log.service));
    }

    // IP filter
    if (filters.ipKeyword.trim()) {
      result = result.filter((log) =>
        log.source_ip.includes(filters.ipKeyword.trim()),
      );
    }

    // date range
    if (filters.dateFrom) {
      result = result.filter((log) => log.timestamp >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((log) =>
        log.timestamp <= filters.dateTo + "T23:59:59Z",
      );
    }

    // HTTP status class
    if (filters.httpStatus) {
      const cls = parseInt(filters.httpStatus, 10);
      result = result.filter(
        (log) => Math.floor(log.http_status / 100) === cls,
      );
    }

    // country
    if (filters.country.trim()) {
      const c = filters.country.toLowerCase();
      result = result.filter((log) => log.country.toLowerCase().includes(c));
    }

    // sort
    result.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sort.field === "severity") {
        av = SEVERITY_ORDER[a.severity] ?? 99;
        bv = SEVERITY_ORDER[b.severity] ?? 99;
      } else {
        av = a[sort.field] as string | number;
        bv = b[sort.field] as string | number;
      }
      if (av < bv) return sort.order === "asc" ? -1 : 1;
      if (av > bv) return sort.order === "asc" ? 1 : -1;
      return 0;
    });

    const total = result.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const logs  = result.slice(start, start + pagination.pageSize);

    return { logs, total };
  },
);

export const selectAvailableOptions = createSelector(
  (s: RootState) => s.logExplorer.allLogs,
  (allLogs) => ({
    services:  [...new Set(allLogs.map((l) => l.service))].sort(),
    countries: [...new Set(allLogs.map((l) => l.country))].sort(),
  }),
);

export const selectActiveFilterCount = createSelector(
  (s: RootState) => s.logExplorer.filters,
  (f) =>
    (f.severity.length > 0 ? 1 : 0) +
    (f.services.length > 0 ? 1 : 0) +
    (f.ipKeyword ? 1 : 0) +
    (f.httpStatus ? 1 : 0) +
    (f.country ? 1 : 0) +
    (f.dateFrom || f.dateTo ? 1 : 0),
);
