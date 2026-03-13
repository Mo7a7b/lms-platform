import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

const Hero = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <div className="relative w-full flex items-center  mt-16 py-16 md:py-20 overflow-visible">
      {/* Text Content */}
      <div className="relative z-10 max-w-2xl text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
          Learn something
          <br />
          everyday.
        </h1>

        <p className="font-light text-lg sm:text-xl md:text-2xl mb-8">
          Become proficient in your chosen field with our expert-led courses.
        </p>

        <div className="flex flex-col sm:flex-row md:items-center w-full md:w-fit items-start gap-4">
          <Button
            asChild
            className="bg-white text-[#3DCBB1] w-[98%] md:w-fit hover:bg-[#f9f9f9]"
          >
            <Link href="/courses">Browse Courses</Link>
          </Button>
          {!token && (
            <Button
              asChild
              className="bg-[#3DCBB1] text-white w-[98%] md:w-fit hover:bg-[#36b19a]"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Hero Image (desktop only) */}
      <Image
        src="/assets/hero.png"
        alt="Hero Image"
        width={500}
        height={400}
        className="hidden lg:block absolute right-0 bottom-0 z-0"
        priority
      />
    </div>
  );
};

export default Hero;
