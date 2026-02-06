
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import JobCard from './components/JobCard';
import EmailEditor from './components/EmailEditor';
import { AppTab, Job, UserProfile, ApplicationHistory } from './types';
import { DEFAULT_PROFILE } from './constants';
import { findJobs, generateEmail } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [history, setHistory] = useState<ApplicationHistory[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [searchLocation] = useState("Bangalore, India");

  useEffect(() => {
    const savedProfile = localStorage.getItem('qa_outreach_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem('qa_outreach_profile', JSON.stringify(DEFAULT_PROFILE));
    }
    
    const savedHistory = localStorage.getItem('qa_outreach_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('qa_outreach_profile', JSON.stringify(newProfile));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await findJobs(searchLocation);
      setJobs(results);
      setActiveTab(AppTab.FIND_JOBS);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (job: Job) => {
    setSelectedJob(job);
    setLoading(true);
    try {
      const email = await generateEmail(job, profile);
      setGeneratedEmail(email);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = (subject: string, body: string) => {
    if (!selectedJob) return;

    const newApp: ApplicationHistory = {
      id: `app-${Date.now()}`,
      jobId: selectedJob.id,
      company: selectedJob.company,
      title: selectedJob.title,
      appliedDate: new Date().toLocaleDateString(),
      emailContent: { subject, body }
    };

    const updatedHistory = [newApp, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('qa_outreach_history', JSON.stringify(updatedHistory));

    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, isApplied: true } : j));
    
    // One-click redirect to Gmail Compose using the specific profile index (u/2) as requested.
    // This targets the specific Gmail account nireesha.kalyanam@gmail.com assuming it's the 3rd logged-in profile.
    const recipient = selectedJob.contactEmail || "";
    const gmailUrl = `https://mail.google.com/mail/u/2/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');

    setSelectedJob(null);
    setGeneratedEmail(null);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome, {profile.name.split(' ')[0]}</h1>
        <p className="text-slate-500 text-lg">Targeting Top-Rated Companies in Bangalore.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 flex flex-col justify-between transform hover:scale-[1.02] transition-all relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Active Identity</span>
            <h3 className="text-2xl font-bold mt-2">{profile.name}</h3>
            <p className="text-blue-100 text-sm mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              {profile.email}
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between relative z-10">
            <span className="text-4xl font-bold">{profile.yearsOfExperience}+</span>
            <span className="text-blue-200 text-sm font-medium uppercase tracking-wider">Years Exp</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Priority Leads</span>
            <h3 className="text-2xl font-bold mt-2 text-slate-900">{jobs.filter(j => j.matchScore > 85).length} Verified</h3>
          </div>
          <div className="mt-8">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-2/3"></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Verified Active Status</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hub Location</span>
            <h3 className="text-2xl font-bold mt-2 text-slate-900">Bangalore</h3>
          </div>
          <button 
            onClick={() => setActiveTab(AppTab.FIND_JOBS)}
            className="mt-8 text-blue-600 font-bold flex items-center hover:translate-x-1 transition-transform text-sm"
          >
            Browse matching roles →
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-bold mb-4">One-Click Direct Outreach</h2>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">I'll find verified QA roles at top Bangalore firms and prepare a custom application. With one click, you'll be redirected to Gmail to send directly from <strong>{profile.email}</strong>.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-3 text-lg"
            >
              {loading ? (
                <>
                   <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Verifying Market Leads...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>Find & Apply Bangalore Jobs</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Active Roles in Bangalore</h1>
          <p className="text-slate-500 font-medium tracking-tight">One-click outreach from <strong>{profile.email}</strong></p>
        </div>
        <div className="flex space-x-2">
           <button onClick={handleSearch} className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
        </div>
      </header>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-24 text-center space-y-6 shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
             <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Start Bangalore Verification Scan</h3>
            <p className="text-slate-500">I cross-reference company ratings and active hiring status before recommending.</p>
          </div>
          <button 
             onClick={handleSearch}
             className="bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Find Priority Roles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={handleJobClick} 
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Application Tracking</h1>
        <p className="text-slate-500 font-medium">Emails generated and sent from <strong>{profile.email}</strong>.</p>
      </header>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-medium">
          No applications sent yet. Start applying from the Discovery tab.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{app.company}</td>
                  <td className="px-8 py-5 text-slate-600">{app.title}</td>
                  <td className="px-8 py-5 text-slate-500">{app.appliedDate}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => alert(`Subject: ${app.emailContent.subject}\n\n${app.emailContent.body}`)}
                      className="text-blue-600 font-bold hover:underline text-sm"
                    >
                      View Sent Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Application Credentials</h1>
        <p className="text-slate-500">Managing {profile.name}'s profile data.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl p-10 space-y-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => updateProfile({...profile, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Email (Source Address)</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => updateProfile({...profile, email: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Link</label>
            <input 
              type="url" 
              placeholder="Google Drive Link"
              value={profile.resumeLink || ""}
              onChange={(e) => updateProfile({...profile, resumeLink: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience (Years)</label>
            <input 
              type="number" 
              value={profile.yearsOfExperience}
              onChange={(e) => updateProfile({...profile, yearsOfExperience: parseInt(e.target.value)})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Summary</label>
          <textarea 
            value={profile.summary}
            onChange={(e) => updateProfile({...profile, summary: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-36 resize-none font-medium leading-relaxed"
          />
        </div>

        <div className="pt-6">
          <button 
            onClick={() => alert("Profile updated!")}
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === AppTab.DASHBOARD && renderDashboard()}
      {activeTab === AppTab.FIND_JOBS && renderJobs()}
      {activeTab === AppTab.HISTORY && renderHistory()}
      {activeTab === AppTab.PROFILE && renderProfile()}

      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-xl z-[100] flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-slate-900 font-bold text-2xl tracking-tight">One-Click Assistant Working</p>
            <p className="text-slate-500 font-medium tracking-tight">Prioritizing top companies & verified Bangalore leads...</p>
          </div>
        </div>
      )}

      {selectedJob && generatedEmail && (
        <EmailEditor 
          job={selectedJob} 
          initialEmail={generatedEmail}
          senderEmail={profile.email}
          onClose={() => {
            setSelectedJob(null);
            setGeneratedEmail(null);
          }}
          onSend={handleSendEmail}
        />
      )}
    </Layout>
  );
};

export default App;
