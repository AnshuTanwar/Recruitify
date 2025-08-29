import { motion } from 'framer-motion';
import { 
  Zap, Mail, Phone, MapPin, Linkedin, Github
} from 'lucide-react';

function Footer() {
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/recruitify' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/recruitify' }
  ];

  return (
    <footer className="relative bg-slate-900/95 backdrop-blur-md border-t border-white/10 mt-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-sky-900/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent">Recruitify</h3>
                  <p className="text-xs text-white/60">AI-Powered Hiring Platform</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 text-sm">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /><span>San Francisco, CA</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-400" /><span>+1 (555) 123-4567</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-400" /><span>contact@recruitify.ai</span></div>
              </div>
            </motion.div>

            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>

        <motion.div className="text-center py-4 border-t border-white/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
          <p className="text-white/50 text-xs">© {new Date().getFullYear()} Recruitify. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;


