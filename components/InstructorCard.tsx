import Image from "next/image";
import Link from "next/link";
const InstructorCard = ({
  id,
  name,
  picture,
  bio,
  role,
  coursesCount,
}: App.InstructorCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl border bg-white shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 cursor-pointer group">
      <Link
        href={`instructors/${id}`}
        className="relative flex flex-col items-center w-full"
      >
        <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-primary/10">
          <Image
            src={picture} // Fallback image if null
            fill
            alt={name}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-bold text-xl text-zinc-900 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {role}
          </span>
          <p className="text-zinc-500 text-sm line-clamp-2 max-w-[250px]">
            {bio || "No biography available."}
          </p>
          <div className="mt-2 text-xs text-zinc-400 font-medium">
            {coursesCount} {coursesCount === 1 ? "Course" : "Courses"}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default InstructorCard;
