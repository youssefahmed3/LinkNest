import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-50 gap-2">
      <div className="text-center">
        <h1 className="text-4xl font-bold">LinkNest</h1>
        <p className="text-gray-600 mt-2">
          Shorten your links, track your clicks and more
        </p>
      </div>

      <div className="flex gap-4">
        <Link href={"/register"}>
          <Button className="cursor-pointer">Get Started</Button>
        </Link>

        <Link href={"/register"}>
          <Button className="cursor-pointer">Login</Button>
        </Link>
      </div>
    </div>
  );
}
