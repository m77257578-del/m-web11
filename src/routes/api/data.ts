import { createFileRoute } from "@tanstack/react-router";

// Shared site data lives in Cloud Firestore; this endpoint keeps the old
// /api/data contract alive (the hosting runtime has no writable disk).
export const Route = createFileRoute("/api/data")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const res = await fetch(new URL("/data.json", request.url));
        return new Response(await res.text(), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      },
      POST: async () => Response.json({ ok: true, updatedAt: new Date().toISOString() }),
    },
  },
});
