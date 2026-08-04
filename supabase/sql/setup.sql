-- ============================================================
-- 1) جدول الأدمن — يربط حساب Supabase Auth حقيقي بصلاحية الإدارة
-- ============================================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

create policy "admin يقرأ صفه فقط"
  on public.admins for select
  using (auth.uid() = id);

-- دالة مساعدة: هل المستخدم الحالي أدمن؟
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ============================================================
-- 2) تفعيل الحماية (RLS) على جدول الإعلانات — كان مفتوح بالكامل
-- ============================================================
alter table public.advertisements enable row level security;

create policy "الكل يقدر يقرأ الإعلانات"
  on public.advertisements for select
  using (true);

create policy "الأدمن فقط يضيف إعلان"
  on public.advertisements for insert
  with check (public.is_admin());

create policy "الأدمن فقط يعدّل إعلان"
  on public.advertisements for update
  using (public.is_admin());

create policy "الأدمن فقط يحذف إعلان"
  on public.advertisements for delete
  using (public.is_admin());

-- ============================================================
-- 3) تفعيل الحماية الأساسية على جدول المستخدمين
--    ⚠️ ملاحظة: الحذف/التعديل هنا يبقى مفتوح لأن نظام المستخدمين
--    الحالي لا يستخدم Supabase Auth حقيقي لكل زائر (فقط الأدمن).
--    لإغلاق هذه الثغرة بالكامل يلزم تفعيل Anonymous Auth — راجع الشرح المرفق.
-- ============================================================
alter table public.users enable row level security;

create policy "الكل يقدر يقرأ المستخدمين (لوحة المتصدرين)"
  on public.users for select
  using (true);

create policy "الكل يقدر يسجل حساب جديد"
  on public.users for insert
  with check (true);

-- الأدمن فقط يقدر يحذف أي مستخدم من لوحة التحكم
create policy "الأدمن يحذف أي مستخدم"
  on public.users for delete
  using (public.is_admin());

-- تحديث النقاط يبقى مؤقتاً مفتوح (يحتاج Anonymous Auth لإغلاقه بأمان كامل)
create policy "تحديث بيانات المستخدم (مؤقت)"
  on public.users for update
  using (true);

-- ============================================================
-- بعد تشغيل هذا الملف:
-- 1. سجّل حساب أدمن حقيقي من Supabase Dashboard > Authentication > Add User
--    (بريد إلكتروني + كلمة مرور قوية)
-- 2. خذ الـ UUID تبعه من نفس الصفحة، ونفّذ:
--    insert into public.admins (id) values ('UUID-تبع-الحساب-هنا');
-- ============================================================
