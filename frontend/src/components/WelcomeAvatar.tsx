import React, { useEffect, useState } from 'react';

interface WelcomeAvatarProps {
  visitorCount?: number;
}

export const WelcomeAvatar: React.FC<WelcomeAvatarProps> = ({ visitorCount = 0 }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [greeting, setGreeting] = useState('');

  // Animated counter
  useEffect(() => {
    if (visitorCount === 0) return;
    const target = visitorCount;
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), target);
      setDisplayCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visitorCount]);

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  return (
    <div className="avatar-container flex items-center gap-5">
      {/* 3D Floating Avatar */}
      <div className="avatar-3d-wrapper relative flex-shrink-0">
        {/* Glow ring */}
        <div className="avatar-glow-ring absolute inset-0 rounded-full" />
        
        {/* Main avatar body */}
        <div className="avatar-body w-20 h-20 rounded-full relative overflow-hidden select-none">
          {/* Face background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-500 to-cyan-400 rounded-full" />
          
          {/* Head top gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
          
          {/* Face features SVG */}
          <svg
            viewBox="0 0 80 80"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hair */}
            <ellipse cx="40" cy="12" rx="22" ry="14" fill="#1e1b4b" />
            <ellipse cx="40" cy="20" rx="22" ry="12" fill="#312e81" />
            
            {/* Face skin */}
            <ellipse cx="40" cy="40" rx="20" ry="22" fill="#fde68a" />
            
            {/* Eyes background whites */}
            <ellipse cx="32" cy="36" rx="5" ry="5.5" fill="white" />
            <ellipse cx="48" cy="36" rx="5" ry="5.5" fill="white" />
            
            {/* Eyes iris */}
            <ellipse cx="32" cy="37" rx="3" ry="3.5" fill="#1e40af" />
            <ellipse cx="48" cy="37" rx="3" ry="3.5" fill="#1e40af" />
            
            {/* Eyes pupil */}
            <ellipse cx="32.5" cy="37" rx="1.5" ry="1.8" fill="#0f172a" />
            <ellipse cx="48.5" cy="37" rx="1.5" ry="1.8" fill="#0f172a" />
            
            {/* Eye shine */}
            <circle cx="33.5" cy="35.5" r="1" fill="white" opacity="0.9" />
            <circle cx="49.5" cy="35.5" r="1" fill="white" opacity="0.9" />
            
            {/* Eyebrows */}
            <path d="M27 30 Q32 27 37 30" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M43 30 Q48 27 53 30" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Nose */}
            <ellipse cx="40" cy="44" rx="2" ry="2.5" fill="#f59e0b" opacity="0.5" />
            
            {/* Smile */}
            <path d="M33 50 Q40 56 47 50" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            
            {/* Cheeks blush */}
            <ellipse cx="27" cy="46" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
            <ellipse cx="53" cy="46" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
            
            {/* Collar/shirt */}
            <rect x="18" y="66" width="44" height="20" rx="4" fill="#1e40af" />
            <path d="M34 66 L40 74 L46 66" fill="#1d4ed8" />
            <path d="M40 66 L40 76" stroke="white" strokeWidth="1.5" opacity="0.4" />
          </svg>
          
          {/* Specular highlight */}
          <div className="absolute top-1 left-2 w-6 h-6 bg-white/20 rounded-full blur-sm pointer-events-none" />
        </div>
        
        {/* Floating particles */}
        <div className="avatar-particle avatar-particle-1 absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400/80 blur-[1px]" />
        <div className="avatar-particle avatar-particle-2 absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-indigo-400/80 blur-[1px]" />
        <div className="avatar-particle avatar-particle-3 absolute top-1/2 -right-3 w-2.5 h-2.5 rounded-full bg-blue-400/60 blur-[1px]" />
      </div>

      {/* Welcome Message */}
      <div className="avatar-text-bubble flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="avatar-wave text-lg">👋</span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            {greeting} !
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">
          Bienvenue sur le portail<br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-black">
            IT Academy
          </span>
        </p>
        {visitorCount > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono font-bold text-green-600 dark:text-green-400">
              {displayCount.toLocaleString('fr-FR')}
            </span>
            <span>visiteurs au total</span>
          </div>
        )}
      </div>
    </div>
  );
};
