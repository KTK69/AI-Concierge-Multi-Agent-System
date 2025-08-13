// AI Concierge - Agent Orchestrator with Gemini AI
// Entry point for the multi-agent system

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  careerStage?: string;
  techStack?: string[];
  techInterest?: string;
  experience?: string;
  goals?: string[];
  psychologicalProfile?: any;
  engagementHistory?: any[];
  conversionEvents?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationContext {
  userId: string;
  sessionId?: string;
  profile?: UserProfile;
  conversationHistory?: any[];
  sessionMetadata?: any;
}

export interface AgentResponse {
  response: string;
  primaryAgent: string;
  confidence: number;
  triggers: any[];
  recommendations: any[];
  metadata?: any;
}

// Agent Orchestrator with Gemini AI
export class AgentOrchestrator {
  private supabase: any;
  private gemini: GoogleGenerativeAI;

  constructor() {
    // Initialize Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Initialize Gemini AI
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async processUserInput(input: string, context: ConversationContext): Promise<AgentResponse> {
    try {
      console.log('Processing input:', input);
      console.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);
      
      // Simple agent selection based on keywords
      const agent = this.selectAgent(input);
      console.log('Selected agent:', agent);
      
      // Generate response using Gemini
      const model = this.gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = this.buildPrompt(agent, input, context);
      console.log('Generated prompt:', prompt.substring(0, 200) + '...');
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      console.log('Gemini response received:', response.substring(0, 100) + '...');
      
      return {
        response: response,
        primaryAgent: agent,
        confidence: 0.85,
        triggers: [],
        recommendations: []
      };
    } catch (error) {
      console.error('Error in orchestrator:', error);
      console.error('Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack?.substring(0, 500)
      });
      
      return {
        response: "I'm here to help with your career development! What specific area would you like to focus on?",
        primaryAgent: 'fallback',
        confidence: 0.5,
        triggers: [],
        recommendations: []
      };
    }
  }

  private selectAgent(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('profile') || lowerInput.includes('about') || lowerInput.includes('personality') || lowerInput.includes('assessment')) {
      return 'profiler';
    } else if (lowerInput.includes('learn') || lowerInput.includes('course') || lowerInput.includes('roadmap') || lowerInput.includes('path')) {
      return 'journey';
    } else if (lowerInput.includes('stuck') || lowerInput.includes('help') || lowerInput.includes('motivation') || lowerInput.includes('support')) {
      return 'engagement';
    } else if (lowerInput.includes('job') || lowerInput.includes('interview') || lowerInput.includes('career') || lowerInput.includes('salary') || lowerInput.includes('switch')) {
      return 'conversion';
    } else {
      return 'profiler'; // Default to profiler
    }
  }

  private buildPrompt(agent: string, input: string, context: ConversationContext): string {
    const profile = context.profile || {};
    
    const baseContext = `You are an AI Concierge for Scaler Academy, helping professionals advance their tech careers. 
User Profile: ${profile.careerStage || 'Unknown'} level, interested in ${profile.techInterest || 'technology'}.
Current Agent: ${agent}

User Input: "${input}"

As the ${agent} agent, provide a helpful, personalized response that:
1. Addresses their specific question
2. Shows you understand their career stage and interests
3. Offers actionable next steps
4. Maintains an encouraging, professional tone
5. Relates to Scaler Academy's offerings when relevant

Keep responses concise but valuable (2-3 sentences max).`;

    switch (agent) {
      case 'profiler':
        return baseContext + `
Focus on understanding their psychological profile, learning style, and career motivations.`;
      
      case 'journey':
        return baseContext + `
Focus on creating personalized learning paths and skill development recommendations.`;
      
      case 'engagement':
        return baseContext + `
Focus on motivation, overcoming challenges, and maintaining momentum in their learning journey.`;
      
      case 'conversion':
        return baseContext + `
Focus on career advancement, interview preparation, and strategic career moves.`;
      
      default:
        return baseContext;
    }
  }
}

// Export singleton instance
let orchestratorInstance: AgentOrchestrator | null = null;

export function getOrchestrator(): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator();
  }
  return orchestratorInstance;
}
