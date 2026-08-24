import { useState, useEffect } from "react";
import { Download, Mail, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { newsletterApi } from "@/api/newsletter";
import { useToast } from "@/components/ui/use-toast";
import { errorMessage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsletterSubscribers() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<{ email: string; createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await newsletterApi.getSubscribers({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setSubscribers(data);
    } catch (err) {
      toast({
        title: "Failed to fetch subscribers",
        description: errorMessage(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [startDate, endDate]);

  const handleDownloadCSV = () => {
    if (!subscribers.length) return;

    const headers = ["Email", "Subscribed At"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map(sub => `"${sub.email}","${format(new Date(sub.createdAt), "yyyy-MM-dd HH:mm:ss")}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter_subscribers_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-1">
            View and export email subscribers for marketing campaigns.
          </p>
        </div>
        <Button onClick={handleDownloadCSV} disabled={!subscribers.length || isLoading} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter subscribers by subscription date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead>Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                    No subscribers found for this date range.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((sub) => (
                  <TableRow key={sub.email}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {sub.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(sub.createdAt), "PPP")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
