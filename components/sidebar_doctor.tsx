"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import logoLight from "@/public/Group_3016.svg";
import logoDark from "@/public/Group_3015.svg";

import { BarChart3, Calendar, Calendar1, ClipboardList, LayoutDashboard, MessageCircle, Settings, Star, Timer, UserRound, X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState, useMemo } from "react";
import AnimateHeight from "react-animate-height";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: { title: string; href: string }[];
}

export function Doctor_Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  // Determine if user is an individual doctor (only individual doctors have receptionists)
  const isIndividualDoctor = user?.role === UserRole.INDIVIDUALDOCTOR;

  // Build sidebar items based on user role
  const sidebarItems: SidebarItem[] = useMemo(() => {
    const items: SidebarItem[] = [
      {
        title: "Dashboard",
        href: "/doctor-dashboard",
        icon: LayoutDashboard,
      },
    ];

    // Add Receptionist menu only for individual_doctor
    if (isIndividualDoctor) {
      items.push({
        title: "Receptionist",
        href: "/doctor-dashboard/receptionist",
        icon: UserRound,
      });
    }

    // Appointments - for all doctor roles
    items.push({
      title: "Appointments",
      href: "/doctor-dashboard/appointments",
      icon: Calendar,
      submenu: [
        { title: "All Appointments", href: "/doctor-dashboard/appointments" },
        { title: "Calendar View", href: "/doctor-dashboard/appointments/calendar" },
      ],
    });
 items.push({
      title: "Availability",
      href: "/doctor-dashboard/settings/hours",
      icon: Timer,
      // submenu: [
      //   { title: "In-Clinic", href: "/doctor-dashboard/settings/hours" },
      //   { title: "Online Consultation", href: "/doctor-dashboard/settings/online-hours" },
      // ],
    });
    // Patients - for all doctor roles
    items.push({
      title: "Patients",
      href: "/doctor-dashboard/patients",
      icon: UserRound,
    });

    // Reviews - for all doctor roles
    items.push({
      title: "Reviews",
      href: "/doctor-dashboard/reviews",
      icon: Star,
      submenu: [
        // { title: "Doctor Reviews", href: "/doctor-dashboard/reviews/doctors" },
        { title: "Patient Reviews", href: "/doctor-dashboard/reviews/patients" },
      ],
    });

    // Reports - for all doctor roles
    // items.push({
    //   title: "Reports",
    //   href: "/doctor-dashboard/reports",
    //   icon: BarChart3,
    //   submenu: [
    //     { title: "Overview", href: "/doctor-dashboard/reports" },
    //     { title: "Appointment Reports", href: "/doctor-dashboard/reports/appointments" },
    //     { title: "Financial Reports", href: "/doctor-dashboard/reports/financial" },
    //     { title: "Patient Visit Reports", href: "/doctor-dashboard/reports/patients" },
    //   ],
    // });

    // Analytics - for all doctor roles
    items.push({
      title: "Analytics",
      href: "/doctor-dashboard/analytics",
      icon: BarChart3,
    });

    // Chat - for all doctor roles
    items.push({
      title: "Chat",
      href: "/doctor-dashboard/chat",
      icon: MessageCircle,
    });

    // Tasks - for all doctor roles
    // items.push({
    //   title: "Tasks",
    //   href: "/doctor-dashboard/tasks",
    //   icon: ClipboardList,
    // });
      items.push({
      title: "Settings",
      href: "/doctor-dashboard/settings",
      icon: Settings,
     
    });

    return items;
  }, [isIndividualDoctor]);

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  const sidebarClasses = cn("!fixed h-full left-0 bottom-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out", {
    "translate-x-0": isOpen,
    "-translate-x-full": !isOpen,
    "translate-x-0 ": isOpen,
  });

  useEffect(() => {
    const foundItem = sidebarItems.find((item) => {
      if (item.submenu) {
        return item.submenu.some((subItem) => pathname === subItem.href);
      }
      return pathname === item.href;
    });
    if (foundItem?.submenu) {
      setOpenSubmenu(foundItem.title);
    }
  }, [sidebarItems, pathname]);
  return (
    <aside className={sidebarClasses}>
      <div className="flex py-3 xl:py-3.5 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={theme == "dark" ? logoDark : logoLight} alt="Medixpro" width={175} height={50} />

        </Link>
        <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setIsOpen(false)}>
          <X className="size-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      <div className="flex-1 py-2  border-t h-full overflow-y-auto">
        <nav className="space-y-1 px-2 ">
          {sidebarItems.map((item) => (
            <div key={item.title} className="space-y-1 custom-scrollbar">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      item.href !== "/" && pathname.startsWith(item.href) ? "bg-primary/10 text-primary" : " hover:bg-muted hover:text-foreground",
                      pathname == "/" && item.href == "/" ? "bg-primary/10 text-primary" : " hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn("h-4 w-4 transition-transform", {
                        "rotate-180": openSubmenu === item.title,
                      })}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <AnimateHeight height={openSubmenu === item.title ? "auto" : 0}>
                    <div className="ml-4 space-y-1 pl-2 pt-1">
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.title} href={subItem.href} className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", pathname === subItem.href ? "bg-primary/10 text-primary" : " hover:bg-muted hover:text-foreground")} onClick={() => isMobile && setIsOpen(false)}>
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </AnimateHeight>
                </>
              ) : (
                <Link href={item.href} className={cn("flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === item.href ? "bg-primary/10 text-primary" : " hover:bg-muted hover:text-foreground")} onClick={() => isMobile && setIsOpen(false)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t p-4 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="Dr. Sarah Johnson" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Dr. Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
