"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Bell, ChevronRight } from "lucide-react";
import Profile01 from "./profile-01";
//import { Image } from "@radix-ui/react-avatar"
import { Link } from "react-router";
import CommandPalette from "./CommandPalette/CommandPalette";
import SearchButton from "./CommandPalette/SearchButton";
import { useState } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function TopNav() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "kokonutUI", href: "#" },
    { label: "dashboard", href: "#" },
  ];
    const [open, setOpen] = useState(false);


  return (
    <nav className="flex items-center justify-between h-full px-3 bg-white border-b border-gray-200 sm:px-6">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-500" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-700 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900">{item.label}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <SearchButton onClick={() => setOpen(true)} />
        <CommandPalette open={open} setOpen={setOpen} />
      </div>


      <div className="flex items-center gap-2 ml-auto sm:gap-4 sm:ml-0">
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none"></DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
          >
            <Profile01 avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
