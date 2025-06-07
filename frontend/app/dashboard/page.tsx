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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
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
        setRefreshTable((prev) => !prev); // <- triggers useEffect
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full py-2 ">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Analytics */}
      <div className="flex gap-2 flex-wrap justify-around">
        <div className="flex flex-col bg-gray-800 text-white p-2 rounded-2xl text-center">
          <p className="font-bold">Total Clicks</p>
          <p>{userAnalytics?.totalClicks}</p>
        </div>

        <div className="flex flex-col bg-gray-800 text-white p-2 rounded-2xl text-center">
          <p className="font-bold">Top Country</p>
          <p>
            {userAnalytics?.mostCountry?.country} &#8212;{" "}
            {userAnalytics?.mostCountry?.visitCount}
          </p>
        </div>

        <div className="flex flex-col bg-gray-800 text-white p-2 rounded-2xl text-center">
          <p className="font-bold">Top referrer</p>
          <p>
            {userAnalytics?.mostReferrer?.referrer} &#8212;{" "}
            {userAnalytics?.mostReferrer?.visitCount}
          </p>
        </div>

        <div className="flex flex-col bg-gray-800 text-white p-2 rounded-2xl text-center">
          <p className="font-bold">Top Clicked Link</p>
          <p>
            {userAnalytics?.mostClickedLink?.short_slug} &#8212; {""}
            {userAnalytics?.mostClickedLink?.clickCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Links</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gray-700 text-white" variant="outline">
                Open Dialog
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate A new Link</DialogTitle>
                <DialogDescription>
                  Add a new short link to your account
                </DialogDescription>
              </DialogHeader>

              {/* FORM SHOULD BE INSIDE DIALOG CONTENT */}
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
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Page;
