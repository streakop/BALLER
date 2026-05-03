// lib/progress.ts
import NProgress from "nprogress";

let activeRequests = 0;

export function startProgress() {
  activeRequests++;

  if (activeRequests === 1) {
    NProgress.start();
  }
}

export function stopProgress() {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests === 0) {
    NProgress.done();
  }
}