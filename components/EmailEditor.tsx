
import React, { useState } from 'react';
import { Job, UserProfile } from '../types';

interface EmailEditorProps {
  job: Job;
  initialEmail: { subject: string; body: string };
  senderEmail: string;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ job, initialEmail, senderEmail, onClose, onSend }) => {
  const [subject, setSubject] = useState(initialEmail.subject);
  const [body, setBody] = useState(initialEmail.body);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Personalize Application</h2>
            <p className="text-sm text-slate-500 font-medium">Sending as: <span className="text-blue-600">{senderEmail}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3">
             <span className="text-xl">📎</span>
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
               <strong>Note:</strong> Browser security requires one manual click in Gmail to send. 
               Please <strong>manually attach your resume file</strong> once Gmail opens, then click "Send" in your Gmail account.
             </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recipient</label>
            <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm italic font-medium">
              {job.contactEmail || "Hiring Team / Company Portal"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subject Line</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Body</label>
            <textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-80 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSend(subject, body)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            <span>Confirm & Open Gmail</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
