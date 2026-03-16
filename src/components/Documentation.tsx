import React from 'react';
import { FileText, Target, Layers, Database, Cpu, Workflow, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Documentation() {
  const sections = [
    {
      id: 'aim',
      title: '1. Aim',
      icon: Target,
      content: 'To develop a comprehensive Agricultural Decision Support System (DSS) that assists farmers in making data-driven decisions regarding crop selection, soil management, and market timing to maximize productivity and profitability.'
    },
    {
      id: 'objective',
      title: '2. Objective',
      icon: CheckCircle,
      content: [
        'Analyze soil health parameters (pH, NPK) to recommend suitable crops.',
        'Integrate real-time weather and market data for risk assessment.',
        'Provide AI-driven insights for yield optimization.',
        'Create a user-friendly interface for non-technical users in rural areas.'
      ]
    },
    {
      id: 'description',
      title: '3. System Description',
      icon: Info,
      content: 'AgriDecision DSS is a full-stack web application that acts as a digital consultant for farmers. It processes soil test results through a specialized algorithm (enhanced by Gemini AI) to match soil profiles with crop requirements. The system also monitors market trends to provide financial forecasting.'
    },
    {
      id: 'requirements',
      title: '4. Functional Requirements',
      icon: Layers,
      content: [
        'User Authentication: Secure login via Google.',
        'Soil Data Management: Input and storage of soil test results.',
        'AI Recommendation Engine: Processing soil/weather data for crop suggestions.',
        'Market Dashboard: Visualization of price trends using Recharts.',
        'Responsive Design: Accessible on mobile devices in the field.'
      ]
    },
    {
      id: 'modules',
      title: '5. Modules',
      icon: Workflow,
      content: [
        'Authentication Module: Handles user sessions.',
        'Analysis Module: The core logic for crop-soil matching.',
        'Market Module: Fetches and displays economic data.',
        'Reporting Module: Generates summaries and documentation.'
      ]
    },
    {
      id: 'database',
      title: '6. Dataset/Database Description',
      icon: Database,
      content: 'The system uses Firebase Firestore (NoSQL). Key collections include: "crops" (master data), "soil_analyses" (user records), and "market_prices" (time-series price data).'
    },
    {
      id: 'tools',
      title: '7. Tools and Techniques',
      icon: Cpu,
      content: 'React 19 for UI, Tailwind CSS for styling, Firebase for backend/auth, Gemini AI for recommendation logic, and Recharts for data visualization.'
    },
    {
      id: 'stack',
      title: '8. Technology Stack',
      icon: Layers,
      content: 'Frontend: React, TypeScript, Tailwind. Backend: Firebase Firestore, Firebase Auth. AI: Google Gemini API. Deployment: Cloud Run.'
    },
    {
      id: 'flow',
      title: '9. System Flow',
      icon: Workflow,
      content: [
        'User logs in via Google OAuth.',
        'Farmer enters soil test data (pH, NPK, Moisture).',
        'System sends data to Gemini AI for analysis.',
        'AI processes data against crop database and weather patterns.',
        'Dashboard displays personalized crop recommendations and market trends.',
        'User makes informed decision on planting and sales.'
      ]
    },
    {
      id: 'challenges',
      title: '10. Final Output & Challenges',
      icon: AlertTriangle,
      content: 'The final output is a functional DSS prototype. Challenges include: Ensuring data accuracy from low-cost soil sensors, handling offline scenarios in remote areas, and localizing AI recommendations for regional crop varieties.'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-3xl font-serif font-medium text-stone-900">System Documentation</h2>
        <p className="text-stone-500 mt-1">Formal project report for AgriDecision DSS.</p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.id} className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-stone-900">{section.title}</h3>
            </div>
            
            {Array.isArray(section.content) ? (
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-stone-600 leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-600 leading-relaxed text-lg">
                {section.content}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
