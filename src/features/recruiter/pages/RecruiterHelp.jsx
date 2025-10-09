import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Book, 
  Video, 
  FileText, 
  Users, 
  Settings, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';

const RecruiterHelp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      available: true,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      action: 'Call Now',
      available: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      available: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Video Call',
      description: 'Schedule a screen-sharing session',
      icon: Video,
      action: 'Schedule Call',
      available: false,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of recruiting on our platform',
      icon: Book,
      category: 'guide'
    },
    {
      title: 'Job Posting Best Practices',
      description: 'Tips for creating effective job listings',
      icon: FileText,
      category: 'guide'
    },
    {
      title: 'Candidate Screening Guide',
      description: 'How to evaluate and screen candidates',
      icon: Users,
      category: 'guide'
    },
    {
      title: 'Platform Settings',
      description: 'Configure your recruiter preferences',
      icon: Settings,
      category: 'settings'
    },
    {
      title: 'API Documentation',
      description: 'Integrate with our recruiting API',
      icon: ExternalLink,
      category: 'technical'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials',
      icon: Video,
      category: 'tutorial'
    }
  ];

  const faqs = [
    {
      question: 'How do I post a new job opening?',
      answer: 'To post a new job, navigate to the "Post Job" section from your dashboard. Fill in the job details, requirements, and company information. You can preview your posting before publishing it live.',
      category: 'posting'
    },
    {
      question: 'How can I search and filter candidates?',
      answer: 'Use the Candidates section to browse profiles. You can filter by skills, experience, location, and availability. Use the advanced search to find candidates matching specific criteria.',
      category: 'search'
    },
    {
      question: 'How do I schedule candidate discussions?',
      answer: 'You can schedule technical discussions directly through the platform. Select a candidate, choose available time slots, and send calendar invites. Both you and the candidate will receive notifications.',
      category: 'discussions'
    },
    {
      question: 'How do I manage candidate applications?',
      answer: 'All applications appear in your dashboard. You can review resumes, move candidates through different stages (screening, review, offer), and communicate directly through our messaging system.',
      category: 'management'
    },
    {
      question: 'Can I collaborate with other recruiters?',
      answer: 'Yes, you can add team members to job postings, share candidate profiles, and collaborate on hiring decisions. Use the team features in your account settings.',
      category: 'collaboration'
    },
    {
      question: 'How do I track recruitment analytics?',
      answer: 'Visit the Analytics section to view metrics like application rates, time-to-hire, source effectiveness, and candidate pipeline status. Export reports for further analysis.',
      category: 'analytics'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'posting', name: 'Job Posting' },
    { id: 'search', name: 'Candidate Search' },
    { id: 'discussions', name: 'Discussions' },
    { id: 'management', name: 'Management' },
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'analytics', name: 'Analytics' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredQuickLinks = quickLinks.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-white/70">Get help with recruiting, find answers, and contact support</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            />
          </div>
        </motion.div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Contact Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.title}
                  className={`bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                    option.available ? 'cursor-pointer' : 'opacity-60'
                  }`}
                  whileHover={option.available ? { scale: 1.02 } : {}}
                  whileTap={option.available ? { scale: 0.98 } : {}}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                      option.available
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!option.available}
                  >
                    {option.available ? option.action : 'Coming Soon'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.title}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:bg-gray-50"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </motion.div>

        {/* Status & Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">All systems operational</span>
              <span className="text-gray-500 text-sm">Last updated: 2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">API services running normally</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Scheduled maintenance: Sunday 2:00 AM - 4:00 AM EST</span>
            </div>
          </div>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterHelp;
