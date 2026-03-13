"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CourseClassroomHeaderProps {
  course: App.Course;
  user?: App.authContextType["user"] | null;
}

export function CourseClassroomHeader({
  course,
  user,
}: CourseClassroomHeaderProps) {
  return (
    <header className="h-20 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left: Logo and Back */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.png" alt="Academos" width={32} height={32} />
          <span className="font-bold text-white hidden md:block">Academos</span>
        </Link>

        <Separator
          orientation="vertical"
          className="h-6 bg-zinc-800 hidden md:block"
        />

        <Link
          href="/dashboard/courses"
          className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">My Courses</span>
        </Link>
        <span className="text-zinc-500 hidden md:inline">/</span>
        <h1 className="text-white font-medium text-sm md:text-base truncate max-w-[200px] md:max-w-md">
          {course.title}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Progress or other tools can go here */}

        {user && (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
