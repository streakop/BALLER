"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickle: true,
      trickleSpeed: 200,
      minimum: 0.2,
      easing: "ease",
      speed: 500,
    });

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Find closest link
      const link = target.closest("a");

      if (link && link.href && link.origin === window.location.origin) {
        NProgress.start();
      }
    };

    const handleLoad = () => {
      NProgress.done();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("load", handleLoad);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
}