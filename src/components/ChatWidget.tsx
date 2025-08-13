'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  agentType?: string;
  metadata?: unknown;
}

interface UserProfile {
  name?: string;
  email?: string;
  careerStage?: string;
  techInterest?: string;
  learningStyle?: string;
  psychologicalProfile?: unknown;
}

const ONBOARDING_QUESTIONS = [
  {
    id: 'name',
    question: "Hi! I'm your AI Concierge. What's your name?",
    type: 'text'
  },
  {
    id: 'email', 
    question: "Great to meet you! Could you share your email for personalized follow-ups?",
    type: 'email'
  },
  {
    id: 'careerStage',
    question: "What's your current career stage?",
    type: 'choice',
    options: ['Student', 'Entry Level (0-2 years)', 'Mid Level (3-7 years)', 'Senior (8+ years)', 'Career Change']
  },
  {
    id: 'techInterest',
    question: "Which tech areas interest you most?",
    type: 'multi-choice',
    options: ['Full Stack Development', 'Data Science/AI', 'Cloud/DevOps', 'Mobile Development', 'Cybersecurity', 'Product Management']
  },
  {
    id: 'learningStyle',
    question: "How do you prefer to learn?",
    type: 'choice', 
    options: ['Hands-on projects', 'Structured courses', 'Peer discussions', 'Self-paced reading', 'Video tutorials']
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  } // End of handleOnboardingResponse

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start onboarding
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: ONBOARDING_QUESTIONS[0].question,
        type: 'assistant',
        timestamp: new Date(),
        agentType: 'onboarding'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleOnboardingResponse = async (response: string) => {
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
    
    // Store the response
    const updatedProfile = {
      ...userProfile,
      [currentQuestion.id]: response
    };
    setUserProfile(updatedProfile);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: response,
      type: 'user',
      timestamp: new Date(),
    };
  setMessages((prev: Message[]) => [...prev, userMessage]);

    setIsTyping(true);

    // Move to next question or finish onboarding
    setTimeout(async () => {
      if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        const nextMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: ONBOARDING_QUESTIONS[nextStep].question,
          type: 'assistant',
          timestamp: new Date(),
          agentType: 'onboarding'
        };
        
  setMessages((prev: Message[]) => [...prev, nextMessage]);
      } else {
        // Onboarding complete - start AI agent interaction
        setIsOnboarding(false);
        
        try {
          
          const completionMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Perfect! I've created your personalized profile. Based on your responses, I can see you're ${updatedProfile.careerStage?.toLowerCase()} interested in ${updatedProfile.techInterest}. 

I'm now activating our 4-agent AI system:
🧠 **Profiler**: Analyzing your psychological patterns
🎯 **Journey Designer**: Creating your personalized learning path  
🛡️ **Engagement Guardian**: Monitoring your progress
⚡ **Conversion Catalyst**: Preparing success strategies

What specific career challenge would you like to tackle first?`,
            type: 'assistant',
            timestamp: new Date(),
            agentType: 'profiler'
          };
          
          setMessages((prev: Message[]) => [...prev, completionMessage]);
        } catch (error) {
          console.error('Error initializing agents:', error);
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Thanks for completing the onboarding! I'm ready to help you with your career journey. What would you like to explore first?",
            type: 'assistant',
            timestamp: new Date(),
            agentType: 'fallback'
          };
          
          setMessages((prev: Message[]) => [...prev, errorMessage]);
        }
      }
      setIsTyping(false);
    })
  };

  const handleAgentInteraction = async (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      type: 'user',
      timestamp: new Date(),
    };

  setMessages((prev: Message[]) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call the actual API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          sessionId: sessionId,
          leadId: sessionId,
          userProfile: userProfile,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || "I'm here to help with your career development!",
        type: 'assistant',
        timestamp: new Date(),
        agentType: data.primaryAgent || 'profiler',
        metadata: {
          confidence: data.confidence,
          triggers: data.triggers,
          recommendations: data.recommendations
        }
      };

  setMessages((prev: Message[]) => [...prev, assistantMessage]);

      // Handle any triggers or recommendations
      if (data.triggers && data.triggers.length > 0) {
        console.log('Triggered actions:', data.triggers);
      }

    } catch (error) {
      console.error('Agent interaction error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Let me try to help anyway! What specific career goal are you working toward?",
        type: 'assistant',
        timestamp: new Date(),
        agentType: 'error'
      };
      
  setMessages((prev: Message[]) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (isOnboarding) {
      await handleOnboardingResponse(inputValue);
    } else {
      await handleAgentInteraction(inputValue);
    }

    setInputValue('');
  };

  const handleOptionClick = async (option: string) => {
    if (isOnboarding) {
      await handleOnboardingResponse(option);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentIcon = (agentType?: string) => {
    switch (agentType) {
      case 'profiler': return '🧠';
      case 'journey': return '🎯';
      case 'engagement': return '🛡️';
      case 'conversion': return '⚡';
      case 'onboarding': return '👋';
      case 'system': return '🎯';
      default: return '🤖';
    }
  };

  const getAgentName = (agentType?: string) => {
    switch (agentType) {
      case 'profiler': return 'Profiler Agent';
      case 'journey': return 'Journey Designer';
      case 'engagement': return 'Engagement Guardian';
      case 'conversion': return 'Conversion Catalyst';
      case 'onboarding': return 'AI Concierge';
      case 'system': return 'System';
      default: return 'AI Concierge';
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        data-chat-trigger
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Concierge</h3>
                  <p className="text-xs opacity-80">
                    {isOnboarding ? 'Getting to know you...' : '4 Agents • Always Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-xs opacity-80">Live</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
              {messages.map((message: Message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.type === 'assistant' ? 'flex items-start space-x-2' : ''}`}>
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                        {getAgentIcon(message.agentType)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      {message.type === 'assistant' && message.agentType && (
                        <div className="text-xs text-purple-600 font-medium mb-1">
                          {getAgentName(message.agentType)}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-purple-100 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Show options for onboarding questions */}
              {isOnboarding && currentStep < ONBOARDING_QUESTIONS.length && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] flex flex-col space-y-2">
                    {ONBOARDING_QUESTIONS[currentStep].options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="p-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-colors text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                      🤖
                    </div>
                    <div className="bg-white border border-purple-100 p-3 rounded-lg shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-100 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isOnboarding 
                      ? "Type your answer..." 
                      : "Ask about career growth, skills, opportunities..."
                  }
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800 placeholder-gray-500 bg-white"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              
              {!isOnboarding && (
                <div className="flex items-center justify-center mt-2 text-xs text-purple-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>4 AI Agents Active</span>
                    </span>
                    <span>•</span>
                    <span>Powered by Google Gemini AI</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
