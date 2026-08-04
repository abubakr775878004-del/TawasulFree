import { supabase } from './supabaseClient';
import { storage } from '@/lib/storage';
import type { User } from '@/types';

// يحوّل صف قاعدة البيانات (snake_case) إلى شكل User المستخدم بالواجهة (camelCase)
function mapDbUserToUser(row: any, pointsOverride?: number): User {
  return {
    id: row.id,
    fullName: row.full_name,
    points: pointsOverride ?? row.points,
    gamesPlayed: row.games_played ?? 0,
    competitionsWon: row.competitions_won ?? 0,
    rank: row.rank ?? 999,
    joinedAt: row.created_at ?? row.points_updated_at ?? new Date().toISOString(),
    weeklyPoints: pointsOverride ?? row.points,
  };
}

// 🟢 1. دالة تسجيل الدخول وإنشاء الحساب مع منع تكرار الأسماء والتصفير الأسبوعي للنقاط
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

  // إذا كان الاسم مسجلاً سابقاً (مستخدم حالي)
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

    const mappedUser = mapDbUserToUser(existingUser, currentPoints);
    storage.saveUser(mappedUser); // مصدر واحد فقط للمستخدم الحالي بالتطبيق (تزامن appStore)

    return {
      success: true,
      user: mappedUser,
      message: 'أهلاً بك مجدداً!'
    };
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

  const mappedNewUser = mapDbUserToUser(newUser);
  storage.saveUser(mappedNewUser);

  return { success: true, user: mappedNewUser, message: 'تم إنشاء الحساب بنجاح!' };
}

// 🗑️ 2. دالة حذف حساب المستخدم نهائياً من قاعدة البيانات والمتصفح
export async function deleteUserAccount(): Promise<{ success: boolean; message: string }> {
  // المصدر الوحيد الآن لهوية المستخدم الحالي هو storage (بدل مفتاح منفصل كان يُنسى ضبطه)
  const currentUser = storage.getUser();
  const userId = currentUser?.id;

  if (!userId) {
    return { success: false, message: 'لم يتم العثور على حساب مسجل في المتصفح!' };
  }

  try {
    // حذف البيانات نهائياً من قاعدة بيانات Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'حدث خطأ أثناء حذف الحساب، حاول لاحقاً.' };
    }

    // تفريغ وتطهير بيانات الجلسة من التخزين المحلي للمتصفح
    storage.clearUser();
    localStorage.removeItem('last_weekly_reset');

    return { success: true, message: 'تم حذف حسابك وإزالة اسمك نهائياً بنجاح.' };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, message: 'حدث خطأ غير متوقع أثناء الحذف!' };
  }
}
