-- AI Concierge Multi-Agent System Database Schema
-- Comprehensive schema for masterclass funnel optimization

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing tables if they exist
DROP TABLE IF EXISTS agent_interactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS interventions CASCADE;
DROP TABLE IF EXISTS masterclass_sessions CASCADE;
DROP TABLE IF EXISTS conversion_events CASCADE;
DROP TABLE IF EXISTS behavioral_analytics CASCADE;
DROP TABLE IF EXISTS challenge_arena CASCADE;
DROP TABLE IF EXISTS ai_twins CASCADE;

-- Core User Profiles with Psychographic Analysis
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    
    -- Demographics
    age_range VARCHAR(20),
    location VARCHAR(100),
    timezone VARCHAR(50),
    
    -- Psychographic Profile (Agent 1)
    psychological_type VARCHAR(50) DEFAULT 'unknown', 
    -- 'curious_explorer', 'pragmatic_upskiller', 'anxious_switcher'
    confidence_score INTEGER DEFAULT 50, -- 0-100
    motivation_type VARCHAR(50), -- 'achievement', 'exploration', 'security'
    communication_style VARCHAR(50), -- 'direct', 'analytical', 'story_driven'
    decision_pattern VARCHAR(50), -- 'quick', 'analytical', 'consensus'
    
    -- Technical Profile
    current_role VARCHAR(100),
    experience_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    tech_stack TEXT[], -- Array of technologies
    target_role VARCHAR(100),
    salary_expectations INTEGER,
    
    -- Behavioral Indicators
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    social_footprint JSONB, -- Analyzed social media data
    
    -- Scoring & Classification
    lead_score INTEGER DEFAULT 0, -- 0-100
    engagement_score INTEGER DEFAULT 0, -- 0-100
    conversion_probability DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
    lifetime_value_prediction INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Masterclass Sessions and Registration
CREATE TABLE masterclass_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(100),
    instructor_bio TEXT,
    
    -- Schedule
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Content & Structure
    topic_category VARCHAR(100), -- 'data_engineering', 'system_design', 'machine_learning'
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    
    -- Registration & Attendance
    max_capacity INTEGER DEFAULT 1000,
    registration_count INTEGER DEFAULT 0,
    attendance_count INTEGER DEFAULT 0,
    
    -- Conversion Metrics
    consultation_bookings INTEGER DEFAULT 0,
    paid_conversions INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed', 'cancelled'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Registrations for Masterclasses
CREATE TABLE masterclass_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Registration Details
    registration_source VARCHAR(100), -- 'website', 'social', 'email', 'referral'
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referral_code VARCHAR(50),
    
    -- Attendance Tracking
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reminder_count INTEGER DEFAULT 0,
    attended BOOLEAN DEFAULT FALSE,
    attendance_duration_minutes INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0, -- Based on chat, polls, etc.
    
    -- Post-Class Actions
    consultation_requested BOOLEAN DEFAULT FALSE,
    consultation_booked_at TIMESTAMP WITH TIME ZONE,
    converted_to_paid BOOLEAN DEFAULT FALSE,
    conversion_amount INTEGER DEFAULT 0,
    
    UNIQUE(user_id, session_id)
);

