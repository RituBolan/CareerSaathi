const OpenAI = require("openai");

function getClient() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 60000,
  });
}

function requireOpenAIKey() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Groq API key is missing");
  }
}

function extractJSONValue(text, fallback) {
  const cleaned = (text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const candidates = [cleaned];

  const objectStart = cleaned.indexOf("{");
  const objectEnd = cleaned.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    candidates.push(cleaned.slice(objectStart, objectEnd + 1));
  }

  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    candidates.push(cleaned.slice(arrayStart, arrayEnd + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  return fallback;
}

function extractJSONArray(text) {
  const parsed = extractJSONValue(text, []);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed?.skills)) {
    return parsed.skills;
  }

  if (Array.isArray(parsed?.nextSteps)) {
    return parsed.nextSteps;
  }

  return [];
}

function extractJSONObject(text) {
  const parsed = extractJSONValue(text, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function cleanStringArray(values, maxItems = 25) {
  if (!Array.isArray(values)) return [];

  const seen = new Set();

  return values
    .map((value) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""))
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}

async function extractSkillsAI(text) {
  if (!text?.trim()) return [];
  requireOpenAIKey();

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
Extract ATS-relevant skills from the text below.

Return valid JSON only using this schema:
{"skills":["Skill 1","Skill 2"]}

Rules:
- Return up to 25 concise canonical skills only.
- Deduplicate the list.
- Return only technical skills, tools, programming languages, frameworks, databases, testing tools, platforms, or software engineering concepts.
- Prefer short labels like Java, Python, C#, C++, .NET, Angular, Selenium, Git, SQL, Oracle, OOP, RTOS, SDLC, Backend Development, Unit Testing, Integration Testing, AI, Machine Learning, Generative AI.
- Normalize synonyms, for example:
  - object-oriented programming -> OOP
  - real time operating systems -> RTOS
  - .NET Core / .NET Framework -> .NET
- Exclude soft skills such as communication, collaboration, teamwork, problem solving, initiative, adaptability, documentation, time management, and interpersonal skills.
- Do not include explanations or sentences.

Text:
${text}
        `,
      },
    ],
    temperature: 0.1,
  });

  const output = response.choices[0].message.content || "[]";
  return cleanStringArray(extractJSONArray(output));
}

async function generateATSFeedback({ score, matchedSkills, missingSkills }) {
  requireOpenAIKey();

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
You are an ATS resume coach.
Based on the ATS result below, return valid JSON only using this schema:
{"verdict":"short verdict","nextSteps":["step 1","step 2","step 3"]}

Rules:
- "verdict" must be 1 to 2 concise sentences.
- "nextSteps" must contain 3 to 5 short practical actions.
- Focus only on technical skill gaps and what the candidate should do next technically.
- Use only the provided matched and missing technical skills.
- Do not mention soft skills like communication, collaboration, problem solving, initiative, adaptability, documentation, teamwork, or time management.
- Do not add markdown, explanations, or any extra keys.

Match Score: ${score}%
Matched Skills: ${matchedSkills.length ? matchedSkills.join(", ") : "None"}
Missing Skills: ${missingSkills.length ? missingSkills.join(", ") : "None"}
        `,
      },
    ],
    temperature: 0.2,
  });

  const payload = extractJSONObject(response.choices[0].message.content || "{}");

  return {
    verdict: typeof payload.verdict === "string" ? payload.verdict.trim() : "",
    nextSteps: cleanStringArray(payload.nextSteps, 5),
  };
}

async function generateCoverLetterAI({
  name,
  companyName,
  jobTitle,
  jobDescription,
  resumeText,
}) {
  requireOpenAIKey();

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
Write a polished professional cover letter in plain text.

Output rules:
- Use standard business letter format.
- Start with: Dear Hiring Manager,
- End with:
  Sincerely,

  ${name || "Candidate"}
- Write 4 to 5 natural paragraphs.
- No markdown, no bullet points, no headings, no placeholder brackets.
- The tone should be confident, tailored, and internship/job-application ready.
- Focus on relevant technical work, projects, resume strengths, and fit for the role.
- Mention the company and role naturally when details are available.
- If the job description emphasizes innovation, learning, teamwork, software development, AI/ML, or engineering practices, weave those themes in naturally.
- Avoid exaggerated claims. Do not invent tools or experience not supported by the resume.
- Make the letter sound like the sample style: thoughtful opening, concrete technical middle paragraphs, strong fit statement, clean sign-off.

Candidate Name: ${name}
Company: ${companyName}
Job Title: ${jobTitle}

Resume:
${resumeText}

Job Description:
${jobDescription}
        `,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

async function generateRoadmapAI({ targetRole, currentSkills, jobDescription, missingSkills }) {
  requireOpenAIKey();

  const response = await getClient().chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "user",
        content: `
Create a practical learning roadmap as a JSON array of steps.

Target Role: ${targetRole}
Current Skills: ${
          Array.isArray(currentSkills)
            ? currentSkills.join(", ")
            : currentSkills
        }
Job Description: ${jobDescription || "Not provided"}
Missing Skills To Prioritize: ${
          Array.isArray(missingSkills) && missingSkills.length
            ? missingSkills.join(", ")
            : "No explicit JD gap list provided"
        }

Rules:
- Return only a JSON array of strings.
- Write 5 to 8 concise, actionable steps.
- Base the roadmap on the uploaded resume skills.
- When no job description is provided, infer the most important missing technical skills, tools, and projects needed for the target role from the uploaded resume skills.
- If a job description is provided, prioritize the missing skills and technologies from that JD.
- Focus on technical learning, projects, tooling, and portfolio proof.
- Do not include soft-skill advice.
        `,
      },
    ],
  });

  const output = response.choices[0].message.content || "[]";
  return cleanStringArray(extractJSONArray(output));
}

module.exports = {
  extractSkillsAI,
  generateATSFeedback,
  generateCoverLetterAI,
  generateRoadmapAI,
};
