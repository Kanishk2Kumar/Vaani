"use client";
import { AnimatedGridPattern } from "@/components/animated-grid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, MoveUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="relative">
      <Header />
      <div className="hero-section relative flex sm:min-h-[92vh] min-h-[85vh] flex-col items-center justify-center text-center px-2 py-8">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 -z-10 hidden sm:block [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        />
        <Link
          href="https://github.com/Kanishk2Kumar/Vaani"
          target="_blank"
          className="mb-5 text-xl flex items-center gap-2 underline underline-offset-2 sm:-mt-12 font-mono"
        >
          Support Us by starring the repository{" "}
          <MoveUpRightIcon
            className="w-4 h-4 font-extrabold"
            style={{ transform: "translateY(2px)" }}
          />
        </Link>
        <h1 className="text-3xl font-bold mb-4 sm:text-6xl pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10 pb-2">
          <span className="block sm:hidden">Block Forge</span>
          <span className="hidden sm:block">
            Voice AI agents for developers
          </span>
        </h1>
        <div className="relative w-full flex flex-col items-center mb-6 z-10 mt-2">
          <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[6px] w-2/4 blur-sm animate-pulse" />
          <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4 mt-[-2px] animate-pulse" />
        </div>
        <p className="text-gray-400 text-lg text-center z-10">
          A Voice-First Conversational AI Assistant that feels natural,
          informative and customizable <br />
          It is designed to facilitate natural, informative, and customizable
          interactions.
        </p>
        {!loading && user && (
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-4">
            Welcome, {user.fullname || user.name || "User"}!
          </h2>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-6 z-10 ">
          {!user && (
            <Link href="/sign-in">
              <Button className="px-5 py-5 text-lg flex items-center bg-blue-800 hover:bg-blue-900 text-white ">
                Sign Up <ArrowRight className="ml-1" />
              </Button>
            </Link>
          )}

          <Link href="/docs">
            <Button
              variant="outline"
              className="px-5 py-5 text-lg border-blue-800"
            >
              Documentation
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
