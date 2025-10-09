import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Calendar,
  Globe,
  Building2,
  Star,
  ArrowLeft,
  Briefcase,
  Award,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Button from '../../../components/ui/Button.jsx';

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  // Get company data (placeholder for now - would come from API)
  const company = {
    id: companyId || 'company',
    name: 'Company Name',
    logo: '/api/placeholder/120/120',
    tagline: 'Company tagline',
    description: 'Company description would be loaded from a database or API.',
    industry: 'Technology',
    size: '500-1000 employees',
    founded: '2015',
    headquarters: 'San Francisco, CA',
    website: 'https://techcorp.com',
    rating: 4.5,
    reviews: 234,
    followers: 12500,
    openJobs: 23,
    stats: {
      revenue: '$50M+',
      funding: 'Series C',
      growth: '+45% YoY'
    },
    values: [
      {
        title: 'Innovation',
        description: 'We constantly push boundaries and embrace new technologies'
      },
      {
        title: 'Collaboration',
        description: 'We believe great things happen when diverse minds work together'
      },
      {
        title: 'Impact',
        description: 'We measure success by the positive impact we create'
      },
      {
        title: 'Growth',
        description: 'We invest in our people and their professional development'
      }
    ],
    benefits: [
      'Competitive salary and equity',
      'Comprehensive health insurance',
      'Flexible work arrangements',
      'Professional development budget',
      'Unlimited PTO',
      'Modern office spaces',
      'Team building events',
      'Wellness programs'
    ],
    recentJobs: (() => {
      const savedJobs = localStorage.getItem('postedJobs');
      return savedJobs ? JSON.parse(savedJobs).slice(0, 3) : [];
    })(),
    gallery: [
      '/api/placeholder/300/200',
      '/api/placeholder/300/200',
      '/api/placeholder/300/200',
      '/api/placeholder/300/200'
    ]
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link 
          to="/dashboard/jobs"
          className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        {/* Company Header */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{company.name}</h1>
                <p className="text-lg text-white/80 mb-4">{company.tagline}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.headquarters}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{company.size}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {company.founded}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{company.industry}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{company.rating}</span>
                    <span className="text-white/60">({company.reviews} reviews)</span>
                  </div>
                  <div className="text-white/60">
                    {company.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "secondary" : "primary"}
                className="px-6"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              
              <Link to={`/dashboard/jobs?company=${company.id}`}>
                <Button className="px-6">
                  View Jobs ({company.openJobs})
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">About {company.name}</h2>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {company.description}
              </div>
            </motion.div>

            {/* Company Values */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Our Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                    <p className="text-white/70 text-sm">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Job Openings */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Job Openings</h2>
                <Link 
                  to={`/dashboard/jobs?company=${company.id}`}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {company.recentJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                        <p className="text-xs text-white/60 mt-2">Posted {job.posted}</p>
                      </div>
                      <Link 
                        to={`/dashboard/jobs/${job.id}`}
                        className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Company Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">Revenue</span>
                  </div>
                  <span className="text-white font-medium">{company.stats.revenue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">Funding</span>
                  </div>
                  <span className="text-white font-medium">{company.stats.funding}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">Growth</span>
                  </div>
                  <span className="text-white font-medium">{company.stats.growth}</span>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Benefits & Perks</h3>
              <div className="space-y-2">
                {company.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />
                    <span className="text-white/80 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm">Website</span>
                  <p className="text-white">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Headquarters</span>
                  <p className="text-white">{company.headquarters}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
