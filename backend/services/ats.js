const { extractSkillsAI, generateATSFeedback } = require("./ai");

const SKILL_ALIASES = {
  "object oriented programming": "OOP",
  "object-oriented programming": "OOP",
  oop: "OOP",
  "real time operating systems": "RTOS",
  "real-time operating systems": "RTOS",
  rtos: "RTOS",
  ".net framework": ".NET",
  ".net frameworks": ".NET",
  ".net core": ".NET",
  ".net": ".NET",
  "dot net": ".NET",
  dotnet: ".NET",
  "c sharp": "C#",
  "c plus plus": "C++",
  "software development lifecycle": "SDLC",
  sdlc: "SDLC",
  "machine learning": "Machine Learning",
  ml: "Machine Learning",
  "artificial intelligence": "AI",
  genai: "Generative AI",
  "generative ai": "Generative AI",
  "unit test": "Unit Testing",
  "unit tests": "Unit Testing",
  "unit testing": "Unit Testing",
  "integration test": "Integration Testing",
  "integration tests": "Integration Testing",
  "integration testing": "Integration Testing",
  backend: "Backend Development",
  "backend development": "Backend Development",
  "backend engineering": "Backend Development",
  github: "Git",
};

const NON_TECHNICAL_SKILLS = new Set([
  "Problem Solving",
  "Communication",
  "Collaboration",
  "Documentation",
  "Time Management",
  "Adaptability",
  "Initiative",
  "Leadership",
  "Teamwork",
  "Interpersonal Skills",
  "Written Communication",
  "Verbal Communication",
  "Stakeholder Management",
]);

const NON_TECHNICAL_TEXT_PATTERN =
  /\b(problem solving|problem-solving|communication|collaboration|teamwork|documentation|time management|adaptability|initiative|interpersonal|leadership|stakeholder)\b/i;

