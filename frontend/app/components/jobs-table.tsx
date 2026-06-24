import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2Icon,
  Save,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JobStatus, type JobApplicationResult } from "~/lib/client";
import api from "~/lib/api";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { toast } from "sonner";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

// Utility for creating a sortable header button.
// The returned component receives the column context and renders a
// Button that toggles sorting when clicked.
const sortableHeader =
  (label: string) =>
  ({ column }: { column: Column<JobApplicationResult, unknown> }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

const formatUtcDate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : utcDateFormatter.format(date);
};

export function JobsTable({
  jobs,
}: { jobs: JobApplicationResult[] } & React.ComponentProps<typeof Table>) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [jobData, setJobData] = React.useState<
    JobApplicationResult | undefined
  >(undefined);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [jobStatus, setJobStatus] = React.useState<JobStatus>(
    JobStatus.Applied,
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "date_applied",
      desc: true,
    },
  ]);
  const jobStatusOptions: JobStatus[] = Object.values(JobStatus).map((x) => x);

  const beginRowEdit = (rowData: JobApplicationResult) => {
    if (!rowData) {
      toast.warning(
        "There was an issue retrieving the rows data. Please refresh to try again",
      );
      return;
    }

    setJobData(rowData);
    if (rowData.status) {
      setJobStatus(rowData.status);
    }
    setOpenDialog(true);
  };

  const handleStatusChange = (value: JobStatus) => {
    setJobStatus(value);
  };

  const updateJobApplication = async (payload: {
    id: string;
    status: JobStatus;
  }) => {
    const { data } =
      await api.jobsApplied.updateJobApplicationJobsAppliedIdPatch(payload.id, {
        status: payload.status,
      });
    return data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: updateJobApplication,
    onSuccess: (updatedJob) => {
      setJobData(updatedJob);
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      toast.success("Job status updated successfully");
      setOpenDialog(false);
    },
    onError: () => {
      toast.error("Failed to update job status. Please try again.");
    },
  });

  const handleSave = () => {
    if (!jobData) return;
    mutate({ id: jobData.id, status: jobStatus });
  };

  const columns: ColumnDef<JobApplicationResult>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => beginRowEdit(data)}
          >
            <Edit2Icon />
          </Button>
        );
      },
    },
    {
      accessorKey: "company",
      header: sortableHeader("Company"),
    },
    {
      accessorKey: "position",
      header: sortableHeader("Position"),
    },
    {
      accessorKey: "site",
      header: sortableHeader("Website"),
      cell: ({ row }) => {
        const value: string = row.getValue("site");
        return (
          <div className="w-62.5 truncate">
            <a
              href={value}
              target="_blank"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {value}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: sortableHeader("Status"),
    },
    {
      accessorKey: "date_applied",
      header: sortableHeader("Date Applied"),
      cell: ({ row }) => (
        <span>{formatUtcDate(row.getValue("date_applied"))}</span>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId));
        const dateB = new Date(rowB.getValue(columnId));

        // Handle invalid dates to prevent breaking the UI
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      accessorKey: "date_modified",
      header: sortableHeader("Date Modified"),
      cell: ({ row }) => (
        <span>{formatUtcDate(row.getValue("date_modified"))}</span>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId));
        const dateB = new Date(rowB.getValue(columnId));

        // Handle invalid dates to prevent breaking the UI
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateA.getTime() - dateB.getTime();
      },
    },
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="overflow-auto">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter companies..."
            value={
              (table.getColumn("company")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("company")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 ">{/* Empty Div */}</div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-25 items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDialog}>
        <DialogContent
          aria-describedby="Editing job application"
          className="sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Job Application</DialogTitle>
          </DialogHeader>
          {jobData ? (
            <div className="flex flex-col gap-4 px-4 -mx-4">
              <Label>Company</Label>
              <Input id="name" value={jobData.company} readOnly />
              <Label>Position</Label>
              <Input id="email" value={jobData.position} readOnly />
              <Label>Status</Label>
              <Select value={jobStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status">
                    {jobStatus}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {jobStatusOptions.map((x) => (
                      <SelectItem key={x} value={x}>
                        {x}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button
                type="button"
                disabled={isPending}
                onClick={() => setOpenDialog(false)}
              >
                <X />
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isPending || !jobData || jobData.status === jobStatus}
              onClick={handleSave}
            >
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              <Save />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
