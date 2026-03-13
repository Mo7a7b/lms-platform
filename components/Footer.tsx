import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const tags: { id: string; title: string }[] = [
    { id: "1", title: "Design" },
    { id: "2", title: "Development" },
    { id: "3", title: "Marketing" },
    { id: "4", title: "Business" },
    { id: "5", title: "Photography" },
    { id: "6", title: "Music" },
    { id: "7", title: "Personal Development" },
    { id: "8", title: "Health & Fitness" },
    { id: "9", title: "IT & Software" },
  ];
  const socialLinks: {
    id: string;
    title: string;
    href: string;
    icon: LucideIcon;
  }[] = [
    {
      id: "1",
      title: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
    },
    {
      id: "3",
      title: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
    },
    {
      id: "4",
      title: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
    },
  ];
  return (
    <div className="w-full bg-[#1B1B1B] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-start">
          <div className="mb-2 md:mb-0 flex items-center gap-2">
            <Image src="/logo.png" alt="Academos Logo" width={40} height={40} />
            <Link href="/" className="text-xl font-bold">
              Academos
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-[60%]">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/courses/${tag.title}`}
                className="text-gray-400 hover:text-white font-light transition-colors text-sm sm:text-base"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>
        <Separator className="my-6 md:my-8 bg-[#f9f9f9]/10" />
        <div className="mt-6 md:mt-8 text-center md:text-sm text-gray-500 text-xs flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Academos. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-gray-400 hover:text-white font-light transition-colors"
              >
                <link.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
