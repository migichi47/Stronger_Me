import {
  CalendarDays,
  ChartNoAxesColumn,
  House,
  NotebookPen,
  Settings,
} from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";

export const navLinks = [
  {
    linkTo: "/",
    icon: House,
    name: "Dashboard",
  },
  {
    linkTo: "/calendar",
    icon: CalendarDays,
    name: "My Calendar",
  },
  {
    linkTo: "/stats",
    icon: ChartNoAxesColumn,
    name: "Stats",
  },
  {
    linkTo: "/goals",
    icon: TbTargetArrow,
    name: "Goals",
  },
  {
    linkTo: "/journal",
    icon: NotebookPen,
    name: "Journal",
  },
  {
    linkTo: "/settings",
    icon: Settings,
    name: "Settings",
  },
];
