import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HeartIcon } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t w-full h-16">
      <div className="container text-lg font-mono flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-md flex-wrap sm:py-0 py-3 px-16">
        <div className="flex items-center gap-3">
          <p className="text-center flex flex-row">
            Built by&nbsp;
            <Link
              className="underline underline-offset-2"
              target="_blank"
              href="https://github.com/Kanishk2Kumar"
            >
              Team Optimus
            </Link>
            <Image src="/images/Teamlogo.png" alt="Team Logo" height={25} width={25} className="ml-2" />
          </p>
        </div>

        <div className="gap-4 hidden md:flex">
          <FooterButtons />
          <Link href="https://github.com/Kanishk2Kumar/SwastaSetu">
          <Image src="/icons/Github.svg" alt="Github Logo" height={30} width={30} className="mt-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://github.com/sponsors/m3hu1"
        target="_blank"
        className={buttonVariants({ variant: "outline" })}
      >
        <HeartIcon className="h-4 w-4 mr-2 text-red-600 fill-current" />
        Sponsor Us
      </Link>
    </>
  );
}