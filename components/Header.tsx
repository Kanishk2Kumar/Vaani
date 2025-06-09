"use client";

import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 font-mono">
      <div className="mx-16 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/icons/logo.png" alt="Logo" width={140} height={55} />
        </Link>

        <nav className="flex items-center gap-6 text-md">
          <Link
            href="/about"
            className="hover:underline underline-offset-4 transition duration-200"
          >
            ABOUT
          </Link>
          <Link
            href="/docs"
            className="hover:underline underline-offset-4 transition duration-200"
          >
            DOCS
          </Link>

          <ModeToggle />

          <Link href="/dashboard" target="_blank" rel="noopener noreferrer">
            <Button className="px-5 py-4 text-lg flex items-center bg-blue-800 hover:bg-blue-900 text-white ">
            Open Dashboard 
          </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
