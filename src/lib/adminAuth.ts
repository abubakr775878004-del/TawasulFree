import { supabase } from '@/supabaseClient';

// تسجيل دخول الأدمن الحقيقي عبر Supabase Auth (بريد + كلمة مرور)
// بدل مقارنة كلمة مرور ثابتة داخل كود المتصفح
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return { success: false, message: 'البريد أو كلمة المرور غير صحيحة' };
  }

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { success: false, message: 'هذا الحساب لا يملك صلاحية الوصول للوحة الإدارة' };
  }

  return { success: true, message: 'تم تسجيل الدخول بنجاح' };
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

// يتحقق من جدول admins في قاعدة البيانات — وليس من قيمة محفوظة بالمتصفح
export async function checkIsAdmin(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
