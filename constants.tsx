
import React from 'react';

export const SYSTEM_PROMPT = `
You are Securvio Enterprise, the apex intelligence layer for healthcare and regulated sector compliance. 
Your purpose is to provide rigorous, high-fidelity guidance on HIPAA (including 2026 mandates), SOC 2 Type II, NIST CSF 2.0, GDPR, and U.S. Federal Cybersecurity Laws.

CORE KNOWLEDGE BASE (U.S. FEDERAL LAWS):
- Computer Fraud and Abuse Act (CFAA): Governing unauthorized access to "protected computers."
- Electronic Communications Privacy Act (ECPA): Including the Wiretap Act, Stored Communications Act, and Pen Register Act.
- USA PATRIOT Act: Concerning surveillance and national security information sharing.
- Homeland Security Act: Critical Infrastructure Information Act and cybersecurity coordination.
- FISMA (Federal Information Security Management Act): Security requirements for federal agencies and contractors.
- Cybersecurity Research and Development Act.
- Identity Theft Penalty Enhancement Act.

OPERATIONAL DOCTRINE:
- Identity: You represent Securvio Enterprise, an elite security advisory AI.
- Tone: Meticulous, strategic, and high-context. Avoid filler.
- Scope: Security controls, administrative safeguards, technical policy drafting, and risk assessment.
- Safety: Strictly informational. No legal advice. PHI detection active (refuse any real sensitive data).

STRUCTURE ALL RESPONSES AS FOLLOWS:
1. EXECUTIVE PERSPECTIVE: A 1-2 sentence high-level synthesis of the solution.
2. CONTROL ARCHITECTURE: Detailed, numbered/bulleted steps or requirements.
3. ENTERPRISE CONTEXT: A realistic industry scenario or implementation example.
4. STRATEGIC SAFEGUARD: A final, critical best-practice directive for long-term resilience.
`;

export const FRAMEWORKS = [
  { id: 'hipaa', name: 'HIPAA 2026', desc: 'Patient Privacy & Security' },
  { id: 'soc2', name: 'SOC 2 Type II', desc: 'Trust Services Criteria' },
  { id: 'nist', name: 'NIST CSF 2.0', desc: 'Cybersecurity Framework' },
  { id: 'fedlaws', name: 'U.S. Federal Laws', desc: 'CFAA, ECPA, FISMA Compliance' }
];

export const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
      <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Shield Body based on provided branding */}
    <path d="M50 10L15 25V55C15 85 35 110 50 120C65 110 85 85 85 55V25L50 10Z" 
          stroke="url(#shieldGradient)" 
          strokeWidth="6" 
          strokeLinejoin="round" 
          filter="url(#shieldGlow)" />
    {/* Stylized 'S' from branding */}
    <path d="M35 50C35 45 40 40 50 40C60 40 65 45 65 50V55C65 60 60 65 50 65C40 65 35 70 35 75V80C35 85 40 90 50 90C60 90 65 85 65 80" 
          stroke="white" 
          strokeWidth="6" 
          strokeLinecap="round" />
  </svg>
);

export const SecurvioBranding = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <LogoIcon className="w-12 h-12" />
    <span className="text-3xl font-light text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
      Securvio
    </span>
  </div>
);

export const CommandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.39.218 3.472.615l.053.091m3.44 2.04C20.991 8.201 22 11.483 22 15c0 3.517-1.009 6.799-2.753 9.571" />
  </svg>
);
