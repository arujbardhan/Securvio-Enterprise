
import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, FRAMEWORKS, CommandIcon, SecurvioBranding } from './constants';
import { Message, Conversation } from './types';
import { gemini } from './services/geminiService';

const SUGGESTIONS = [
  { title: "Perform HIPAA 2026 Audit", tag: "Healthcare", prompt: "Perform a comprehensive HIPAA 2026 readiness audit for a mid-sized healthcare provider. Focus on patient data portability and encryption mandates." },
  { title: "Review U.S. Federal Cyber Laws", tag: "Legal", prompt: "Provide an executive summary of the CFAA, ECPA, and FISMA. How do these federal laws govern unauthorized data access and storage?" },
  { title: "Generate SOC 2 Control Map", tag: "Compliance", prompt: "Generate a mapping of SOC 2 Trust Services Criteria to technical controls in an AWS environment." },
  { title: "Draft AI Ethics Policy", tag: "Governance", prompt: "Draft a high-level AI Ethics and Governance policy for an enterprise implementing LLMs in internal operations." }
];

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Authorized Node: Active');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const isLandingState = !activeConversation || activeConversation.messages.length <= 1;

  // Fix: Defined createNewChat to resolve reference error
  const createNewChat = () => {
    const newChat: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Advisory Session',
      messages: [{
        id: crypto.randomUUID(),
        role: 'system',
        content: 'System Initialized. Awaiting regulatory query.',
        timestamp: new Date()
      }],
      updatedAt: new Date()
    };
    setConversations(prev => [newChat, ...prev]);
    setActiveConversationId(newChat.id);
  };

  useEffect(() => {
    if (conversations.length === 0) createNewChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading || !activeConversationId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setInput('');
    setIsLoading(true);
    setStatusMessage('Querying Legal & Compliance Vaults...');

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId 
        ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date() }
        : c
    ));

    try {
      let assistantResponse = '';
      const assistantMessageId = crypto.randomUUID();
      
      // Initialize assistant placeholder
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
          ? { 
              ...c, 
              messages: [
                ...c.messages, 
                { id: assistantMessageId, role: 'assistant', content: '', timestamp: new Date() }
              ] 
            }
          : c
      ));

      // Handle streaming response from Gemini
      const stream = gemini.sendMessageStream(textToSend);
      for await (const chunk of stream) {
        assistantResponse += chunk;
        setConversations(prev => prev.map(c => 
          c.id === activeConversationId 
            ? {
                ...c,
                messages: c.messages.map(m => 
                  m.id === assistantMessageId ? { ...m, content: assistantResponse } : m
                )
              }
            : c
        ));
      }
    } catch (error) {
      console.error("Transmission Error:", error);
    } finally {
      setIsLoading(false);
      setStatusMessage('Authorized Node: Active');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-white/5 bg-[#0f1115] overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-white/5">
          <SecurvioBranding />
        </div>
        
        <button 
          onClick={createNewChat}
          className="m-4 p-4 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl flex items-center justify-between group transition-all"
        >
          <span className="text-sm font-medium text-blue-400">New Protocol</span>
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-blue-400 font-bold">+</span>
          </div>
        </button>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-4">Active Sessions</div>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all truncate border ${
                activeConversationId === conv.id 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                  : 'border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] tracking-tight font-mono text-emerald-500 uppercase">{statusMessage}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="w-5 h-0.5 bg-slate-400 mb-1"></div>
              <div className="w-5 h-0.5 bg-slate-400 mb-1"></div>
              <div className="w-5 h-0.5 bg-slate-400"></div>
            </button>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <h2 className="text-sm font-medium text-slate-400">
              {activeConversation?.title || 'System Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono tracking-tighter">ENCRYPTION:</span>
              <span className="text-[10px] text-blue-400 font-mono tracking-tighter">AES-256-GCM</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <CommandIcon />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
          {isLandingState ? (
            <div className="max-w-4xl mx-auto pt-24 px-8">
              <div className="mb-12">
                <h1 className="text-4xl font-light text-white mb-4 tracking-tight">
                  Welcome to <span className="text-blue-500 font-normal">Securvio Enterprise</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                  Regulatory intelligence layer for HIPAA, SOC 2, and Federal Compliance.
                  Drafting secure protocols and auditing system resilience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className="p-6 bg-[#111318] border border-white/5 rounded-2xl text-left hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
                  >
                    <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-2 block">{s.tag}</span>
                    <h3 className="text-slate-200 font-medium mb-2 group-hover:text-blue-400 transition-colors">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{s.prompt}</p>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                {FRAMEWORKS.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-medium text-slate-400">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-8 space-y-8">
              {activeConversation.messages.filter(m => m.role !== 'system').map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-6 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10' 
                      : 'bg-[#111318] border border-white/5 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                        {message.role === 'assistant' ? 'Securvio Intelligence Node' : 'Authorized Personnel'}
                      </span>
                      {message.role === 'assistant' && (
                        <button 
                          onClick={() => handleCopy(message.content, message.id)}
                          className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                        >
                          {copiedId === message.id ? 'VERIFIED' : 'COPY LOG'}
                        </button>
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none prose-sm leading-relaxed prose-headings:font-light prose-headings:text-blue-400 prose-strong:text-white">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#111318] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Processing Intelligence...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <footer className="p-8 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c] to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
            <div className="relative flex items-center bg-[#111318] border border-white/10 rounded-2xl shadow-2xl focus-within:border-blue-500/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Submit regulatory query or control requirement..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-5 text-slate-200 placeholder:text-slate-600 text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="mr-3 p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-blue-900/20 group/btn"
              >
                <svg className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <p className="text-[10px] text-slate-600 font-mono">NODE STATUS: OPTIMAL // SECURE CONNECTION: ACTIVE</p>
              <p className="text-[10px] text-slate-600 font-mono">v2.0.4-LTS</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Fix: Exported App as default to resolve import error in index.tsx
export default App;
