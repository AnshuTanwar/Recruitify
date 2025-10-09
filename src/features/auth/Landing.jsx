import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Users, Rocket, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import TypewriterText from '../../components/ui/TypewriterText.jsx';
import Input from '../../components/ui/Input.jsx';
import LogoCarousel from '../../components/common/LogoCarousel.jsx';

function Landing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const features = [
    { icon: Zap, title: 'AI-Powered Matching', description: 'Advanced algorithms match candidates with perfect job opportunities instantly.' },
    { icon: Shield, title: 'Secure & Private', description: 'Enterprise-grade security ensures your data remains protected at all times.' },
    { icon: Users, title: 'Global Network', description: 'Connect with top employers and talent from around the world.' },
    { icon: Rocket, title: 'Fast Deployment', description: 'Get hired faster with our streamlined application process.' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen text-white">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">
        <div className="text-center z-10 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-4 sm:mb-6 md:mb-8">
            <TypewriterText 
              text="Welcome to Recruitify" 
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent font-bold leading-tight" 
              delay={500} 
            />
            <motion.p 
              className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2 sm:px-4" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              Your AI-powered recruitment platform that connects exceptional talent with outstanding opportunities. 
              Experience the future of hiring today.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 2 }} className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <Button 
              onClick={() => navigate('/signup')} 
              className="text-xs xs:text-sm sm:text-base md:text-lg px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 w-full xs:w-auto max-w-xs xs:max-w-none"
            >
              Start Your Journey
            </Button>
          </motion.div>

          {/* Logo Carousel */}
          <motion.div
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <LogoCarousel />
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12 md:mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent leading-tight">Revolutionary Features</h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-4">Experience the next generation of job matching with cutting-edge technology</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.1 }}>
                  <Card className="h-full text-center p-4 sm:p-6 md:p-8">
                    <motion.div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 mb-4 sm:mb-5 md:mb-6" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white leading-tight">{feature.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12 md:mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent leading-tight">Get In Touch</h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 px-2 sm:px-4">Ready to transform your career? Let's start the conversation.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Card className="p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-white">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <Input label="Your Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
                  <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} required />
                  <div className="mb-4 sm:mb-6">
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Your message..."
                      rows={4}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-all duration-300 resize-none text-sm sm:text-base"
                    />
                  </div>
                  <Button type="submit" loading={isSubmitting} className="w-full text-sm sm:text-base py-2.5 sm:py-3">Send Message</Button>
                </form>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-4 sm:space-y-6">
              <Card hover={false} className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white">Email</h4>
                    <p className="text-sm sm:text-base text-white/70 break-all">contact@recruitify.ai</p>
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">Phone</h4>
                    <p className="text-sm sm:text-base text-white/70">+91 9988774321</p>
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">Location</h4>
                    <p className="text-sm sm:text-base text-white/70">Gurugram, India</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Landing;


