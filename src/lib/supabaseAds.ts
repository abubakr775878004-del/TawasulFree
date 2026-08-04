import type { Advertisement } from '@/types';
// عميل Supabase موحّد — لم يعد يُنشأ هنا لتفادي وجود نسختين متعارضتين
// من GoTrueClient بنفس التطبيق (كان يسبب تضارب بجلسات المصادقة)
import { supabase } from '@/supabaseClient';

export async function fetchAdsFromDB(): Promise<Advertisement[]> {
  const { data, error } = await supabase.from('advertisements').select('*');
  if (error) {
    console.error('Error fetching ads:', error.message);
    return [];
  }
  return data as Advertisement[];
}

export async function saveAdToDB(ad: Advertisement) {
  const { error } = await supabase.from('advertisements').upsert({
    id: ad.id,
    name: ad.name,
    network: ad.network,
    type: ad.type,
    location: ad.location,
    code: ad.code,
    link: ad.link,
    is_active: ad.isActive,
    impressions: ad.impressions,
    clicks: ad.clicks,
    reward_points: ad.rewardPoints,
  });

  if (error) {
    console.error('Error saving ad:', error.message);
    throw error;
  }
}

export async function deleteAdFromDB(id: string) {
  const { error } = await supabase.from('advertisements').delete().eq('id', id);
  if (error) {
    console.error('Error deleting ad:', error.message);
    throw error;
  }
}
