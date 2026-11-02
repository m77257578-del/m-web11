import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/mysql/status")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: false,
          connected: false,
          message: "MySQL bridge is not available on this hosting.",
        }),
    },
  },
});
