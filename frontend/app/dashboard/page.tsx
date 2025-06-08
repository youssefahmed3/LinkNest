"use client";
import { columns } from "@/components/dataTable/columns";
import { DataTable } from "@/components/dataTable/data-table";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import dayjs from "dayjs";
import Image from "next/image";
import { copyToClipboard } from "@/lib/utils";
import AnalyticsCard from "@/components/AnalyticsCard/AnalyticsCard";
import { Earth, MousePointerClick, UsersRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type userAnalyticsType = {
  totalClicks: number;
  mostClickedLink: {
    linkId: string;
    originalUrl: string;
    short_slug: string;
    clickCount: number;
  } | null;
  mostCountry: {
    country: string;
    visitCount: number;
  } | null;
  mostReferrer: {
    referrer: string;
    visitCount: number;
  } | null;
};

const formSchema = z.object({
  original_url: z.string().url().min(1, { message: "Enter a valid url" }),
});

function Page() {
  const [data, setData] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState<userAnalyticsType>();
  const [refreshTable, setRefreshTable] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // for the close of the dialog
  const [generatedResult, setGeneratedResult] = useState<null | {
    shortUrl: string;
    qrCodeImage: string;
  }>(null);

  const [showResultDialog, setShowResultDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      original_url: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:5000/shortUrl/links", {
        credentials: "include",
      });
      const json = await res.json();
      json.forEach((element: any) => {
        element.createdAt = dayjs(element.createdAt).format(
          "MMM D, YYYY h:mm A"
        );
        element.updatedAt = dayjs(element.updatedAt).format(
          "MMM D, YYYY h:mm A"
        );
        element.expireAt = dayjs(element.expireAt).format("MMM D, YYYY h:mm A");
      });
      console.log(json);

      setData(json);
    }

    async function fetchUserAnalytics() {
      const res = await fetch("http://localhost:5000/shortUrl/analytics", {
        credentials: "include",
      });
      const json = await res.json();

      setUserAnalytics(json);
      console.log(json);
    }
    fetchData();
    fetchUserAnalytics();
  }, [refreshTable]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/shortUrl/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        setRefreshTable((prev) => !prev); // <- triggers useEffect

        form.reset(); // reset form

        setDialogOpen(false); // CLOSE the dialog

        setGeneratedResult({
          shortUrl: data.shortUrl,
          qrCodeImage: data.qrCodeImage,
        });
      }
      setShowResultDialog(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full py-2 ">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Separator className="my-4" />

      {/* Analytics */}

      <div className="flex justify-around">
        <AnalyticsCard
          data={userAnalytics?.totalClicks}
          icon={<MousePointerClick />}
          title="Total Clicks"
        />
        <AnalyticsCard
          data={userAnalytics?.mostCountry?.country == "Unknown" ? "Other" : userAnalytics?.mostCountry?.country }
          icon={<Earth />}
          title="Top Country"
        />

        <AnalyticsCard
          data={userAnalytics?.mostReferrer?.referrer == "Unknown" ? "Other" : userAnalytics?.mostReferrer?.referrer}
          icon={<UsersRound />}
          title="Top referrer"
        />

        <AnalyticsCard
          data={userAnalytics?.mostClickedLink?.short_slug}
          icon={<MousePointerClick />}
          title="Top Clicked Link"
        />
      </div>
      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Links</h2>
          {/* Generate a new link Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-700 text-white" variant="outline">
                Generate A Link
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate A new Link</DialogTitle>
                <DialogDescription>
                  Add a new short link to your account
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="original_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input placeholder="link..." type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Generating
                        </>
                      ) : (
                        "Generate A New Short Link"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Result Dialog */}
          <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Created Successfully</DialogTitle>
                <DialogDescription>
                  Here’s your new short link and QR code.
                </DialogDescription>
              </DialogHeader>

              {generatedResult && (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div className="flex flex-col gap-2 justify-between items-center">
                    <p className="font-semibold">{generatedResult.shortUrl}</p>
                    <Button
                      variant={"outline"}
                      onClick={() => copyToClipboard(generatedResult.shortUrl)}
                    >
                      Copy Link To Clipboard
                    </Button>
                  </div>

                  <Image
                    src={generatedResult.qrCodeImage}
                    alt="QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setShowResultDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Page;
