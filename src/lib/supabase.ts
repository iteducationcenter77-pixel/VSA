import { createClient, SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const defaultAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('vectora_supabase_url') || defaultUrl;
    const customKey = localStorage.getItem('vectora_supabase_anon_key') || defaultAnonKey;
    if (customUrl && customKey && customUrl.startsWith('http')) {
      try {
        if (!supabaseInstance) {
          supabaseInstance = createClient(customUrl, customKey);
        }
        return supabaseInstance;
      } catch {
        return null;
      }
    }
  }
  if (defaultUrl && defaultAnonKey && defaultUrl.startsWith('http')) {
    if (!supabaseInstance) {
      supabaseInstance = createClient(defaultUrl, defaultAnonKey);
    }
    return supabaseInstance;
  }
  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vectora_supabase_url', url);
    localStorage.setItem('vectora_supabase_anon_key', anonKey);
    supabaseInstance = createClient(url, anonKey);
  }
}

export function getSupabaseConfig(): { url: string; key: string } {
  if (typeof window !== 'undefined') {
    return {
      url: localStorage.getItem('vectora_supabase_url') || defaultUrl,
      key: localStorage.getItem('vectora_supabase_anon_key') || defaultAnonKey,
    };
  }
  return { url: defaultUrl, key: defaultAnonKey };
}
