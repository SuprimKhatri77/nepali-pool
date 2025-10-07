import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type TableRow = {
  sn: number;
  name: string;
  status: string;
  info: string;
};

export function DashboardMentorTable() {
  const tableData: TableRow[] = [
    { sn: 1, name: "Roshan Pokharel", status: "Active", info: "User details" },
    {
      sn: 2,
      name: "Alice Johnson",
      status: "Pending",
      info: "Approval needed",
    },
    { sn: 3, name: "Michael Smith", status: "Inactive", info: "Deactivated" },
    { sn: 4, name: "Sophia Lee", status: "Active", info: "All good" },
  ];
  return (
    <Table className="border-1">
      <TableCaption>A list of your recent calls.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Info</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((data) => (
          <TableRow key={data.sn}>
            <TableCell>{data.sn}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.status}</TableCell>
            <TableCell>{data.info}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow></TableRow>
      </TableFooter>
    </Table>
  );
}
