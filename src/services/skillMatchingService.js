/**
 * Skill Matching Service
 * Handles matching candidates with jobs based on their skills
 */

export class SkillMatchingService {
  /**
   * Calculate skill match percentage between candidate skills and job requirements
   * @param {Array} candidateSkills - Array of candidate's skills
   * @param {Array} requiredSkills - Array of job's required skills
   * @returns {Object} - Match result with percentage and matched skills
   */
  static calculateSkillMatch(candidateSkills, requiredSkills) {
    if (!candidateSkills || !requiredSkills || requiredSkills.length === 0) {
      return { matchPercentage: 0, matchedSkills: [], missingSkills: requiredSkills || [] };
    }

    // Normalize skills for comparison (lowercase, trim)
    const normalizedCandidateSkills = candidateSkills.map(skill => 
      skill.toLowerCase().trim()
    );
    const normalizedRequiredSkills = requiredSkills.map(skill => 
      skill.toLowerCase().trim()
    );

    // Find matched skills
    const matchedSkills = normalizedRequiredSkills.filter(requiredSkill =>
      normalizedCandidateSkills.some(candidateSkill =>
        candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill)
      )
    );

    // Find missing skills
    const missingSkills = normalizedRequiredSkills.filter(requiredSkill =>
      !normalizedCandidateSkills.some(candidateSkill =>
        candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill)
      )
    );

    // Calculate match percentage
    const matchPercentage = Math.round((matchedSkills.length / normalizedRequiredSkills.length) * 100);

    return {
      matchPercentage,
      matchedSkills: matchedSkills.map(skill => 
        requiredSkills.find(rs => rs.toLowerCase().trim() === skill)
      ),
      missingSkills: missingSkills.map(skill => 
        requiredSkills.find(rs => rs.toLowerCase().trim() === skill)
      ),
      totalRequired: requiredSkills.length,
      totalMatched: matchedSkills.length
    };
  }

  /**
   * Filter jobs based on candidate skills and minimum match threshold
   * @param {Array} jobs - Array of available jobs
   * @param {Array} candidateSkills - Candidate's skills
   * @param {number} minMatchPercentage - Minimum match percentage (default: 50%)
   * @returns {Array} - Filtered and sorted jobs with match information
   */
  static getMatchingJobs(jobs, candidateSkills, minMatchPercentage = 50) {
    if (!jobs || !candidateSkills) {
      return [];
    }

    const matchingJobs = jobs
      .map(job => {
        const matchResult = this.calculateSkillMatch(candidateSkills, job.requiredSkills || []);
        return {
          ...job,
          skillMatch: matchResult
        };
      })
      .filter(job => job.skillMatch.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.skillMatch.matchPercentage - a.skillMatch.matchPercentage);

    return matchingJobs;
  }

  /**
   * Get candidates that match job requirements
   * @param {Array} candidates - Array of candidates
   * @param {Array} requiredSkills - Job's required skills
   * @param {number} minMatchPercentage - Minimum match percentage (default: 60%)
   * @returns {Array} - Matching candidates with skill match information
   */
  static getMatchingCandidates(candidates, requiredSkills, minMatchPercentage = 60) {
    if (!candidates || !requiredSkills) {
      return [];
    }

    const matchingCandidates = candidates
      .map(candidate => {
        const matchResult = this.calculateSkillMatch(candidate.skills || [], requiredSkills);
        return {
          ...candidate,
          skillMatch: matchResult
        };
      })
      .filter(candidate => candidate.skillMatch.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.skillMatch.matchPercentage - a.skillMatch.matchPercentage);

    return matchingCandidates;
  }

  /**
   * Check if a candidate is eligible for a specific job
   * @param {Object} candidate - Candidate object with skills
   * @param {Object} job - Job object with required skills
   * @param {number} minMatchPercentage - Minimum match percentage (default: 50%)
   * @returns {boolean} - Whether candidate is eligible
   */
  static isCandidateEligible(candidate, job, minMatchPercentage = 50) {
    const matchResult = this.calculateSkillMatch(
      candidate.skills || [], 
      job.requiredSkills || []
    );
    return matchResult.matchPercentage >= minMatchPercentage;
  }

  /**
   * Get skill recommendations for a candidate based on job market
   * @param {Array} candidateSkills - Candidate's current skills
   * @param {Array} jobs - Available jobs in the market
   * @returns {Array} - Recommended skills to learn
   */
  static getSkillRecommendations(candidateSkills, jobs) {
    if (!jobs || !candidateSkills) {
      return [];
    }

    // Count frequency of required skills across all jobs
    const skillFrequency = {};
    jobs.forEach(job => {
      if (job.requiredSkills) {
        job.requiredSkills.forEach(skill => {
          const normalizedSkill = skill.toLowerCase().trim();
          skillFrequency[normalizedSkill] = (skillFrequency[normalizedSkill] || 0) + 1;
        });
      }
    });

    // Filter out skills candidate already has
    const normalizedCandidateSkills = candidateSkills.map(skill => skill.toLowerCase().trim());
    const recommendations = Object.entries(skillFrequency)
      .filter(([skill]) => !normalizedCandidateSkills.includes(skill))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, frequency]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        frequency,
        demandLevel: frequency > 5 ? 'High' : frequency > 2 ? 'Medium' : 'Low'
      }));

    return recommendations;
  }
}

export default SkillMatchingService;
