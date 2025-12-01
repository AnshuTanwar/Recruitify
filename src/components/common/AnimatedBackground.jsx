import React from 'react';

const AnimatedBackground = () => {
  return ( 
    <div className="fixed inset-0 -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden" />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default AnimatedBackground;
