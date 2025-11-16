import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Linkedin, 
  Twitter, 
  Github
} from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/recruitify', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/recruitify', color: 'hover:text-sky-400' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/recruitify', color: 'hover:text-gray-300' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'API Docs', href: 'https://recruitify-backend-f2zw.onrender.com/api-docs' }
  ];

  return (
    <footer className="relative bg-slate-900/95 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-sky-900/30 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Brand Section */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent">
                Recruitify
              </h3>
              <p className="text-xs text-white/60">AI-Powered Hiring Platform</p>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Legal Links */}
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {legalLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                whileHover={{ y: -1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="text-center mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Recruitify. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
