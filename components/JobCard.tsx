
import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const isVerified = !!job.contactEmail && job.matchReasons.some(r => r.toLowerCase().includes('verified') || r.toLowerCase().includes('found'));

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative"
    >
      <div className="absolute top-0 right-0 mt-3 mr-3 flex items-center space-x-2">
        {isVerified && (
          <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-blue-100 flex items-center">
            <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L9.03 1.62a1 1 0 01.94 0l6.864 3.28A1 1 0 0117.5 5.8v4.2c0 5.189-3.451 9.619-8.5 10.993-5.049-1.374-8.5-5.804-8.5-10.993V5.8a1 1 0 01.666-.9zM10 12.414l3.707-3.707a1 1 0 00-1.414-1.414L10 9.586 7.707 7.293a1 1 0 00-1.414 1.414L10 12.414z" clipRule="evenodd" /></svg>
            Cross-Checked
          </span>
        )}
        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
          job.matchScore >= 80 ? 'bg-green-100 text-green-700' : 
          job.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {job.matchScore}% Match
        </div>
      </div>

      <div className="flex justify-between items-start mb-3 pt-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="text-slate-600 font-bold text-sm mt-0.5">{job.company}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed flex-1">
        {job.summary}
      </p>

      {job.contactEmail ? (
        <div className="mb-4 p-2 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center space-x-3 text-blue-700">
           <div className="bg-blue-600 p-1.5 rounded-lg text-white">
             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
           </div>
           <div className="overflow-hidden">
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verified Outreach</p>
             <p className="text-xs font-bold truncate">{job.contactEmail}</p>
           </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center space-x-2 text-slate-400 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
           <span className="text-[10px] font-medium">Apply via Company Portal Only</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1.5 mb-6">
        {job.matchReasons.slice(0, 2).map((reason, idx) => (
          <span key={idx} className="bg-white text-slate-500 text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded border border-slate-200">
            {reason}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 flex items-center uppercase tracking-widest">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {job.location}
        </span>
        <button className="bg-slate-900 text-white font-black text-[10px] px-4 py-2 rounded-xl shadow-lg hover:bg-blue-600 transition-all uppercase tracking-widest active:scale-95">
          {job.contactEmail ? 'One-Click Apply' : 'View Portal'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
