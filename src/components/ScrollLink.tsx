"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface ScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollLink({ href, children, className }: ScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (pathname === href || (href === "/" && pathname === "/")) {
      // If we are already on the target page, just smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If we are on a different page, navigate to it and then it will naturally load at the top
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
