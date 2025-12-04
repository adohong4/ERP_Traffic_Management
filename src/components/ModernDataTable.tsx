import { useState, useMemo, ReactNode } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import PaginationBar from "./PaginationBar";

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string; // e.g., '200px', '15%', 'auto'
}

export interface FilterConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface ModernDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  searchPlaceholder?: string;
  searchKeys?: string[];
  filters?: FilterConfig[];
  onExport?: () => void;
  actions?: ReactNode;
  getItemKey: (item: T) => string;
}

export default function ModernDataTable<
  T extends Record<string, any>,
>({
  data,
  columns,
  title,
  searchPlaceholder = "Tìm kiếm...",
  searchKeys = [],
  filters = [],
  onExport,
  actions,
  getItemKey,
}: ModernDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterValues, setFilterValues] = useState<
    Record<string, string>
  >(
    filters.reduce(
      (acc, filter) => ({ ...acc, [filter.key]: "all" }),
      {},
    ),
  );

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const matchesSearch =
        searchKeys.length === 0 ||
        searchKeys.some((key) => {
          const value = item[key];
          if (value === null || value === undefined)
            return false;
          return String(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });

      // Custom filters
      const matchesFilters = filters.every((filter) => {
        const filterValue = filterValues[filter.key];
        if (filterValue === "all") return true;
        return item[filter.key] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filterValues, searchKeys, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate if we should auto-fit columns
  const shouldAutoFit = useMemo(() => {
    const columnsWithWidth = columns.filter(col => col.width);
    if (columnsWithWidth.length === 0) return true;
    
    // Calculate total explicit width
    const totalWidth = columnsWithWidth.reduce((sum, col) => {
      const width = col.width || '0';
      // Only count pixel values
      if (width.endsWith('px')) {
        return sum + parseInt(width);
      }
      return sum;
    }, 0);
    
    // If total width < 900px (typical minimum table width), enable auto-fit
    return totalWidth < 900;
  }, [columns]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <ChevronsUpDown className="h-4 w-4 ml-1 text-slate-400" />
      );
    }
    if (sortConfig.direction === "asc") {
      return (
        <ChevronUp className="h-4 w-4 ml-1 text-cyan-600" />
      );
    }
    return (
      <ChevronDown className="h-4 w-4 ml-1 text-cyan-600" />
    );
  };

  const resetFilters = () => {
    setFilterValues(
      filters.reduce(
        (acc, filter) => ({ ...acc, [filter.key]: "all" }),
        {},
      ),
    );
    setSearchTerm("");
  };

  const hasActiveFilters =
    searchTerm ||
    Object.values(filterValues).some((v) => v !== "all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Jira-style: Clean header outside the card */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredData.length} kết quả
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 bg-white border-slate-200 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-slate-200 transition-all ${hasActiveFilters ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "hover:border-cyan-300"}`}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">
                        Bộ lọc
                      </h4>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="h-auto p-0 text-xs text-cyan-600 hover:text-cyan-700"
                        >
                          Xóa tất cả
                        </Button>
                      )}
                    </div>
                    {filters.map((filter) => (
                      <div
                        key={filter.key}
                        className="space-y-2"
                      >
                        <Label className="text-sm text-slate-700">
                          {filter.label}
                        </Label>
                        <Select
                          value={filterValues[filter.key]}
                          onValueChange={(value) => {
                            setFilterValues((prev) => ({
                              ...prev,
                              [filter.key]: value,
                            }));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="bg-white border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Export */}
            {onExport && (
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onExport}
                      className="border-slate-200 hover:border-cyan-300 hover:text-cyan-600 transition-all"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xuất dữ liệu</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            )}

            {/* Custom actions */}
            {actions}
          </div>
        </div>
      </div>

      {/* Jira-style: Clean white card with subtle shadow */}
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-full">
              {/* Table Header - Jira style: simple, clean */}
              <div className="bg-slate-50/80 border-b border-slate-200">
                <div className={`flex ${shouldAutoFit ? 'w-full' : ''}`}>
                  {columns.map((column, idx) => (
                    <div
                      key={column.key}
                      style={shouldAutoFit ? {
                        width: column.width || undefined,
                        minWidth: column.width || '100px',
                        flex: column.width ? undefined : '1 1 auto'
                      } : {
                        width: column.width || "auto",
                        minWidth: column.width || "auto",
                      }}
                      className={`
                        px-6 py-3.5 text-left flex items-center ${shouldAutoFit ? '' : 'flex-shrink-0'} whitespace-nowrap
                        ${column.headerClassName || column.className || ""}
                        ${idx === 0 ? "sticky left-0 bg-slate-50/80 z-10" : ""}
                      `}
                    >
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="flex items-center text-xs uppercase tracking-wider text-slate-800 hover:text-cyan-600 transition-colors group font-semibold"
                        >
                          <span>{column.header}</span>
                          {getSortIcon(column.key)}
                        </button>
                      ) : (
                        <span className="text-xs uppercase tracking-wider text-slate-800 font-semibold">
                          {column.header}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Body - Jira style: clean rows with subtle hover */}
              <div>
                {paginatedData.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-sm">
                      Không tìm thấy dữ liệu
                    </p>
                  </div>
                ) : (
                  paginatedData.map((item, index) => (
                    <motion.div
                      key={getItemKey(item)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.01,
                      }}
                      className={`flex border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150 group ${shouldAutoFit ? 'w-full' : ''}`}
                    >
                      {columns.map((column, idx) => (
                        <div
                          key={column.key}
                          style={shouldAutoFit ? {
                            width: column.width || undefined,
                            minWidth: column.width || '100px',
                            flex: column.width ? undefined : '1 1 auto'
                          } : {
                            width: column.width || "auto",
                            minWidth: column.width || "auto",
                          }}
                          className={`
                            px-6 py-4 flex items-center ${shouldAutoFit ? '' : 'flex-shrink-0'} text-sm text-slate-700
                            ${column.className || ""}
                            ${idx === 0 ? "sticky left-0 bg-white group-hover:bg-slate-50/70 z-10" : ""}
                          `}
                        >
                          {column.render(
                            item,
                            (currentPage - 1) * itemsPerPage +
                              index,
                          )}
                        </div>
                      ))}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-white">
              <PaginationBar
                currentPage={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}