import Image from "next/image";
import Link from "next/link";
import { getInstructorById } from "@/lib/api";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Star,
  Award,
  Verified,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{
    instructorId: string;
  }>;
}

export default async function InstructorPage({ params }: PageProps) {
  const { instructorId } = await params;

  let instructor: App.Instructor | null = null;
  let error = null;

  try {
    instructor = (await getInstructorById(instructorId)).instructor;
  } catch (e) {
    console.error("Failed to fetch instructor", e);
    error = "Instructor not found";
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Instructor Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          The instructor you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Hero Header */}
      <div className="relative bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20" />
        <div className="container mx-auto px-4 py-8 relative">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-white/10 shadow-xl overflow-hidden bg-zinc-800">
                <Image
                  src={instructor.profileImg.url}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-blue-500 text-white p-2 rounded-full border-1 border-zinc-900 shadow-lg"
                title="Verified Instructor"
              >
                <Verified className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {instructor.name}
                </h1>
                <p className="text-xl text-zinc-300 font-medium">
                  {instructor.role}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-white text-primary" />
                  <span>{instructor.courses?.length || 0} Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white text-primary" />
                  <span>{instructor._count?.students || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>
                    {instructor.courses.reduce(
                      (acc, course) => acc + course.rating,
                      0,
                    ) / instructor.courses.length || 0}{" "}
                    Instructor Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Bio & Courses */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                About {instructor.name.split(" ")[0]}
              </h2>
              <div className="prose prose-zinc max-w-none text-gray-600 leading-relaxed">
                <p>
                  {instructor.bio || "This instructor has not added a bio yet."}
                </p>
              </div>
            </section>

            {/* Courses Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Courses by {instructor.name.split(" ")[0]}
                </h2>
                <Link href={`/courses?query=${instructor.name}`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {instructor.courses && instructor.courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructor.courses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-zinc-300">
                  <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No courses yet
                  </h3>
                  <p className="text-gray-500">
                    This instructor hasn&apos;t published any courses yet.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Stats or Contact? */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Instructor Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-bold text-gray-900">
                    {instructor._count?.students || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-bold text-gray-900">124</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <span className="text-gray-600">Total Content</span>
                  <span className="font-bold text-gray-900">
                    {instructor.courses?.length || 0} Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
