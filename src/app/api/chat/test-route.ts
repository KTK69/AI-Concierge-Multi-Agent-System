import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log('Received message:', message);

    // Simple test response
    const responses = [
      "That's interesting! Tell me more about your goals.",
      "I'd be happy to help you with that. What specific area interests you most?",
      "Great question! Based on your interest, I recommend focusing on practical projects.",
      "Let's explore that together. What's your current experience level?",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
      message: randomResponse,
      agent: 'test-agent',
      confidence: 0.9,
      triggers: [],
      recommendations: [],
      sessionId: 'test-session',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: "I'm having trouble right now. Please try again!"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Chat API is working!' });
}
