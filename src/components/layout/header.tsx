import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import Image from "next/image";

export default function Header({navItems}:any) {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            href={"/"}
            target="_blank"
          >
            <div className=" flex w-full items-center justify-center dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <Image
                        src="/iitlogo.png"
                        alt="Vercel Logo"
                        width={50}
                        height={24}
                        priority
                    />
                    <p className="ml-2 text-lg text-black dark:text-white font-semibold">
                        Indian Institute of Technology, Bombay
                    </p>
                </div>
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar navItems={navItems} />
        </div>

        <div className="flex items-center gap-2">
          {/* <UserNav /> */}
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
