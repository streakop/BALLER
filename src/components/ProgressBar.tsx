"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Configure once
    NProgress.configure({
      showSpinner: false,
      trickle: true,       // auto-increment
      trickleSpeed: 100,   // speed of increments
      minimum: 0.1,        // start at 10%
    });

    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
