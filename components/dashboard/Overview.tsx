"use client";
import { useAuthData } from "@/hooks/useAuthData";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
const StudentOverview = dynamic(() => import("./StudentOverview"));
const InstructorOverview = dynamic(() => import("./InstructorOverview"));

function Overview() {
  const { token, user } = useAuthData();
  return (
    <div className="min-h-screen w-full bg-muted p-6">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImg.url} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline">
          <Link href="/dashboard/settings">Edit Profile</Link>
        </Button>
      </div>

      {/* Role Based Content */}
      {user.role === "Student" ? (
        <StudentOverview />
      ) : (
        <InstructorOverview token={token} />
      )}
    </div>
  );
}

export default Overview;