-- Dynamic Learning Paths (Agent 2)
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Path Configuration
    path_type VARCHAR(50), -- 'pre_class', 'during_class', 'post_class'
    psychological_type VARCHAR(50), -- Target user type
    
    -- Content Modules
    content_modules JSONB, -- Array of personalized content
    estimated_duration_minutes INTEGER,
    completion_percentage DECIMAL(3,2) DEFAULT 0.00,
    
    -- Personalization Data
    personalization_factors JSONB, -- Factors used for customization
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Effectiveness Tracking
    engagement_rate DECIMAL(3,2) DEFAULT 0.00,
    completion_rate DECIMAL(3,2) DEFAULT 0.00,
    satisfaction_score INTEGER DEFAULT 0, -- 1-5
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavioral Interventions (Agent 3)
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Trigger Information
    trigger_event VARCHAR(100), -- 'email_open_no_click', 'page_exit', 'registration_abandon'
    trigger_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trigger_data JSONB, -- Additional context about the trigger
    
    -- Intervention Details
    intervention_type VARCHAR(50), -- 'chatbot', 'email', 'sms', 'whatsapp', 'voice_note'
    channel VARCHAR(50), -- 'web', 'email', 'sms', 'whatsapp'
    message_content TEXT,
    personalization_level VARCHAR(20), -- 'basic', 'moderate', 'high'
    
    -- Delivery & Response
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    response_content TEXT,
    
    -- Effectiveness
    successful BOOLEAN DEFAULT FALSE,
    effectiveness_score INTEGER DEFAULT 0, -- 0-100
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Arena System
CREATE TABLE challenge_arena (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Challenge Details
    challenge_title VARCHAR(255),
    challenge_description TEXT,
    difficulty_level VARCHAR(20),
    estimated_time_minutes INTEGER,
    
    -- Personalization
    generated_from_profile JSONB, -- LinkedIn, form data used
    custom_dataset TEXT, -- If applicable
    tech_stack_used TEXT[],
    
    -- Submission & Scoring
    solution_submitted BOOLEAN DEFAULT FALSE,
    submission_timestamp TIMESTAMP WITH TIME ZONE,
    solution_code TEXT,
    solution_explanation TEXT,
    
    -- Automated Scoring
    correctness_score INTEGER DEFAULT 0, -- 0-100
    efficiency_score INTEGER DEFAULT 0, -- 0-100
    creativity_score INTEGER DEFAULT 0, -- 0-100
    total_score INTEGER DEFAULT 0, -- 0-300
    
    -- Ranking & Gamification
    global_rank INTEGER,
    session_rank INTEGER,
    badge_earned VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- AI Twins (Agent 4)
CREATE TABLE ai_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Twin Generation Data
    profile_data JSONB, -- Scraped/consented profile information
    generation_prompt TEXT,
    twin_characteristics JSONB, -- Generated personality traits
    
    -- Interview Simulation Results
    mock_interviews_completed INTEGER DEFAULT 0,
    average_interview_score DECIMAL(3,2) DEFAULT 0.00,
    strengths_identified TEXT[],
    weaknesses_identified TEXT[],
    improvement_recommendations TEXT[],
    
    -- Personalized Upsell Generation
    recommended_modules TEXT[],
    personalized_pitch TEXT,
    conversion_probability DECIMAL(3,2),
    optimal_pricing INTEGER,
    
    -- Performance Tracking
    accuracy_score DECIMAL(3,2) DEFAULT 0.00, -- How accurate the twin is
    user_satisfaction INTEGER DEFAULT 0, -- 1-5 rating
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Interactions & Orchestration
CREATE TABLE agent_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Agent Information
    agent_name VARCHAR(50), -- 'profiler', 'journey_designer', 'engagement_guardian', 'conversion_catalyst'
    interaction_type VARCHAR(50), -- 'analysis', 'generation', 'intervention', 'optimization'
    
    -- Input & Output
    input_data JSONB,
    output_data JSONB,
    processing_time_ms INTEGER,
    
    -- Success & Error Handling
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    confidence_score DECIMAL(3,2), -- 0.00-1.00
    
    -- Performance Metrics
    accuracy_score DECIMAL(3,2), -- If measurable
    user_response_positive BOOLEAN,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive Analytics & Tracking
CREATE TABLE behavioral_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Event Details
    event_type VARCHAR(100), -- 'page_view', 'click', 'form_submit', 'video_watch', etc.
    event_category VARCHAR(50), -- 'engagement', 'conversion', 'abandonment'
    page_url VARCHAR(500),
    
    -- Behavioral Data
    time_on_page_seconds INTEGER,
    scroll_percentage INTEGER,
    click_coordinates JSONB, -- {x, y} coordinates
    device_info JSONB, -- Device, browser, OS info
    
    -- Session Context
    session_id_web VARCHAR(100), -- Web session ID
    visitor_id VARCHAR(100), -- Anonymous visitor tracking
    ab_test_variant VARCHAR(50),
    
    -- AI Analysis
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    intent_prediction VARCHAR(100),
    drop_off_risk_score DECIMAL(3,2), -- 0.00-1.00
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for analytics queries
    INDEX idx_behavioral_user_session (user_id, session_id),
    INDEX idx_behavioral_event_type (event_type),
    INDEX idx_behavioral_timestamp (timestamp)
);

