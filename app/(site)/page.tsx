import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import TrendingCourses from "@/components/home/TrendingCourses";
import PopularInstructors from "@/components/home/PopularInstructors";
import Discount from "@/components/home/Discount";

export default function Homepage() {
  return (
    <>
      <div className="flex flex-col pt-4 pl-3 md:pl-6 bg-(--main-color) mb-2">
        {/* ================= Header ================= */}
        <Header />
        {/* ================= Hero Section ================= */}
        <Hero />
      </div>

      {/* Trending Courses */}
      <TrendingCourses />
      {/* Popular Instructors */}
      <PopularInstructors />
      {/* JOIN AND GET DISCOUNT SECTION */}
      <Discount />
    </>
  );
}
