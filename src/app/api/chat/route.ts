import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agent-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, leadId, userProfile, conversationHistory } = body;

    console.log('=== CHAT API CALLED ===');
    console.log('Message:', message);
    console.log('User Profile:', userProfile);
    console.log('Session ID:', sessionId);

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get orchestrator instance
    const orchestrator = getOrchestrator();
    
    // Prepare context for the orchestrator
    const context = {
      userId: leadId || sessionId || 'anonymous',
      profile: userProfile || {},
      conversationHistory: conversationHistory || [],
      sessionMetadata: {
        sessionId,
        leadId,
        timestamp: new Date().toISOString(),
        platform: 'web_chat'
      }
    };

    // Process the message through our multi-agent system with Gemini AI
    let response;
    
    try {
      console.log('Calling orchestrator...');
      // Use the orchestrator with Gemini AI integration
      response = await orchestrator.processUserInput(message, context);
      console.log('Orchestrator response:', response);
      
    } catch (orchestratorError) {
      console.error('Orchestrator error:', orchestratorError);
      
      // Fallback to basic response
      response = {
        response: "I'm here to help with your career development! Could you tell me more about what specific area you'd like to focus on?",
        primaryAgent: 'profiler',
        confidence: 0.7,
        triggers: [],
        recommendations: []
      };
    }

    // Log the interaction for analytics
    try {
      console.log('Chat interaction:', {
        sessionId,
        leadId,
        message: message.substring(0, 100),
        response: response.response.substring(0, 100),
        agent: response.primaryAgent,
        timestamp: new Date().toISOString()
      });
    } catch (loggingError) {
      console.error('Logging error:', loggingError);
    }

    return NextResponse.json({
      message: response.response,
      response: response.response, // For backward compatibility
      agent: response.primaryAgent,
      primaryAgent: response.primaryAgent,
      confidence: response.confidence,
      triggers: response.triggers,
      recommendations: response.recommendations,
      sessionId: sessionId || 'anonymous',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: "I'm experiencing technical difficulties. Let me help you anyway! What career goal are you working toward?",
        response: "I'm experiencing technical difficulties. Let me help you anyway! What career goal are you working toward?",
        agent: 'fallback',
        primaryAgent: 'fallback',
        confidence: 0.5,
        triggers: [],
        recommendations: [],
        sessionId: 'error-session',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Chat API with Gemini AI is ready!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
}
