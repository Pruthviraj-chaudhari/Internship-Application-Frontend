import { NavItem } from "@/types";

export const facultyNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "home",
    label: "home",
  },
  {
    title: "Courses",
    href: "/courses",
    icon: "courses",
    label: "courses",
  },
  {
    title: "Instances",
    href: "/instances",
    icon: "createForm",
    label: "Instances",
  }
];

export const studentNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: "home",
    label: "home",
  },
  {
    title: "History",
    href: "/student/dashboard/history",
    icon: "history",
    label: "history",
  },
  {
    title: "Profile",
    href: "/student/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Logout",
    icon: "logout",
    label: "logout",
  },
];

