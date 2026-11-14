import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, MessageSquare, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface WelcomeAvatarProps {
  visitorCount?: number;
}

const ACADEMIC_QUOTES = [
  "Bienvenue sur IT Academy ! Consultez vos supports avant chaque séance de TP.",
  "Tous vos cours et supports sont protégés et optimisés en lecture haute-fidélité.",
  "Une question sur un TP ou un examen ? Utilisez l'Espace Délégués pour me contacter !",
  "Persistance garantie : toutes vos données sont sécurisées sur disque et dans le cloud.",
  "Excellence académique & rigueur technique — Dr. M.A. Meziane (ESE ORAN)."
];

export const WelcomeAvatar: React.FC<WelcomeAvatarProps> = ({ visitorCount = 0 }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [isPulse, setIsPulse] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  // Animated counter
  useEffect(() => {
    if (visitorCount === 0) return;
    const target = visitorCount;
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(stepValue * step), target);
      setDisplayCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visitorCount]);

  // Dynamic greeting based on hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  // Eye blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  // 3D Parallax Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized delta between -1 and 1
      const deltaX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
      const deltaY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

      setMousePos({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAvatarClick = () => {
    setIsPulse(true);
    setShowQuote(true);
    setQuoteIndex((prev) => (prev + 1) % ACADEMIC_QUOTES.length);
    setTimeout(() => setIsPulse(false), 800);
  };

  // 3D Tilt calculation
  const headRotateY = mousePos.x * 22; // -22deg to 22deg
  const headRotateX = -mousePos.y * 18; // -18deg to 18deg
  const pupilOffsetX = mousePos.x * 5; // -5px to 5px
  const pupilOffsetY = mousePos.y * 4; // -4px to 4px

  return (
    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 select-none">
      
      {/* 3D Holographic Cyber Avatar */}
      <div 
        ref={avatarRef}
        onClick={handleAvatarClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer flex-shrink-0"
        title="Cliquez pour interagir avec l'assistant virtuel"
      >
        
        {/* Holographic Ambient Glow Backlight */}
        <div className={`absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-40 blur-xl transition-all duration-700 ${
          isHovered || isPulse ? 'opacity-80 scale-125' : 'animate-pulse'
        }`} />

        {/* 3D Perspective Canvas Container */}
        <div 
          className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ perspective: '800px' }}
        >
          
          {/* Outer Gyro Ring 1 - Fast Horizontal Spin */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-t-cyan-300 border-b-blue-600 animate-spin"
            style={{ 
              animationDuration: '6s',
              transform: 'rotateX(65deg) rotateZ(20deg)'
            }} 
          />

          {/* Outer Gyro Ring 2 - Reverse Vertical Spin */}
          <div 
            className="absolute inset-1.5 rounded-full border-2 border-indigo-400/30 border-r-indigo-400 border-l-cyan-400 animate-spin"
            style={{ 
              animationDuration: '9s',
              animationDirection: 'reverse',
              transform: 'rotateY(65deg) rotateX(15deg)'
            }} 
          />

          {/* 3D Orbiting Satellites / Quantum Particles */}
          <div 
            className="absolute inset-0 animate-spin pointer-events-none"
            style={{ animationDuration: '4s' }}
          >
            <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
          </div>
          <div 
            className="absolute inset-0 animate-spin pointer-events-none"
            style={{ animationDuration: '7s', animationDirection: 'reverse' }}
          >
            <div className="absolute -bottom-1 right-2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
          </div>

          {/* 3D Floating Cyber Droid Head */}
          <div 
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-transform duration-150 ease-out"
            style={{
              transform: `rotateX(${headRotateX}deg) rotateY(${headRotateY}deg) scale(${isHovered ? 1.06 : 1})`,
              transformStyle: 'preserve-3d',
              boxShadow: isHovered 
                ? '0 0 30px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(37, 99, 235, 0.4)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(6, 182, 212, 0.2)'
            }}
          >
            
            {/* Holographic Carbon Matrix Texture Grid */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                backgroundSize: '6px 6px'
              }}
            />

            {/* Specular Light Reflection */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/20 rounded-full blur-md pointer-events-none" />

            {/* AI Core Forehead Scanner Ring */}
            <div className="absolute top-2 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-ping" />
              <div className="h-0.5 w-6 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>

            {/* Cyber Visor Eye Plate */}
            <div className="relative w-16 h-7 rounded-xl bg-black/90 border border-cyan-500/50 flex items-center justify-around px-2 shadow-inner my-1">
              
              {/* Left Eye */}
              <div className="relative w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border border-cyan-500/30">
                <div 
                  className={`w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 shadow-[0_0_10px_#06b6d4] transition-all duration-75 flex items-center justify-center ${
                    isBlinking ? 'scale-y-[0.08] opacity-20' : 'scale-y-100'
                  }`}
                  style={{
                    transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`
                  }}
                >
                  {/* Eye Pupil / Core Glint */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Center Neural Link */}
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_4px_#22d3ee]" />

              {/* Right Eye */}
              <div className="relative w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border border-cyan-500/30">
                <div 
                  className={`w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 shadow-[0_0_10px_#06b6d4] transition-all duration-75 flex items-center justify-center ${
                    isBlinking ? 'scale-y-[0.08] opacity-20' : 'scale-y-100'
                  }`}
                  style={{
                    transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`
                  }}
                >
                  {/* Eye Pupil / Core Glint */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                </div>
              </div>

            </div>

            {/* Frequency Soundwave Visualizer Bars (Simulating voice / AI state) */}
            <div className="flex items-center space-x-0.5 mt-1">
              {[0.4, 0.9, 0.6, 1.0, 0.5].map((scale, i) => (
                <div 
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 animate-pulse"
                  style={{
                    height: `${scale * (isHovered ? 12 : 7)}px`,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '600ms'
                  }}
                />
              ))}
            </div>

            {/* Bottom Metallic Trim */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-700 opacity-90" />

          </div>

          {/* Interactive Click Ripple Ring */}
          {isPulse && (
            <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping pointer-events-none" />
          )}

        </div>

        {/* Interactive Click Hint Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-1 rounded-full shadow-lg border border-white/20 transform group-hover:scale-110 transition-transform">
          <Sparkles className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>

      </div>

      {/* Modern High-Tech Glass Bubble & Info Card */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header Line */}
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Assistant 3D • {greeting}</span>
          </div>
        </div>

        {/* Portal Title & Professor Reference */}
        <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Portail Numérique <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">IT Academy</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          Enseignement Universitaire Supérieur • <span className="font-semibold text-slate-700 dark:text-slate-200">Dr. M.A. Meziane</span> (ESE ORAN)
        </p>

        {/* Interactive Speech Balloon / Academic Advice */}
        <div 
          onClick={handleAvatarClick}
          className="mt-2.5 relative group cursor-pointer p-3 rounded-2xl bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-cyan-950/40 border border-slate-200 dark:border-cyan-500/20 shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all duration-200"
        >
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-xl bg-blue-100 dark:bg-cyan-950/80 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                {ACADEMIC_QUOTES[quoteIndex]}
              </p>
              <div className="flex items-center space-x-2 mt-1 text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                <Zap className="w-3 h-3 text-cyan-500" />
                <span>Cliquez sur l'avatar pour un autre conseil pédagogique</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visitor Counter LED Pill */}
        {visitorCount > 0 && (
          <div className="mt-2 flex items-center space-x-2 text-xs">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-[11px] shadow-sm border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-slate-400">Visiteurs :</span>
              <span className="font-bold text-emerald-400 tracking-wider">
                {displayCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-slate-400">étudiants</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};