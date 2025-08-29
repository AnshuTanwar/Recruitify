import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Users, Rocket, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import TypewriterText from '../components/TypewriterText.jsx';
import Input from '../components/Input.jsx';
import LogoCarousel from '../components/LogoCarousel.jsx';

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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-16">
        <div className="text-center z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-8">
            <TypewriterText text="Welcome to Recruitify" className="text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent" delay={500} />
            <motion.p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
              Your AI-powered recruitment platform that connects exceptional talent with outstanding opportunities. 
              Experience the future of hiring today.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 2 }}>
            <Button onClick={() => navigate('/signup')} className="text-lg px-12 py-4">Start Your Journey</Button>
          </motion.div>

          {/* Logo Carousel */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <LogoCarousel />
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Revolutionary Features</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Experience the next generation of job matching with cutting-edge technology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.1 }}>
                  <Card className="h-full text-center">
                    <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 mb-6" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Get In Touch</h2>
            <p className="text-xl text-white/70">Ready to transform your career? Let's start the conversation.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Card>
                <h3 className="text-2xl font-semibold mb-6 text-white">Send us a message</h3>
                <form onSubmit={handleSubmit}>
                  <Input label="Your Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
                  <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} required />
                  <div className="mb-6">
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Your message..."
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-all duration-300 resize-none"
                    />
                  </div>
                  <Button type="submit" loading={isSubmitting} className="w-full">Send Message</Button>
                </form>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <Card hover={false}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <p className="text-white/70">contact@jobportal.ai</p>
                  </div>
                </div>
              </Card>

              <Card hover={false}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Phone</h4>
                    <p className="text-white/70">+1 (555) 123-4567</p>
                  </div>
                </div>
              </Card>

              <Card hover={false}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Location</h4>
                    <p className="text-white/70">San Francisco, CA</p>
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


