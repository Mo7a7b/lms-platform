declare namespace App {
  // Courses Types
  interface CourseCardProps {
    id: number;
    title: string;
    description: string;
    poster: string;
    price: string;
    rating: number;
    tag?: string;
  }
  interface Instructor {
    id: number;
    name: string;
    email: string;
    role: "Instructor";
    bio: string;
    profileImg: { url: string; publicId: string };
    courses: Course[];
    stripeAccountId: string;
    isStripeConnected: boolean;
    _count?: {
      courses: number;
      students: number;
    };
  }

  interface InstructorCardProps {
    id: number;
    name: string;
    role: string;
    bio: string;
    picture: string;
    coursesCount: number;
  }

  interface Chapter {
    id: number;
    title: string;
    course: Course;
    courseId: number;
    description: string;
    order: number;
    isFreePreview: boolean;
    videos: Video[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface Course {
    id: number;
    title: string;
    description: string;
    poster: { url: string; publicId: string };
    requirements: string[];
    whatYouWillLearn: string[];
    category: CourseCategory;
    price: number;
    status: "Draft" | "Published" | "Archived";
    totalDuration: number;
    totalVideos: number;
    rating: number;
    enrollments: Enrollment[];
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
    chapters: Chapter[];
  }

  enum CourseCategory {
    Programming,
    Design,
    Business,
    Marketing,
    Health,
    Productivity,
    Languages,
    Mathematics,
    Science,
    Engineering,
    Electronics,
    Cooking,
    Music,
    Writing,
    History,
    Law,
  }

  interface Video {
    id: number;
    title: string;
    chapter: Chapter;
    chapterId: number;
    description: string;
    duration: number;
    url: string;
    provider: "Youtube" | "Mux";
    createdAt: Date;
    updatedAt: Date;
  }
  interface Enrollment {
    id: number;
    user: User;
    userId: number;
    course: Course;
    courseId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Review {
    id: number;
    user: User;
    userId: number;
    course: Course;
    courseId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }
  // Auth Types
  enum AuthDialogMode {
    SignIn = "SignIn",
    SignUp = "SignUp",
  }
  // Server Action Types
  interface FormState {
    success?: boolean;
    message: string;
    data?: unknown;
  }

  type ActionFunction = (
    prevState: FormState,
    formData: FormData,
  ) => Promise<FormState | void>;

  // SWR Mutation Types
  type SWRMutationFetcher<T, Arg> = (
    key: string,
    { arg }: { arg: Arg },
  ) => Promise<T>;

  interface User {
    id: number;
    name: string;
    email: string;
    role: "Student" | "Instructor";
    profileImg: { url: string; publicId: string };
  }

  // Auth Context
  type authContextType = {
    user: User;
    token: string;
  };
  // Pagination
  interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
