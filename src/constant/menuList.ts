import { LayoutDashboard } from "lucide-react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaAnchorCircleExclamation } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";

export const menuList = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "About",
    url: "/about",
    icon: AiOutlineFileSearch,
  },
  {
    title: "Services's",
    url: "/services",
    icon: FaAnchorCircleExclamation,
  },
  {
    title: "Booked Tour",
    url: "/bookedTour",
    icon: IoTicketOutline,
  },
];
