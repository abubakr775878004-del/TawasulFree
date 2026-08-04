import { supabase } from './supabaseClient';

export async function handleUserLogin(fullName: string) {
  const cleanName = fullName.trim();
  if (!cleanName) return { success: false, message: 'يرجى إدخال الاسم الثلاثي كاملاً' };

  // البحث عن الاسم في قاعدة البيانات
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('full_name', cleanName)
    .maybeSingle();

  const now = new Date();

  // إذا كان الاسم مسجلاً سابقاً
  if (existingUser) {
    const lastUpdate = new Date(existingUser.points_updated_at);
    const diffInDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);

    let currentPoints = existingUser.points;

    // تصفير النقاط تلقائياً بعد مرور 7 أيام
    if (diffInDays >= 7) {
      currentPoints = 0;
      await supabase
        .from('users')
        .update({ points: 0, points_updated_at: now.toISOString() })
        .eq('id', existingUser.id);
    }

    localStorage.setItem('tawasul_user_id', existingUser.id);
    localStorage.setItem('tawasul_user_name', existingUser.full_name);

    return { success: true, user: { ...existingUser, points: currentPoints }, message: 'أهلاً بك مجدداً!' };
  }

  // إذا كان تسجيلاً لاسم جديد
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{ full_name: cleanName, points: 0, points_updated_at: now.toISOString() }])
    .select()
    .single();

  if (error) {
    return { success: false, message: 'عذراً، هذا الاسم الثلاثي محجوز لمستخدم آخر!' };
  }

  localStorage.setItem('tawasul_user_id', newUser.id);
  localStorage.setItem('tawasul_user_name', newUser.full_name);

  return { success: true, user: newUser, message: 'تم إنشاء الحساب بنجاح!' };
}
