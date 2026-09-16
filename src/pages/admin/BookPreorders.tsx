import { useQuery } from "@tanstack/react-query";
import { preordersApi } from "@/api/preorders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageOpen } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  success: "default",
  pending: "secondary",
  failed: "destructive",
  abandoned: "destructive",
};

export default function BookPreorders() {
  const { data, isLoading } = useQuery({
    queryKey: ["book-preorders-admin"],
    queryFn: preordersApi.getAllAdmin,
  });
  const preorders = Array.isArray(data) ? data : [];

  const totalCopies = preorders
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = preorders
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Book Preorders</h1>
        <p className="text-muted-foreground">
          Preorders across every book. {totalCopies} copies confirmed, ₦
          {totalRevenue.toLocaleString()} collected.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : preorders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <PackageOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No preorders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Preorders will show up here once buyers start checking out.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preorders.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.bookTitle}</TableCell>
                  <TableCell>{p.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{p.email}</div>
                    <div className="text-xs">{p.whatsapp}</div>
                  </TableCell>
                  <TableCell className="text-right">{p.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₦{p.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status] || "secondary"} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
