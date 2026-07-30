'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, User, Settings, LogOut, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
// type UserRole = 'admin' | 'landlord' | 'tenant' | null;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const [userRole, setUserRole] = useState<UserRole>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = {
    general: [
      { href: '/', label: 'Home', icon: Home },
      { href: '/browse', label: 'Browse Properties', icon: Search },
    ],
    landlord: [
      { href: '/dashboard/landlord', label: 'Dashboard', icon: Home },
      { href: '/properties', label: 'My Properties' },
      { href: '/requests', label: 'Rental Requests' },
    ],
    tenant: [
      { href: '/dashboard/tenant', label: 'Dashboard', icon: Home },
      { href: '/my-requests', label: 'My Requests' },
      { href: '/bookmarks', label: 'Saved Properties' },
    ],
    admin: [
      { href: '/admin', label: 'Admin Panel', icon: Settings },
      { href: '/admin/moderation', label: 'Moderation' },
      { href: '/admin/users', label: 'Users' },
    ],
  };

  const getCurrentLinks = () => {
    const links = [...navLinks.general];
    // if (userRole === 'landlord') links.push(...navLinks.landlord);
    // if (userRole === 'tenant') links.push(...navLinks.tenant);
    // if (userRole === 'admin') links.push(...navLinks.admin);
    return links;
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 transition-all">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:inline">
                RoostFinder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {getCurrentLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notifications */}
              <button className="hidden sm:inline-flex relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              {/* {userRole ? ( */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <User className="w-4 h-4" />
                    {/* <span className="hidden sm:inline capitalize">{userRole}</span> */}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Profile Settings
                      </Link>
                      <button
                        // onClick={() => setUserRole(null)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              {/* ) : ( */}
                <div className="hidden sm:flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => setUserRole('tenant')}
                    className="text-slate-700 border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-900"
                  >
                        <Link href="/register">
      Sign In
    </Link>
                  </Button>
                  <Button
                    size="sm"
                    // onClick={() => setUserRole('landlord')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    List Property
                  </Button>
                </div>
              {/* )} */}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-900"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            <div className="px-4 py-4 space-y-2">
              {getCurrentLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-white rounded-md transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              {/* {!userRole && ( */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full text-slate-700 border-slate-300 hover:bg-white dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800"
                    onClick={() => {
                      // setUserRole('tenant');
                      setIsOpen(false);
                    }}
                  >
                    Sign In as Tenant
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      // setUserRole('landlord');
                      setIsOpen(false);
                    }}
                  >
                    List Property (Landlord)
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    onClick={() => {
                      // setUserRole('admin');
                      setIsOpen(false);
                    }}
                  >
                    Admin Access
                  </Button>
                </div>
              {/* )} */}

              {/* Mobile User Menu */}
              {/* {userRole && ( */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {/* {userRole === 'landlord' && 'Landlord Dashboard'}
                    {userRole === 'tenant' && 'Tenant Dashboard'}
                    {userRole === 'admin' && 'Admin Panel'} */}
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      // setUserRole(null);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              {/* )} */}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
