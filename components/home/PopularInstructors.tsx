import InstructorCard from "@/components/InstructorCard";
import { getInstructors } from "@/lib/api";

const PopularInstructors = async () => {
  const instructors: App.Instructor[] = (await getInstructors()).instructors;

  return (
    <div className="flex flex-col px-6 md:px-10 mb-10 mt-20">
      <h1 className="text-2xl font-bold">Popular Instructors</h1>
      <p className="text-gray-500 mb-2">Learn from the best in the industry</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
        {instructors?.slice(0, 6).map((instructor) => (
          <InstructorCard
            key={instructor.id}
            id={instructor.id}
            name={instructor.name}
            role={instructor.role}
            bio={instructor.bio}
            picture={instructor.profileImg.url}
            coursesCount={instructor.courses?.length || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularInstructors;