-- Conversion Events & Revenue Tracking
CREATE TABLE conversion_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES masterclass_sessions(id) ON DELETE CASCADE,
    
    -- Conversion Details
    conversion_type VARCHAR(50), -- 'consultation_booking', 'course_purchase', 'upsell'
    conversion_value INTEGER, -- Revenue in cents
    product_purchased VARCHAR(100),
    
    -- Attribution
    attribution_source VARCHAR(100), -- Which agent/intervention led to conversion
    touchpoint_sequence JSONB, -- Array of touchpoints leading to conversion
    time_to_conversion_hours INTEGER,
    
    -- Context
    conversion_context JSONB, -- Additional context about the conversion
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_psychological_type ON user_profiles(psychological_type);
CREATE INDEX idx_user_profiles_lead_score ON user_profiles(lead_score DESC);
CREATE INDEX idx_masterclass_sessions_date ON masterclass_sessions(scheduled_date);
CREATE INDEX idx_registrations_user_session ON masterclass_registrations(user_id, session_id);
CREATE INDEX idx_interventions_user_trigger ON interventions(user_id, trigger_event);
CREATE INDEX idx_agent_interactions_agent_user ON agent_interactions(agent_name, user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_arena ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (can be expanded based on requirements)
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Anyone can read masterclass sessions" ON masterclass_sessions FOR SELECT USING (true);
CREATE POLICY "Users can read their own registrations" ON masterclass_registrations FOR SELECT USING (auth.uid()::text = user_id::text);

-- Functions for automated scoring and analytics

-- Function to update user engagement score
CREATE OR REPLACE FUNCTION update_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        engagement_score = LEAST(100, (
            SELECT COALESCE(AVG(engagement_score), 0) * 1.1
            FROM masterclass_registrations 
            WHERE user_id = NEW.user_id
        )),
        last_interaction = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate lead scoring
CREATE OR REPLACE FUNCTION calculate_lead_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 0;
    engagement_bonus INTEGER := 0;
    completion_bonus INTEGER := 0;
    interaction_bonus INTEGER := 0;
BEGIN
    -- Base score from profile completeness
    SELECT 
        CASE 
            WHEN email IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN phone IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN linkedin_url IS NOT NULL THEN 15 ELSE 0 END +
        CASE 
            WHEN current_role IS NOT NULL THEN 15 ELSE 0 END +
        CASE 
            WHEN target_role IS NOT NULL THEN 10 ELSE 0 END
    INTO base_score
    FROM user_profiles 
    WHERE id = user_uuid;
    
    -- Engagement bonus
    SELECT COALESCE(engagement_score * 0.3, 0)
    INTO engagement_bonus
    FROM user_profiles 
    WHERE id = user_uuid;
    
    -- Learning path completion bonus
    SELECT COALESCE(AVG(completion_percentage) * 20, 0)
    INTO completion_bonus
    FROM learning_paths 
    WHERE user_id = user_uuid;
    
    -- Positive intervention responses
    SELECT COUNT(*) * 5
    INTO interaction_bonus
    FROM interventions 
    WHERE user_id = user_uuid AND successful = true;
    
    RETURN LEAST(100, base_score + engagement_bonus + completion_bonus + interaction_bonus);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update engagement scores
CREATE TRIGGER update_engagement_on_registration
    AFTER INSERT OR UPDATE ON masterclass_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_engagement_score();

-- Sample Data for Testing

-- Insert sample masterclass sessions
INSERT INTO masterclass_sessions (title, description, instructor_name, scheduled_date, topic_category, difficulty_level) VALUES
('Data Engineering Fundamentals', 'Learn the basics of data engineering with hands-on examples', 'Rahul Sharma', NOW() + INTERVAL '7 days', 'data_engineering', 'beginner'),
('System Design at Scale', 'Master system design principles for large-scale applications', 'Priya Patel', NOW() + INTERVAL '14 days', 'system_design', 'intermediate'),
('ML Pipeline Optimization', 'Optimize your machine learning pipelines for production', 'Amit Kumar', NOW() + INTERVAL '21 days', 'machine_learning', 'advanced');

-- Insert sample user profiles for testing
INSERT INTO user_profiles (email, name, psychological_type, current_role, experience_level, target_role) VALUES
('test1@example.com', 'Curious Explorer User', 'curious_explorer', 'Junior Developer', 'beginner', 'Data Engineer'),
('test2@example.com', 'Pragmatic Upskiller', 'pragmatic_upskiller', 'Software Engineer', 'intermediate', 'Senior Engineer'),
('test3@example.com', 'Anxious Switcher', 'anxious_switcher', 'Business Analyst', 'beginner', 'Data Scientist');
