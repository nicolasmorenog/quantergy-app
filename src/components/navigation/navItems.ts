import { History, LayoutDashboard, LineChart, Upload } from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    desktopHref: "/dashboard#dashboard",
    sectionId: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/predictions",
    desktopHref: "/dashboard#predictions",
    sectionId: "predictions",
    label: "Predictions",
    icon: LineChart,
  },
  {
    href: "/history",
    desktopHref: "/dashboard#history",
    sectionId: "history",
    label: "History",
    icon: History,
  },
  {
    href: "/upload",
    desktopHref: "/upload",
    label: "Upload",
    icon: Upload,
    adminOnly: true,
  },
] as const;
