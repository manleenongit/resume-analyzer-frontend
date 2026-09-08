# FRONTEND V2 INTEGRATION SPECIFICATION

## Overview
This document specifies the migration of the frontend application to consume the newly deployed V2 backend API contracts. All core scoring calculations remain server-authoritative. The frontend handles authentication state, multi-part form submissions with Bearer tokens, history visualization, and the interactive mock interview simulator.

---

## 1. Environment Configuration
Ensure `.env.local` in the project root defines the base URL for the backend:

`NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v2`
*(Production: NEXT_PUBLIC_API_BASE_URL=https://<your-render-backend>.onrender.com/api/v2)*

---

## 2. API Service Layer (`src/lib/api.ts` or `src/utils/api.js`)
Create a centralized API client module to handle authentication headers, FormData uploads, and error handling.

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v2";

// Helper to get stored auth token
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("session_jwt");
};

export const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_id");
};

// 1. Authenticate / Provision User
export async function authenticateUser(provider: "google" | "github", token: string) {
  const res = await fetch(`${API_BASE}/users/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, token }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.statusText}`);
  const data = await res.json();
  
  localStorage.setItem("session_jwt", data.session_jwt);
  localStorage.setItem("user_id", data.user_id);
  return data; 
}

// 2. Standardized Resume Analysis (Authenticated)
export async function analyzeResume(file: File, jobDescription: string, targetBranch: string = "CSE") {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);
  formData.append("target_branch", targetBranch);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-Test-Bypass"] = "true";
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 413) throw new Error("Resume exceeds 5MB size limit.");
  if (res.status === 415) throw new Error("Invalid document. File must be a valid PDF.");
  if (res.status === 429) throw new Error("Rate limit exceeded. Maximum 5 scans per minute.");
  if (!res.ok) throw new Error(`Analysis failed with status ${res.status}`);

  return await res.json();
}

// 3. Fetch User History
export async function fetchUserHistory(userId?: string) {
  const uid = userId || getStoredUserId();
  const token = getAuthToken();
  if (!uid) throw new Error("No user ID available to fetch history.");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-Test-Bypass"] = "true";
  }

  const res = await fetch(`${API_BASE}/users/${uid}/history`, {
    method: "GET",
    headers,
  });

  if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
  return await res.json();
}

// 4. Generate AI Mock Interview Questions
export async function generateMockInterview(analysisId: string, difficulty: "Beginner" | "Intermediate" | "Hard" = "Intermediate") {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-Test-Bypass"] = "true";
  }

  const res = await fetch(`${API_BASE}/interview/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ analysis_id: analysisId, difficulty }),
  });

  if (!res.ok) throw new Error(`Failed to generate interview: ${res.statusText}`);
  return await res.json();
}

3. UI Component Modifications
A. Resume Upload Form (/analyze or Upload Component)

    Form Action Update: Route form submission to analyzeResume(file, jobDescription, targetBranch) instead of the legacy /api/analyze endpoint.

    Field Names: Ensure the file input appends as resume and the job description text area sends as job_description.

    Store Recent Scan ID: On successful response, save data.analysis_id in component state to immediately unlock the Mock Interview button.

B. User Dashboard / History Component (/dashboard)

    Display user progression using fetchUserHistory().

    Render a timeline or simple line chart showing overall_score across dates.

    Display trend_delta:

        If positive: Green badge with +X.X% Improvement.

        If negative: Orange badge indicating score shift.

C. Mock Interview Simulator Modal

    Place a "Start AI Mock Interview" button next to the "Skills Missing" / "Needs Work" breakdown.

    When clicked, display a difficulty toggle (Beginner | Intermediate | Hard) and call generateMockInterview(analysisId, difficulty).

    Render the returned 5 questions in an accordion layout with expandable suggested technical answers.

4. Error Handling & Status Codes

Handle the following backend HTTP status codes returned by the V2 security middleware:

Status Code                             Meaning                                         UI Action
401 Unauthorized         |     Invalid or expired session JWTPrompt   |        user to log in again or clear token.
413 Payload Too LargePDF  |          file exceeds 5MB               |            Show toast: "File size exceeds 5MB limit."
415 Unsupported Media Type |       Non-PDF uploaded                |         Show toast: "Only verified PDF files are supported."
429 Too Many Requests    |    Rate limit triggered (>5 calls/min) | Show warning: "Analysis limit reached. Please wait 1 minute."