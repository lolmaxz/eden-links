import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export function Availability() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert EST times to user's local time
  const convertToLocalTime = (hour: number) => {
    const now = new Date();
    const estOffset = -5; // EST offset from UTC
    const localOffset = now.getTimezoneOffset() / 60;
    const hourDiff = localOffset + estOffset;
    
    let localHour = hour + hourDiff;
    if (localHour >= 24) localHour -= 24;
    if (localHour < 0) localHour += 24;

    const date = new Date();
    date.setHours(localHour, 0, 0, 0);
    return format(date, 'h:mm a');
  };

  const weekdayStart = convertToLocalTime(1); // 1 AM EST
  const weekdayEnd = convertToLocalTime(14); // 2 PM EST
  const saturdayStart = convertToLocalTime(9); // 9 AM EST
  const saturdayEnd = convertToLocalTime(16); // 4 PM EST

  // Get timezone code
  const timezoneCode = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-between neon-border"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <span>Availability</span>
        </div>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="grid-card">
          <ul className="space-y-2">
            <li>Weekdays: {weekdayStart} - {weekdayEnd} {timezoneCode}</li>
            <li>Saturday: {saturdayStart} - {saturdayEnd} {timezoneCode}</li>
            <li>Sunday: Unavailable</li>
          </ul>
        </div>
      )}
    </div>
  );
}