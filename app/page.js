import { lazy, Suspense } from "react";

const MainSection = lazy(() => import("./sections/Main"));

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="font-pf text-3xl">Loading...</div>}>
        <MainSection />
        <div className="h-screen bg-[#45444e] flex items-end">
          <h1 className="text-white font-pf text-9xl p-8 my-5">
            See you around!
          </h1>
        </div>
      </Suspense>
    </div>
  );
}
