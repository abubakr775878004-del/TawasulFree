# إعداد Cloudflare Pages

## متغيرات البيئة المطلوبة (Settings → Environment variables)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

لا تضف توكن تيليجرام هنا أبداً — هو الآن Secret داخل Supabase Edge Function فقط.

## إعدادات البناء
Build command: npm run build
Build output directory: dist

## بعد كل تعديل
git push إلى الفرع المربوط بالمشروع في Cloudflare Pages لإعادة النشر تلقائياً.

## خطوات Supabase (مرة واحدة)
1. شغّل supabase/sql/setup.sql من SQL Editor.
2. أنشئ حساب أدمن من Authentication → Add User.
3. نفّذ: insert into public.admins (id) values ('UUID-الحساب');
4. supabase functions deploy send-weekly-report
5. supabase secrets set TELEGRAM_BOT_TOKEN=...
6. supabase secrets set TELEGRAM_CHAT_ID=...
