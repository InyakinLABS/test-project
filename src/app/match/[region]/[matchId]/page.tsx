import { Suspense } from "react";
import { MatchPageContent } from "./MatchPageContent";
import { Loader } from "@/components/common/Loader";

export default function MatchPage() {
  return (
    <Suspense fallback={<Loader text="Загрузка матча..." />}>
      <MatchPageContent />
    </Suspense>
  );
}
