// Animation utility classes and functions
export const fadeIn = {
  opacity: 0,
  animation: 'fadeIn 0.7s ease-in-out forwards'
}

export const fadeInUp = {
  opacity: 0,
  animation: 'fadeInUp 0.5s ease-in-out forwards'
}

export const fadeInDown = {
  opacity: 0,
  animation: 'fadeInDown 0.5s ease-in-out forwards'
}

export const fadeScale = {
  opacity: 0,
  transform: 'scale(0.98)',
  animation: 'fadeScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
}

export const fadeInBounce = {
  opacity: 0,
  animation: 'fadeInBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
}

// CSS-in-JS animations
export const keyframes = `
  @keyframes fadeIn {
    0% { 
      opacity: 0;
    }
    100% { 
      opacity: 1;
    }
  }
  
  @keyframes fadeInUp {
    0% { 
      opacity: 0;
    }
    100% { 
      opacity: 1;
    }
  }
  
  @keyframes fadeInDown {
    0% { 
      opacity: 0;
    }
    100% { 
      opacity: 1;
    }
  }
  
  @keyframes fadeScale {
    0% { 
      opacity: 0;
      transform: scale(0.98);
    }
    60% {
      opacity: 0.8;
      transform: scale(1.01);
    }
    100% { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeInBounce {
    0% { 
      opacity: 0;
      transform: scale(0.98);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.02);
    }
    70% { 
      opacity: 0.9;
      transform: scale(0.99);
    }
    100% { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 1;
    }
    50% { 
      opacity: 0.7;
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); opacity: 1; }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); opacity: 0.9; }
    20%, 40%, 60%, 80% { transform: translateX(5px); opacity: 0.95; }
  }
  
  @keyframes glow {
    0%, 100% { 
      opacity: 0.9;
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% { 
      opacity: 1;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }
`

// Animation classes for CSS
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeScale: 'animate-fade-scale',
  fadeInBounce: 'animate-fade-bounce',
  pulse: 'animate-pulse',
  shake: 'animate-shake',
  glow: 'animate-glow'
}

// Staggered animation helper
export const staggeredAnimation = (index, baseDelay = 0.2) => ({
  animationDelay: `${index * baseDelay}s`
}) 