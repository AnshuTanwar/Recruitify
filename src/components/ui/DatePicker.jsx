import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  className = "",
  minDate = null,
  maxDate = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date) => {
    if (!date || !value) return false;
    return date.toDateString() === value.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    onChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <motion.button
        type="button"
        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={value ? 'text-white' : 'text-white/60'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
      </motion.button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <motion.button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateMonth(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </motion.button>
              
              <h3 className="text-lg font-semibold text-gray-900">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <motion.button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigateMonth(1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 p-4 pb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 p-4 pt-0">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <motion.button
                  key={index}
                  className={`
                    h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                    ${!date ? 'invisible' : ''}
                    ${isDateDisabled(date) 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                    }
                    ${isDateSelected(date) 
                      ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white' 
                      : ''
                    }
                  `}
                  onClick={() => date && handleDateSelect(date)}
                  disabled={!date || isDateDisabled(date)}
                  whileHover={date && !isDateDisabled(date) ? { scale: 1.1 } : {}}
                  whileTap={date && !isDateDisabled(date) ? { scale: 0.9 } : {}}
                >
                  {date?.getDate()}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close calendar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DatePicker;
