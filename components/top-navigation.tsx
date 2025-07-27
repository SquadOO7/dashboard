"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  X,
  Home,
  AlertTriangle,
  BarChart3,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // const { user, logout } = useAuthContext() // Uncomment if using authentication

  // const handleLogout = async () => {
  //   await logout()
  // }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center px-4'>
        {" "}
        {/* Removed justify-between here */}
        {/* Logo and Brand */}
        <div className='flex items-center space-x-4'>
          <Link href='/' className='flex items-center space-x-3'>
            <div className='relative h-8 w-8'>
              <Image
                src='/images/citypulse-logo.png'
                alt='CityPulse Logo'
                width={32}
                height={32}
                className='object-contain'
                priority
              />
            </div>
            {/* Increased font size of CityPulse logo text */}
            <span className='hidden font-bold sm:inline-block text-xl md:text-2xl lg:text-3xl'>
              CityPulse
            </span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        {/* Removed flex-1 from nav, added ml-auto for right alignment, and mx-auto for centering within its new flow */}
        <nav className='hidden md:flex ml-auto mr-4 lg:mr-8 items-center space-x-6'>
          {" "}
          {/* Adjusted margins for spacing */}
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                  "text-base md:text-lg",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                <Icon className='h-4 w-4 md:h-5 md:w-5' />{" "}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        {/* Right Side Actions (Hamburger/User Menu) */}
        {/* Added ml-auto here, which will push this group to the far right if nav doesn't take all space */}
        <div className='flex items-center space-x-2'>
          {" "}
          {/* Removed ml-auto here as it's now handled by the outer div */}
          {/* Notification Button */}
          <Button variant='ghost' size='icon' className='relative'>
            <Bell className='h-5 w-5' />
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center'>
              3
            </Badge>
          </Button>
          {/* User Dropdown - Uncommented for testing positioning, remove if not needed yet */}
          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className='md:hidden border-t bg-background'>
          <div className='container px-4 py-4'>
            <nav className='flex flex-col space-y-3'>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                      "text-base",
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className='h-4 w-4' />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
