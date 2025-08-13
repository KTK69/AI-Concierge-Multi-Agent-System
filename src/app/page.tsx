'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChatWidget } from '@/components/ChatWidget';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: 'Psychographic Profiler',
    description: 'AI analyzes your behavior beyond demographics to create deep psychological profiles for hyper-personalized experiences.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: 'Dynamic Journey Designer',
    description: 'Builds personalized micro-learning paths in real-time based on your psychological type and learning style.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: 'Engagement Guardian',
    description: 'Prevents drop-offs before they happen with behavior-triggered interventions and real-time engagement monitoring.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
    title: 'Conversion Catalyst',
    description: 'Creates AI twins for interview simulation and generates hyper-personalized conversion strategies post-class.'
  }
];

const stats = [
  { value: '40% → 72%', label: 'Attendance Rate Increase' },
  { value: '5x', label: 'More Consultation Bookings' },
  { value: '28%', label: 'Post-Class Conversion Rate' },
  { value: '95%', label: 'User Satisfaction Score' }
];

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleGetStarted = () => {
    // Scroll to chat widget or open it
    const chatElement = document.querySelector('[data-chat-widget]');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
      // Trigger chat widget open if it has an open method
      const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
      if (chatButton) {
        chatButton.click();
      }
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">AI Concierge</span>
              <div className="text-sm text-purple-200">Scaler Masterclass System</div>
            </div>
          </div>
          <button 
            onClick={handleGetStarted}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Experience Demo
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-800/50 rounded-full text-purple-200 text-sm mb-6">
            <span className="mr-2">🚀</span>
            Hyper-Personalized Multi-Agent Funnel
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              AI Concierge
            </span>
            <br />
            <span className="text-white text-4xl md:text-5xl">
              For Masterclass Success
            </span>
          </h1>
          
          <p className="text-xl text-purple-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Replace linear funnels with adaptive AI ecosystems. Four specialized AI agents powered by 
            <span className="font-bold text-green-300"> Google Gemini</span> work in concert to 
            <span className="font-bold text-pink-300"> triple your attendance rates</span> and 
            <span className="font-bold text-purple-300"> 5x your conversions</span> through 
            psychological profiling, dynamic journeys, and predictive interventions.
          </p>

          {/* How It Works - Brief Overview */}
          <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/30 mb-12 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">How the AI Concierge Transforms Your Funnel</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <div className="text-white font-semibold mb-2">1. Profile</div>
                <div className="text-purple-200 text-sm">Analyzes psychology, LinkedIn data, and behavior patterns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-white font-semibold mb-2">2. Personalize</div>
                <div className="text-purple-200 text-sm">Creates custom challenges, avatars, and learning paths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-white font-semibold mb-2">3. Engage</div>
                <div className="text-purple-200 text-sm">Monitors in real-time and prevents drop-offs predictively</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-semibold mb-2">4. Convert</div>
                <div className="text-purple-200 text-sm">AI twin interviews and hyper-personalized upsells</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-700/30 rounded-full text-green-300 text-sm">
                <span className="mr-2">✨</span>
                Powered by Google Gemini AI - Real psychological profiling, not just keywords
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 text-lg"
            >
              <span>Start Your AI Journey</span>
              <div className="h-5 w-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-purple-300 mb-2">{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4-Agent System */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The 4-Agent AI System
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Each agent specializes in a different aspect of the user journey, working together to create 
            a seamless, personalized experience that adapts in real-time using <span className="font-bold text-green-300">Google Gemini AI</span>.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="h-12 w-12 text-purple-400 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-black/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            100% Open Source Tech Stack
          </h2>
          <p className="text-xl text-purple-200 mb-12">
            Built with cutting-edge, cost-effective technologies powered by <span className="font-bold text-green-300">Google Gemini AI</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {['Google Gemini', 'Supabase', 'Next.js', 'Twilio', 'PostHog', 'TypeScript'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-800/20 to-blue-800/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <div className="text-white font-semibold text-sm">{tech}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features In Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real-Time AI Intelligence
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Unlike static funnels, our AI Concierge adapts to each user's unique psychological profile and behavior patterns in real-time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Beyond Demographics</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🧠</span>
                </div>
                <div>
                  <div className="text-white font-semibold mb-2">Psychological Profiling</div>
                  <div className="text-purple-200 text-sm">Analyzes motivation type, learning style, risk tolerance, and communication preferences from LinkedIn activity and registration data.</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <div className="text-white font-semibold mb-2">Predictive Interventions</div>
                  <div className="text-purple-200 text-sm">Predicts drop-off risk and triggers personalized interventions 48-72 hours before typical abandonment points.</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div>
                  <div className="text-white font-semibold mb-2">Adaptive Content Generation</div>
                  <div className="text-purple-200 text-sm">Google Gemini generates challenges, avatars, and conversation flows tailored to individual psychological profiles.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-800/20 to-blue-800/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <div className="text-purple-300 text-sm mb-4">Live Example: Psychological Profile</div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Type:</span>
                <span className="text-green-300">Pragmatic Upskiller</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Learning Style:</span>
                <span className="text-blue-300">Hands-on Projects</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Risk Tolerance:</span>
                <span className="text-yellow-300">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Drop-off Risk:</span>
                <span className="text-green-300">Low (12%)</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
              <div className="text-green-300 text-sm">
                ✓ Personalized React challenge generated<br/>
                ✓ WhatsApp reminder scheduled for optimal time<br/>
                ✓ Peer match found with 87% compatibility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-800 to-pink-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Masterclass Success?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
            Join thousands of professionals who've accelerated their careers with our AI Concierge system. 
            Experience the power of hyper-personalized learning paths and predictive engagement powered by Google Gemini AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors text-lg"
            >
              Start AI Concierge Demo
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span>Free demo access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span>Live AI agents available now</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <span className="text-2xl font-bold text-white">AI Concierge</span>
          </div>
          <p className="text-purple-300 text-sm mb-4">
            Transforming masterclass attendance and career acceleration through AI-powered personalization
          </p>
          <div className="flex justify-center space-x-6 text-sm text-purple-400">
            <span>Powered by Google Gemini AI</span>
            <span>•</span>
            <span>Built for Scaler Academy</span>
            <span>•</span>
            <span>Open Source Stack</span>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div data-chat-widget>
        <ChatWidget />
      </div>
    </div>
  );
}