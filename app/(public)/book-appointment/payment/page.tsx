"use client";

import Payment from "@/components/landing/payment";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Payment />
    </Suspense>
  );
}
