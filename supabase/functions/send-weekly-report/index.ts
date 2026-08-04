// Supabase Edge Function — يعمل على السيرفر فقط
// التوكن هنا يُقرأ من Supabase Secrets (Deno.env) ولا يظهر أبداً للمتصفح
//
// نشر الدالة: supabase functions deploy send-weekly-report
// ضبط الأسرار مرة واحدة:
//   supabase secrets set TELEGRAM_BOT_TOKEN=xxxxx
//   supabase secrets set TELEGRAM_CHAT_ID=xxxxx

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({ error: "Telegram secrets not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const message =
      "🏆 *تقرير الجمعة الآلي: أبطال أسبوع شبكة TawasulNet* 🏆\n\n" +
      "تم تصفير العدادات، وبدأت منافسة أسبوع جديد كلياً! بالتوفيق للجميع 🚀";

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
      }
    );

    if (!tgResponse.ok) {
      const errText = await tgResponse.text();
      throw new Error(`Telegram API error: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
