import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon } from "lucide-react";
import { JobStatus, type JobApplicationResult } from "~/lib/client";
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

// Utility for creating a sortable header button.
// The returned component receives the column context and renders a
// Button that toggles sorting when clicked. It replicates the
// pattern used in line ~34 (the "Company" column).
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

export function JobsTable({
  jobs,
  ...props
}: { jobs: JobApplicationResult[] } & React.ComponentProps<typeof Table>) {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [jobData, setJobData] = React.useState<
    JobApplicationResult | undefined
  >(undefined);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const beginRowEdit = (rowData: JobApplicationResult) => {
    if (!rowData) {
      toast.warning(
        "There was an issue retrieving the rows data. Please refresh to try again",
      );
      return;
    }

    setJobData(rowData);
    setOpenDialog(true);
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
    },
    {
      accessorKey: "date_modified",
      header: sortableHeader("Date Modified"),
    },
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div>
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
        <div className="overflow-hidden rounded-md border">
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
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
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
              <Select
                value={jobData.status}
                onValueChange={() => {
                  console.log(jobData);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value={JobStatus.Accepted}>
                      {JobStatus.Accepted}
                    </SelectItem>
                    <SelectItem value={JobStatus.Interviewing}>
                      {JobStatus.Interviewing}
                    </SelectItem>
                    <SelectItem value={JobStatus.Rejected}>
                      {JobStatus.Rejected}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" onClick={() => setOpenDialog(false)}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
