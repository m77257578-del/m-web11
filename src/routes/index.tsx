import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MWebApp = lazy(() => import("@/app/Root"));

const title = "M Web | إم ويب لتطوير البرمجيات وحلول الويب";
const description =
  "شركة برمجية متخصصة في تطوير وتصميم مواقع الويب، الأنظمة الإدارية، والمنصات الرقمية المتكاملة بأعلى معايير السرعة والأمان.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-slate-950" />}>
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <MWebApp />
      </Suspense>
    </ClientOnly>
  );
}
