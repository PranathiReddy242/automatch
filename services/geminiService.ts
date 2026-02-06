
import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const findJobs = async (location: string): Promise<Job[]> => {
  const prompt = `Find 10 HIGH-PRIORITY, ACTIVE job openings for "QA Lead" or "Senior Manual Test Lead" in ${location}.
  
  STRICT VERIFICATION PROTOCOL:
  For every company found, you MUST perform deep searches to find the CORRECT hiring contact.
  1. Search for: "[Company Name] Bangalore QA Lead recruiter email"
  2. Search for: "[Company Name] HR contact email India"
  3. Look for naming patterns (e.g., firstname.lastname@company.com) by finding the names of HR Managers for that company in Bangalore via search results.
  4. CROSS-CHECK: Ensure the email is NOT a generic 'info@' address unless no other option exists. Prefer 'careers@', 'hr@', or specific recruiter names.
  5. RECENTCY: Only include jobs posted within the last 7 days.
  
  If you cannot find a verified email, do not hallucinate one. Leave the field empty.
  In 'matchReasons', explain HOW the email was verified (e.g., "Found on official careers page", "Verified recruiter pattern").`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // Using stable Gemini 2.0 Flash model
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            summary: { type: Type.STRING },
            url: { type: Type.STRING },
            contactEmail: { type: Type.STRING, description: "VERIFIED HR or Recruiter email. Must be cross-checked." },
            matchScore: { type: Type.NUMBER },
            matchReasons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Evidence of verification" }
          },
          required: ["title", "company", "location", "summary", "url", "matchScore", "matchReasons"]
        }
      }
    }
  });

  try {
    const text = response.text.trim();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
    const jobs = JSON.parse(jsonStr);
    
    return jobs.map((j: any, idx: number) => ({
      ...j,
      id: `job-${Date.now()}-${idx}`,
      isApplied: false
    }));
  } catch (e) {
    console.error("Failed to parse verified job response", e);
    return [];
  }
};

export const generateEmail = async (job: Job, profile: UserProfile): Promise<{ subject: string; body: string }> => {
  const prompt = `Generate a high-impact application email for Nireesha Kalyanam (nireesha.kalyanam@gmail.com).
  
  Job: ${job.title} at ${job.company}
  Recipient: ${job.contactEmail || "Hiring Manager"}
  
  Instructions:
  1. Professional, leadership tone (8+ years experience).
  2. Mention specific verified details about the role if found in the summary.
  3. Include the resume link clearly: ${profile.resumeLink}
  4. Ensure the name Nireesha Kalyanam is used.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      }
    }
  });

  try {
    const text = response.text.trim();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(jsonStr);
  } catch (e) {
    return {
      subject: `Application for ${job.title} - Nireesha Kalyanam`,
      body: `Dear Hiring Team,\n\nI am Nireesha Kalyanam, a Senior QA Lead with 8+ years of experience. I am writing to express my strong interest in the ${job.title} position at ${job.company}.\n\nYou can view my professional resume here: ${profile.resumeLink}\n\nBest regards,\nNireesha Kalyanam`
    };
  }
};