const SKILL_PATTERNS = {
  OOP: [/\bobject[-\s]?oriented programming\b/i, /\boop\b/i],
  RTOS: [/\breal[-\s]?time operating systems?\b/i, /\brtos\b/i],
  ".NET": [/\b\.net\b/i, /\bdot ?net\b/i, /\b\.net core\b/i, /\b\.net framework\b/i],
  "C#": [/\bc#\b/i, /\bc sharp\b/i],
  "C++": [/\bc\+\+\b/i, /\bc plus plus\b/i],
  C: [/\bc\b(?![+#])/i],
  Java: [/\bjava\b/i],
  Python: [/\bpython\b/i],
  Angular: [/\bangular\b/i],
  Oracle: [/\boracle\b/i],
  SQL: [/\bsql\b/i],
  Selenium: [/\bselenium\b/i],
  Git: [/\bgit\b/i, /\bgithub\b/i],
  SDLC: [/\bsdlc\b/i, /\bsoftware development lifecycle\b/i],
  "Unit Testing": [/\bunit tests?\b/i, /\bunit testing\b/i],
  "Integration Testing": [/\bintegration tests?\b/i, /\bintegration testing\b/i],
  "Automation Testing": [/\bautomation testing\b/i, /\btest automation\b/i],
  AI: [/\bai\b/i, /\bartificial intelligence\b/i],
  "Machine Learning": [/\bmachine learning\b/i, /\bml\b/i],
  "Generative AI": [/\bgenerative ai\b/i, /\bgenai\b/i],
  "Backend Development": [/\bbackend\b/i, /\bbackend development\b/i],
};

function titleCaseSkill(value) {
  return value
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function normalizeSkill(skill) {
  const cleaned = String(skill || "")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  const lower = cleaned.toLowerCase();

  if (SKILL_ALIASES[lower]) {
    return SKILL_ALIASES[lower];
  }

  if (lower.includes("git")) return "Git";
  if (lower.includes("object-oriented") || lower.includes("object oriented")) return "OOP";
  if (lower.includes("real-time operating") || lower.includes("real time operating")) return "RTOS";
  if (lower.includes(".net") || lower.includes("dotnet") || lower.includes("dot net")) return ".NET";
  if (lower === "c#") return "C#";
  if (lower === "c++") return "C++";
  if (lower === "sql") return "SQL";
  if (lower === "ai") return "AI";
  if (lower === "ml") return "Machine Learning";
  if (lower === "oop") return "OOP";
  if (lower === "rtos") return "RTOS";
  if (lower === "sdlc") return "SDLC";

  return titleCaseSkill(cleaned);
}

function normalizeSkillList(skills) {
  const seen = new Set();

  return (Array.isArray(skills) ? skills : [])
    .map(normalizeSkill)
    .filter(Boolean)
    .filter((skill) => !NON_TECHNICAL_SKILLS.has(skill))
    .filter((skill) => {
      const key = skill.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function extractSkillsFromText(text) {
  if (!text?.trim()) return [];

  return Object.entries(SKILL_PATTERNS)
    .filter(([, patterns]) => patterns.some((pattern) => pattern.test(text)))
    .map(([skill]) => skill);
}

async function safeExtractSkillsAI(text) {
  try {
    return await extractSkillsAI(text);
  } catch {
    return [];
  }
}

function buildFallbackVerdict(score, matchedSkills) {
  if (score >= 75) {
    return `Strong candidate with solid alignment across ${matchedSkills.length} key skills. Some gaps remain, but the profile is suitable for the role with targeted improvements.`;
  }

  if (score >= 50) {
    return "Promising candidate with good fundamentals and some relevant skill overlap. Missing technologies should be addressed before applying aggressively to similar roles.";
  }

  if (matchedSkills.length) {
    return "Candidate shows a few relevant strengths, but the current resume does not yet align well with this JD. The biggest improvement area is closing the missing technical requirements.";
  }

  return "Current resume has limited overlap with the job description. Focus on adding evidence of the required technologies, testing skills, and software development fundamentals before targeting similar roles.";
}

function buildFallbackNextSteps(missingSkills) {
  const topMissing = missingSkills.slice(0, 4);
  const nextSteps = [];

  if (topMissing.length) {
    nextSteps.push(`Add proof of ${topMissing.join(", ")} through projects, coursework, internships, or resume bullet points.`);
  }

  if (topMissing.length >= 2) {
    nextSteps.push(`Build one focused project using ${topMissing.slice(0, 2).join(" and ")} so you can show direct hands-on evidence.`);
  }

  nextSteps.push("Tailor your resume summary and project bullets toward OOP, SDLC, testing, and collaborative software development.");
  nextSteps.push("Quantify project impact and clearly mention tools, programming languages, and responsibilities in each relevant experience.");

  return nextSteps.slice(0, 4);
}

function formatLegacySuggestions(verdict, nextSteps) {
  return [verdict, "", "Next Steps:", ...nextSteps.map((step, index) => `${index + 1}. ${step}`)].join("\n");
}

function sanitizeFeedback(verdict, nextSteps, score, matchedSkills, missingSkills) {
  const safeVerdict = NON_TECHNICAL_TEXT_PATTERN.test(verdict || "")
    ? buildFallbackVerdict(score, matchedSkills)
    : verdict;

  const safeNextSteps = (Array.isArray(nextSteps) ? nextSteps : [])
    .filter((step) => typeof step === "string" && step.trim())
    .filter((step) => !NON_TECHNICAL_TEXT_PATTERN.test(step));

  return {
    verdict: safeVerdict || buildFallbackVerdict(score, matchedSkills),
    nextSteps: safeNextSteps.length >= 2 ? safeNextSteps : buildFallbackNextSteps(missingSkills),
  };
}

async function calculateATSScore(resumeText, jobDescription) {
  const [resumeAISkills, jobAISkills] = await Promise.all([
    safeExtractSkillsAI(resumeText),
    safeExtractSkillsAI(jobDescription),
  ]);

  const resumeSkills = normalizeSkillList([
    ...extractSkillsFromText(resumeText),
    ...resumeAISkills,
  ]);
  const jobSkills = normalizeSkillList([
    ...extractSkillsFromText(jobDescription),
    ...jobAISkills,
  ]);
  const resumeSkillKeys = new Set(resumeSkills.map((skill) => skill.toLowerCase()));

  let total = 0;
  const matchedSkills = [];
  const missing = [];

  for (const skill of jobSkills) {
    total += 1;
    if (resumeSkillKeys.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const matched = matchedSkills.length;
  const score = total ? Math.round((matched / total) * 100) : 0;

  return {
    score,
    matchedSkills,
    missing,
  };
}

async function fullAts(resumeText, jd) {
  const basic = await calculateATSScore(resumeText, jd);
  let verdict = buildFallbackVerdict(basic.score, basic.matchedSkills);
  let nextSteps = buildFallbackNextSteps(basic.missing);

  try {
    const feedback = await generateATSFeedback({
      score: basic.score,
      matchedSkills: basic.matchedSkills,
      missingSkills: basic.missing,
    });

    const sanitizedFeedback = sanitizeFeedback(
      feedback.verdict,
      feedback.nextSteps,
      basic.score,
      basic.matchedSkills,
      basic.missing
    );

    if (sanitizedFeedback.verdict) {
      verdict = sanitizedFeedback.verdict;
    }

    if (sanitizedFeedback.nextSteps?.length) {
      nextSteps = sanitizedFeedback.nextSteps;
    }
  } catch (error) {
    // Keep deterministic fallback output if the model response is malformed.
  }

  return {
    ...basic,
    verdict,
    nextSteps,
    aiSuggestions: formatLegacySuggestions(verdict, nextSteps),
  };
}

module.exports = { fullAts };
