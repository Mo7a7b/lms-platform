import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bell, ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import { TAGS } from "@/lib/constants";

const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <div className="w-full px-4 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT: Logo + Browse */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Academos Logo"
                width={40}
                height={40}
              />
              <h1 className="font-bold">Academos</h1>
            </Link>
          </div>

          {/* Actions (mobile only) */}
          <div className="flex items-center gap-4 md:hidden">
            {token ? (
              <Link href="/dashboard">Dashboard</Link>
            ) : (
              <Link href="/auth/login">Login</Link>
            )}
            <Link href="/cart">
              <ShoppingCart />
            </Link>
            <Link href="/notifications">
              <Bell />
            </Link>
          </div>

          {/* Browse (desktop only) */}
          <div className="hidden md:flex relative">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium cursor-pointer">
                    <Link href="/courses">Browse</Link>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="z-9999 bg-white shadow-lg rounded-xl p-4">
                    <ul className="grid w-96 gap-2 md:grid-cols-2">
                      {TAGS.map((tag) => (
                        <ListItem
                          key={tag.title}
                          title={tag.title}
                          href={tag.href}
                        >
                          {tag.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* ACTIONS (desktop only) */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <Link href="/auth/login">Login</Link>
          )}
          <Link href="/cart">
            <ShoppingCart />
          </Link>
          <Link href="/notifications">
            <Bell />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
