import { motion } from 'framer-motion';

const defaultLogos = [
  'Google',
  'Microsoft',
  'MetalLB',
  'LinkedIn',
  'Instagram',
  'Apple Pay',
  'AWS',
  'Stripe',
  'Notion',
  'Vercel',
  'Meta',
  'Github',
  'Gitlab',
  'Docker',
  'Kubernetes',
  'Linux',
  'Ubuntu',
  'Debian',
];

function LogoCarousel({ logos = defaultLogos, className = '' }) {
  const items = [...logos, ...logos];

  return (
    <div
      className={`relative w-full overflow-hidden py-4 sm:py-6 lg:py-8 ${className}`}
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex w-[200%] items-center gap-8 sm:gap-12 lg:gap-20 whitespace-nowrap px-3 sm:px-4 lg:px-6"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        aria-hidden="true"
      >
        {items.map((name, idx) => (
          <div key={`${name}-${idx}`} className="shrink-0">
            <span className="text-white/80 text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide">
              {name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default LogoCarousel;


