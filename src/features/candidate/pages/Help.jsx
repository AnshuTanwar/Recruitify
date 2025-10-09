import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  FileText,
  Users,
  Settings,
  Briefcase
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Button from '../../../components/ui/Button.jsx';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'profile', name: 'Profile & Resume', icon: Users },
    { id: 'jobs', name: 'Job Applications', icon: Briefcase },
    { id: 'account', name: 'Account Settings', icon: Settings }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my profile?',
      answer: 'To create your profile, navigate to the Profile section in your dashboard. Fill out all required fields including your personal information, work experience, education, and skills. Make sure to upload a professional photo and write a compelling summary.'
    },
    {
      id: 2,
      category: 'jobs',
      question: 'How do I apply for jobs?',
      answer: 'Browse available jobs in the Jobs section. Click on any job listing to view details, then click "Apply Now". You can customize your application with a cover letter and select which resume to submit.'
    },
    {
      id: 3,
      category: 'profile',
      question: 'What makes a good profile?',
      answer: 'A good profile includes: a professional photo, detailed work experience, relevant skills, education background, and a compelling summary. Keep your information up-to-date and highlight your key achievements.'
    },
    {
      id: 4,
      category: 'jobs',
      question: 'How can I track my applications?',
      answer: 'Go to the "Applied Jobs" section in your dashboard to see all your applications, their status, and any updates from employers. You can also set up notifications to get alerts about application updates.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Account Security. Click "Change Password", enter your current password, then your new password twice. Make sure your new password is strong and unique.'
    },
    {
      id: 6,
      category: 'profile',
      question: 'Can I upload multiple resumes?',
      answer: 'Yes! You can upload multiple versions of your resume for different types of positions. Go to Profile > Documents to manage your resumes and cover letters.'
    }
  ];

  const quickLinks = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Play,
      link: '/help/tutorials'
    },
    {
      title: 'User Guide',
      description: 'Complete documentation',
      icon: FileText,
      link: '/help/guide'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      link: '/help/community'
    },
    {
      title: 'Contact Support',
      description: 'Get personalized help',
      icon: MessageCircle,
      link: '/help/contact'
    }
  ];

  const contactMethods = [
    {
      method: 'Live Chat',
      description: 'Available 24/7 for immediate assistance',
      icon: MessageCircle,
      action: 'Start Chat',
      available: true
    },
    {
      method: 'Email Support',
      description: 'Get detailed help via email',
      icon: Mail,
      action: 'Send Email',
      contact: 'support@recruitify.com'
    },
    {
      method: 'Phone Support',
      description: 'Speak with our support team',
      icon: Phone,
      action: 'Call Now',
      contact: '+1 (555) 123-4567',
      hours: 'Mon-Fri 9AM-6PM PST'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-white/70">Find answers to your questions and get the help you need</p>
        </div>

        {/* Search */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{link.title}</h3>
                <p className="text-white/70 text-sm">{link.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ x: 4 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
              
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <Book className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No FAQs found matching your search</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/10 transition-colors"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <span className="text-white font-medium">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        )}
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Contact Support */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Still Need Help?</h2>
              <p className="text-white/70 mb-6">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-gray-900 font-semibold mb-2">{method.method}</h3>
                      <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                      
                      {method.contact && (
                        <p className="text-gray-700 text-sm font-medium mb-2">{method.contact}</p>
                      )}
                      
                      {method.hours && (
                        <p className="text-gray-500 text-xs mb-4">{method.hours}</p>
                      )}
                      
                      <Button
                        className="w-full"
                        disabled={method.available === false}
                      >
                        {method.action}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
