"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe2, Wrench } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/tools", label: "Tools", highlight: true }, // ⭐ NEW
    { href: "/blogs", label: "Blogs" },
    { href: "/courses", label: "Courses" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={SITE_CONFIG.branding.logo}
            width={36}
            height={36}
            alt={SITE_CONFIG.name}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-slate-900">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block">
              {SITE_CONFIG.tagline_1}
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                link.highlight
                  ? "text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm">
            <Globe2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsOpen((p) => !p)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-2 py-2 ${
                  link.highlight
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
