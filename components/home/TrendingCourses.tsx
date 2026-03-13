import CourseCard from "@/components/CourseCard";
import { getAllCourses } from "@/lib/api";
const TrendingCourses = async () => {
  const trendingCourses = (await getAllCourses()).courses;
  return (
    <div className="flex flex-col px-6 md:px-10 mb-10 mt-20">
      <h1 className="text-2xl font-bold">Trending Courses</h1>
      <p className="text-gray-500 mb-5">
        Discover the most popular courses right now
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {trendingCourses.map((course: App.Course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default TrendingCourses;
