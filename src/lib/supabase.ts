import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  career_goals?: string;
  pain_points?: string[];
  score: number;
  stage: 'new' | 'engaged' | 'qualified' | 'nurturing' | 'converted' | 'lost';
  source?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  created_at: string;
  updated_at: string;
  last_interaction_at: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  session_id: string;
  message: string;
  sender: 'user' | 'bot';
  intent?: string;
  sentiment?: string;
  confidence_score?: number;
  response_time_ms?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  session_id: string;
  lead_id?: string;
  status: 'active' | 'ended' | 'transferred';
  started_at: string;
  ended_at?: string;
  total_messages: number;
  user_satisfaction?: number;
  metadata?: Record<string, unknown>;
}

export interface ConversionEvent {
  id: string;
  lead_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  value?: number;
  timestamp: string;
}
