import { createClient } from '@supabase/supabase-js';
import type { Advertisement } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
