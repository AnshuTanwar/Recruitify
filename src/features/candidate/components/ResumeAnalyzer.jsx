import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Brain,
  Eye,
  Download,
  Loader
} from 'lucide-react';
import ApiService from '../../../services/apiService';

const ResumeAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeKey, setSelectedResumeKey] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Fetch user's uploaded resumes
  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const response = await ApiService.getCandidateResumes();
      setResumes(response.resumes || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      setNewFile(file);
      setSelectedResumeKey(''); // Clear selected resume if uploading new file
    }
  };

  const handleAnalyze = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert('Please provide both job title and job description.');
      return;
    }

    if (!selectedResumeKey && !newFile) {
      alert('Please select an existing resume or upload a new one.');
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      const analysisData = {
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
      };

      if (selectedResumeKey) {
        analysisData.resumeKey = selectedResumeKey;
      }

      if (newFile) {
        analysisData.newFile = newFile;
      }

      const response = await ApiService.analyzeResume(analysisData);
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Resume Analyzer
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
          Get AI-powered insights on how well your resume matches job requirements
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Job Details
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-green-600" />
          Select Resume
        </h3>

        {/* Resume Selection */}
        <div className="space-y-4">
          {/* Existing Resumes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Uploaded Resume
            </label>
            {loadingResumes ? (
              <div className="flex items-center justify-center p-4">
                <Loader className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2">Loading resumes...</span>
              </div>
            ) : (
              <select
                value={selectedResumeKey}
                onChange={(e) => {
                  setSelectedResumeKey(e.target.value);
                  setNewFile(null); // Clear new file if selecting existing resume
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="" className="text-gray-500">Select an uploaded resume</option>
                {resumes.map((resume) => (
                  <option key={resume.key} value={resume.key} className="text-gray-900">
                    {resume.originalName} (uploaded {new Date(resume.uploadedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* OR Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 bg-white">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* New File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Resume
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {newFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Selected: {newFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading || (!selectedResumeKey && !newFile) || !jobTitle.trim() || !jobDescription.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Analyze Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Analysis Results
          </h2>

          {/* ATS Score */}
          <div className={`${getScoreBgColor(analysis.atsScore)} rounded-lg p-6 mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ATS Compatibility Score</h3>
                <p className="text-gray-600">How well your resume passes through Applicant Tracking Systems</p>
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                {analysis.atsScore}/100
              </div>
            </div>
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Summary
              </h3>
              <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">{analysis.summary}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Improvements */}
            {analysis.suggestedImprovements && analysis.suggestedImprovements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-700">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Suggested Improvements
                </h3>
                <ul className="space-y-2">
                  {analysis.suggestedImprovements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills && analysis.missingSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-700">
                  <Target className="h-5 w-5 mr-2" />
                  Missing Skills
                </h3>
                <ul className="space-y-2">
                  {analysis.missingSkills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Additional Analysis */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {analysis.tone && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Tone Analysis</h4>
                <p className="text-gray-700">{analysis.tone}</p>
              </div>
            )}
            
            {analysis.cultureFit && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Culture Fit</h4>
                <p className="text-gray-700">{analysis.cultureFit}</p>
              </div>
            )}

            {analysis.layoutIssues && analysis.layoutIssues.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Layout Issues</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {analysis.layoutIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
