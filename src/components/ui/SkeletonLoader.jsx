import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  variant = 'rounded'
}) => {
  const variants = {
    rounded: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-none'
  };

  return (
    <motion.div
      className={`bg-white/10 ${width} ${height} ${variants[variant]} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Skeleton components for different layouts
export const JobCardSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/10">
    <div className="flex items-start space-x-4">
      <SkeletonLoader variant="circle" width="w-12" height="h-12" />
      <div className="flex-1 space-y-3">
        <SkeletonLoader width="w-3/4" height="h-5" />
        <SkeletonLoader width="w-1/2" height="h-4" />
        <div className="flex space-x-2">
          <SkeletonLoader width="w-16" height="h-6" variant="rounded" />
          <SkeletonLoader width="w-20" height="h-6" variant="rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <div className="flex items-center space-x-4 mb-6">
      <SkeletonLoader variant="circle" width="w-20" height="h-20" />
      <div className="space-y-2">
        <SkeletonLoader width="w-32" height="h-6" />
        <SkeletonLoader width="w-24" height="h-4" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonLoader width="w-full" height="h-4" />
      <SkeletonLoader width="w-5/6" height="h-4" />
      <SkeletonLoader width="w-4/5" height="h-4" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl overflow-hidden">
    <div className="bg-gray-50 p-4">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonLoader key={i} width="w-20" height="h-4" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-200">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            {[...Array(4)].map((_, j) => (
              <SkeletonLoader key={j} width="w-full" height="h-4" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;
