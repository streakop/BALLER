"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // small delay to make it visible

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return null;
}