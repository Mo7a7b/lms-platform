import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirstLetter, formatPrice } from "@/lib/utils";

const CourseCard = ({
  id,
  title,
  description,
  poster,
  price,
  rating,
}: App.Course) => {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 hover:scale-102 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <Image
          src={poster.url}
          alt={title}
          fill
          className="object-cover"
          priority
          quality={100}
          unoptimized
        />
      </div>
      <CardHeader className="">
        <CardTitle className="line-clamp-2 h-5 text-base" title={title}>
          {capitalizeFirstLetter(title)}
        </CardTitle>
        <CardDescription className="line-clamp-3" title={description}>
          {capitalizeFirstLetter(description)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-0 flex flex-col gap-2 justify-start">
        <div className="w-full mt-4 flex items-left justify-start gap-5">
          <span className="text-lg font-bold">
            {formatPrice(price.toString())}
          </span>

          <Rating className="text-black/40 scale-90" rate={rating} showScore />
        </div>
        <Link href={`/courses/${id}`} className="w-full">
          <Button className="w-full">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
