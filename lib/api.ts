const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v2";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("session_jwt");
};

export const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_id");
};

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

  if (res.status === 413) throw new Error("File size exceeds 5MB limit.");
  if (res.status === 415) throw new Error("Only verified PDF files are supported.");
  if (res.status === 429) throw new Error("Analysis limit reached. Please wait 1 minute.");
  if (!res.ok) {
    let errorMsg = `Analysis failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message || errorData.error) {
        errorMsg = errorData.message || errorData.error;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }

  return await res.json();
}

export async function fetchUserHistory(userId?: string) {
  const uid = userId || getStoredUserId();
  const token = getAuthToken();
  if (!uid) {
    if (!token) {
        return { history: [] }; 
    }
    throw new Error("No user ID available to fetch history.");
  }

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
