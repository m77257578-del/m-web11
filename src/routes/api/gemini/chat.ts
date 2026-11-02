import { createFileRoute } from "@tanstack/react-router";

type Msg = { role?: string; text?: string; content?: string };

export const Route = createFileRoute("/api/gemini/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as any;
        const brandAr = String(body.brandNameAr || "إم ويب").slice(0, 60);
        const brandEn = String(body.brandNameEn || "M Web").slice(0, 60);
        const phone = String(body.whatsappPhone || "201000000000").slice(0, 20);
        const fallback = `أهلاً بك في ${brandAr} (${brandEn}) 🤖⚡\nنحن منصة برمجية متخصصة في تطوير المنصات الرقمية والمتاجر الإلكترونية.\n• للتواصل المباشر مع الدعم الفني: +${phone}`;
        const key = process.env["LOVABLE_API_KEY"];
        const message = String(body.message || "").slice(0, 4000);
        if (!message)
          return Response.json(
            { error: "EMPTY_MESSAGE", message: "يرجى كتابة رسالة." },
            { status: 400 },
          );
        if (!key) return Response.json({ reply: fallback, model: "fallback-engine" });

        const history: Msg[] = Array.isArray(body.history) ? body.history.slice(-12) : [];
        const messages = [
          {
            role: "system",
            content: `أنت مساعد ذكي عام لشركة ${brandAr} (${brandEn}). أجب على أي سؤال يطرحه المستخدم في أي مجال (علوم، برمجة، دين، صحة، تعليم، ترفيه، أسئلة عامة...) إجابة صحيحة ومفيدة وواضحة بلغة المستخدم. إذا سأل عن خدمات الشركة أو تطوير المواقع فعرّفه بها واقترح التواصل عبر واتساب +${phone}، ولا تذكر الشركة في الأسئلة التي لا علاقة لها بها.`,
          },
          ...history.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: String(m.text ?? m.content ?? "").slice(0, 4000),
          })),
          { role: "user", content: message },
        ];
        try {
          const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
          });
          const j: any = await r.json();
          const reply = j?.choices?.[0]?.message?.content;
          return Response.json({
            reply: reply || fallback,
            model: reply ? "gemini" : "fallback-engine",
          });
        } catch {
          return Response.json({ reply: fallback, model: "fallback-engine" });
        }
      },
    },
  },
});
