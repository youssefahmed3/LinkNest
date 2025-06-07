"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Visit = {
  id: string;
  link_id: string;
  ip_address: string;
  user_agent: string;
  referrer: string;
  country: string;
  clickedAt: string;
};

export type Link = {
  id: string;
  original_url: string;
  short_slug: string;
  click_count: number;
  createdAt: string;
  updatedAt: string;
  expireAt: string;
  visits: Visit[];
};

export const columns: ColumnDef<Link>[] = [
  {
    accessorKey: "original_url",
    header: "original_url",
  },
   {
    accessorKey: "short_slug",
    header: "Short URL",
    cell: ({ getValue }) => {
      const slug = getValue() as string;
      const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shortUrl/${slug}`;
      return (
        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {fullUrl}
        </a>
      );
    },
  },
  {
    accessorKey: "click_count",
    header: "click_count",
  },

  {
    accessorKey: "createdAt",
    header: "createdAt",
  },
  {
    accessorKey: "updatedAt",
    header: "updatedAt",
  },
  {
    accessorKey: "expireAt",
    header: "expireAt",
  },  {
    accessorKey: "visits",
    header: "visits",
  },
];
