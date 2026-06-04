import Link from "next/link"; // 🧠 Force this file to look at Next.js, not itself
import { ComponentProps } from "react";

export function SmartLink({ prefetch, ...props }: ComponentProps<typeof Link>) {
  // ⚡ Detect if we are running 'npm run dev'
  const isDev = process.env.NODE_ENV === "development";
  
  // Force prefetch to false locally to save the DB. 
  // In production, let Next.js use its default high-speed prefetching.
  const optimizedPrefetch = isDev ? false : prefetch;

  return <Link prefetch={optimizedPrefetch} {...props} />;
}