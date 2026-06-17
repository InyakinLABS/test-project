import { Suspense } from "react";
import { HomePage } from "./HomePage";
import { Loader } from "@/components/common/Loader";

export default function Home() {
  return (
    <Suspense fallback={<Loader text="Загрузка..." />}>
      <HomePage />
    </Suspense>
  );
}
