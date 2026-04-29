#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const API_BASE_URL = "https://vtuapi.internyet.in/api/v1";
const APP_ORIGIN = "https://vtu.internyet.in";

const HELP_TEXT = `
VTU Internship Diary Automation

Usage:
  npm run vtu-diary -- help
  npm run vtu-diary -- internships --cookie-file .vtu-cookie.txt
  npm run vtu-diary -- skills --cookie-file .vtu-cookie.txt
  npm run vtu-diary -- submit --file data/vtu-diary.json --cookie-file .vtu-cookie.txt

Options:
  --cookie-file <path>    Read a raw Cookie header from a local file.
  --cookie-header <text>  Pass the raw Cookie header directly.
  --file <path>           JSON file containing diary entries for submit.
  --dry-run               Validate and resolve entries without posting them.
  --skip-existing         Skip entries that already exist instead of updating them.
  -h, --help              Show this help text.

Notes:
  - This tool uses the same API as the VTU Internyet student dashboard.
  - It requires your active browser session cookie and XSRF cookie.
  - Use it to submit real diary notes in bulk, not to fabricate activity.
`.trim();

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (!command || command === "help") {
    console.log(HELP_TEXT);
    return;
  }

  if (!["internships", "skills", "submit"].includes(command)) {
    throw new Error(`Unknown command "${command}". Run "npm run vtu-diary -- help".`);
  }

  const cookieHeader = resolveCookieHeader(options);

  if (command === "internships") {
    const internships = await fetchAcceptedInternships(cookieHeader);
    if (internships.length === 0) {
      console.log("No accepted internships found for the current session.");
      return;
    }

    for (const internship of internships) {
      console.log(`${internship.id}\t${internship.label}`);
    }
    return;
  }

  if (command === "skills") {
    const skills = await fetchSkills(cookieHeader);
    if (skills.length === 0) {
      console.log("No skills returned by the API.");
      return;
    }

    for (const skill of skills) {
      console.log(`${skill.id}\t${skill.name}`);
    }
    return;
  }

  const inputFile = options.file;
  if (!inputFile) {
    throw new Error(`Missing "--file". Example: npm run vtu-diary -- submit --file data/vtu-diary.json --cookie-file .vtu-cookie.txt`);
  }

  const payload = readJsonFile(inputFile);
  const defaults = isPlainObject(payload.defaults) ? payload.defaults : {};
  const entries = Array.isArray(payload.entries) ? payload.entries : null;

  if (!entries || entries.length === 0) {
    throw new Error(`"${inputFile}" must contain a non-empty "entries" array.`);
  }

  const internships = await fetchAcceptedInternships(cookieHeader);
  const skills = await fetchSkills(cookieHeader);

  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
  };

  for (let index = 0; index < entries.length; index += 1) {
    const rawEntry = entries[index];
    const entry = normalizeEntry({
      rawEntry,
      defaults,
      internships,
      skills,
      index,
    });

    const existing = await findDiaryEntry(cookieHeader, entry.internship_id, entry.date);
    const action = existing ? (options.skipExisting ? "skip" : "update") : "create";

    console.log(`[${index + 1}/${entries.length}] ${action.toUpperCase()} ${entry.date} :: ${entry.internship_label}`);

    if (action === "skip") {
      summary.skipped += 1;
      continue;
    }

    if (options.dryRun) {
      continue;
    }

    const response = await saveDiaryEntry(cookieHeader, {
      ...entry,
      id: existing ? existing.id : undefined,
    });

    if (!response?.success) {
      throw new Error(response?.message || `Failed to save entry for ${entry.date}.`);
    }

    if (existing) {
      summary.updated += 1;
    } else {
      summary.created += 1;
    }
  }

  console.log("");
  console.log(`Created: ${summary.created}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Skipped: ${summary.skipped}`);
  if (options.dryRun) {
    console.log("Dry run complete. No entries were posted.");
  }
}

function parseArgs(argv) {
  if (argv.length === 0) {
    return { command: "help", options: {} };
  }

  const options = {
    dryRun: false,
    skipExisting: false,
  };

  let command = null;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!command && !token.startsWith("-")) {
      command = token;
      continue;
    }

    if (token === "-h" || token === "--help") {
      command = "help";
      continue;
    }

    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (token === "--skip-existing") {
      options.skipExisting = true;
      continue;
    }

    if (token === "--cookie-file" || token === "--cookie-header" || token === "--file") {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) {
        throw new Error(`Missing value for "${token}".`);
      }

      if (token === "--cookie-file") {
        options.cookieFile = value;
      } else if (token === "--cookie-header") {
        options.cookieHeader = value;
      } else {
        options.file = value;
      }

      index += 1;
      continue;
    }

    throw new Error(`Unknown argument "${token}".`);
  }

  return { command, options };
}

function resolveCookieHeader(options) {
  const directValue = options.cookieHeader || process.env.VTU_COOKIE_HEADER;
  if (directValue) {
    return sanitizeCookieHeader(directValue);
  }

  if (!options.cookieFile) {
    throw new Error(`Missing auth cookie. Use "--cookie-file .vtu-cookie.txt" or set VTU_COOKIE_HEADER.`);
  }

  const cookiePath = path.resolve(process.cwd(), options.cookieFile);
  if (!fs.existsSync(cookiePath)) {
    throw new Error(`Cookie file not found: ${cookiePath}`);
  }

  const raw = fs.readFileSync(cookiePath, "utf8").trim();
  if (!raw) {
    throw new Error(`Cookie file is empty: ${cookiePath}`);
  }

  if (cookiePath.endsWith(".json")) {
    const data = JSON.parse(raw);
    if (!data.cookieHeader || typeof data.cookieHeader !== "string") {
      throw new Error(`Cookie JSON must contain a string "cookieHeader" field.`);
    }
    return sanitizeCookieHeader(data.cookieHeader);
  }

  return sanitizeCookieHeader(raw);
}

function sanitizeCookieHeader(value) {
  return value
    .trim()
    .replace(/^cookie:\s*/i, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s*;\s*/g, "; ")
    .trim();
}

function readJsonFile(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Input file not found: ${absolutePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${absolutePath}: ${error.message}`);
  }
}

async function fetchAcceptedInternships(cookieHeader) {
  const items = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await apiRequest(cookieHeader, "GET", "/student/internship-applys", {
      query: {
        page,
        status: 6,
      },
    });

    ensureApiSuccess(response, "Failed to load accepted internships.");

    const pageData = response?.data ?? {};
    const records = Array.isArray(pageData.data) ? pageData.data : [];

    for (const record of records) {
      const details = record?.internship_details ?? {};
      const name = String(details.name || "").trim();
      const company = String(details.company || "").trim();
      const label = [name, company].filter(Boolean).join(" — ") || `Internship ${record?.internship_id || "Unknown"}`;

      items.push({
        id: Number(record?.internship_id),
        label,
        name,
        company,
      });
    }

    lastPage = Number(pageData.last_page || 1);
    page += 1;
  } while (page <= lastPage);

  return items.filter((item) => Number.isFinite(item.id) && item.id > 0);
}

async function fetchSkills(cookieHeader) {
  const response = await apiRequest(cookieHeader, "GET", "/master/skills");
  ensureApiSuccess(response, "Failed to load skills.");

  const items = Array.isArray(response?.data) ? response.data : [];
  return items
    .map((skill) => ({
      id: Number(skill?.id),
      name: String(skill?.name || "").trim(),
    }))
    .filter((skill) => Number.isFinite(skill.id) && skill.id > 0 && skill.name);
}

async function findDiaryEntry(cookieHeader, internshipId, date) {
  let response;
  try {
    response = await apiRequest(cookieHeader, "GET", "/student/internship-diaries/show", {
      query: {
        internship_id: internshipId,
        date,
      },
    });
  } catch (error) {
    if (error?.status === 500) {
      console.warn(`Warning: diary lookup failed for ${date}. Proceeding as a create.`);
      return null;
    }
    throw error;
  }

  if (!response?.success) {
    throw new Error(response?.message || `Failed to check existing entry for ${date}.`);
  }

  if (response.code === "DATA_FOUND" && response.data) {
    return response.data;
  }

  return null;
}

async function saveDiaryEntry(cookieHeader, entry) {
  return apiRequest(cookieHeader, "POST", "/student/internship-diaries/store", {
    body: {
      id: entry.id,
      internship_id: entry.internship_id,
      date: entry.date,
      description: entry.description,
      hours: entry.hours,
      links: entry.links,
      blockers: entry.blockers,
      learnings: entry.learnings,
      mood_slider: entry.mood_slider,
      skill_ids: entry.skill_ids,
    },
  });
}

function normalizeEntry({ rawEntry, defaults, internships, skills, index }) {
  if (!isPlainObject(rawEntry)) {
    throw new Error(`Entry ${index + 1} must be an object.`);
  }

  const merged = {
    ...defaults,
    ...rawEntry,
  };

  const internship = resolveInternship(merged, internships, index);
  const skillIds = resolveSkillIds(merged, defaults, skills, index);
  const date = requireIsoDate(pickDefined(merged.date, defaults.date), "date", index);
  const description = requireMinLength(pickDefined(merged.description, defaults.description), "description", 10, index);
  const learnings = requireMinLength(pickDefined(merged.learnings, defaults.learnings), "learnings", 10, index);
  const hours = requireHours(pickDefined(merged.hours, defaults.hours), index);
  const blockers = normalizeOptionalText(pickDefined(merged.blockers, defaults.blockers));
  const links = normalizeOptionalText(pickDefined(merged.links, defaults.links));
  const moodSlider = requireMoodSlider(pickDefined(merged.mood_slider, defaults.mood_slider, 5), index);

  return {
    internship_id: internship.id,
    internship_label: internship.label,
    date,
    description,
    hours,
    links,
    blockers,
    learnings,
    mood_slider: moodSlider,
    skill_ids: skillIds,
  };
}

function resolveInternship(merged, internships, index) {
  const internshipId = toPositiveNumber(pickDefined(merged.internship_id));
  if (internshipId) {
    const byId = internships.find((item) => item.id === internshipId);
    return {
      id: internshipId,
      label: byId?.label || `Internship ${internshipId}`,
    };
  }

  const internshipName = normalizeOptionalText(
    pickDefined(merged.internship, merged.internship_label, merged.internshipLabel),
  );

  if (!internshipName) {
    if (internships.length === 1) {
      return internships[0];
    }

    throw new Error(
      `Entry ${index + 1} is missing internship identification. Provide "internship_id" or "internship".`,
    );
  }

  const normalizedTarget = normalizeKey(internshipName);
  const exactMatch = internships.find((item) => normalizeKey(item.label) === normalizedTarget);
  if (exactMatch) {
    return exactMatch;
  }

  const nameMatches = internships.filter((item) => normalizeKey(item.name) === normalizedTarget);
  if (nameMatches.length === 1) {
    return nameMatches[0];
  }

  const partialMatches = internships.filter((item) => normalizeKey(item.label).includes(normalizedTarget));
  if (partialMatches.length === 1) {
    return partialMatches[0];
  }

  const options = internships.map((item) => item.label).join(" | ");
  throw new Error(`Could not resolve internship "${internshipName}" for entry ${index + 1}. Available: ${options}`);
}

function resolveSkillIds(merged, defaults, skills, index) {
  const skillPool = new Map(skills.map((skill) => [normalizeKey(skill.name), skill.id]));
  const values = [];

  const rawIds = pickDefined(merged.skill_ids, defaults.skill_ids);
  if (Array.isArray(rawIds)) {
    values.push(...rawIds);
  }

  const rawNames = normalizeList(pickDefined(merged.skills, defaults.skills));
  values.push(...rawNames);

  const resolved = [];
  const unresolved = [];

  for (const value of values) {
    const id = toPositiveNumber(value);
    if (id) {
      resolved.push(id);
      continue;
    }

    const key = normalizeKey(String(value || ""));
    if (!key) {
      continue;
    }

    const match = skillPool.get(key);
    if (match) {
      resolved.push(match);
    } else {
      unresolved.push(String(value));
    }
  }

  if (unresolved.length > 0) {
    throw new Error(`Unknown skills for entry ${index + 1}: ${unresolved.join(", ")}`);
  }

  const uniqueIds = [...new Set(resolved)];
  if (uniqueIds.length === 0) {
    throw new Error(`Entry ${index + 1} must include at least one skill.`);
  }

  return uniqueIds;
}

function requireIsoDate(value, fieldName, index) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(`Entry ${index + 1} has an invalid ${fieldName}. Use YYYY-MM-DD.`);
  }
  return text;
}

function requireMinLength(value, fieldName, minLength, index) {
  const text = String(value || "").trim();
  if (text.length < minLength) {
    throw new Error(`Entry ${index + 1} requires "${fieldName}" with at least ${minLength} characters.`);
  }
  return text;
}

function requireHours(value, index) {
  const hours = Number(value);
  if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
    throw new Error(`Entry ${index + 1} has invalid hours. Allowed range is 0 to 24.`);
  }

  const scaled = hours * 4;
  if (Math.abs(scaled - Math.round(scaled)) > 1e-9) {
    throw new Error(`Entry ${index + 1} has invalid hours. Use 0.25 increments like 6, 6.25, 6.5.`);
  }

  return hours;
}

function requireMoodSlider(value, index) {
  const mood = Number(value);
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    throw new Error(`Entry ${index + 1} has invalid mood_slider. Allowed values are 1 to 5.`);
  }
  return mood;
}

function normalizeOptionalText(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join("\n");
  }

  if (value == null) {
    return "";
  }

  return String(value).trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function pickDefined(...values) {
  for (const value of values) {
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function toPositiveNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }
  return number;
}

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ensureApiSuccess(response, fallbackMessage) {
  if (!response?.success) {
    throw new Error(response?.message || fallbackMessage);
  }
}

async function apiRequest(cookieHeader, method, endpoint, options = {}) {
  const url = new URL(endpoint.replace(/^\//, ""), `${API_BASE_URL}/`);
  const query = options.query || {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = {
    Accept: "application/json, text/plain, */*",
    Cookie: cookieHeader,
    Origin: APP_ORIGIN,
    Referer: `${APP_ORIGIN}/`,
    "X-Requested-With": "XMLHttpRequest",
  };

  const xsrfToken = extractXsrfToken(cookieHeader);
  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  const init = {
    method,
    headers,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message = data?.message || `HTTP ${response.status} ${response.statusText}`;
    const error = new Error(`${message}. Check whether your session cookie is still valid.`);
    error.status = response.status;
    error.responseText = text;
    throw error;
  }

  return data;
}

function extractXsrfToken(cookieHeader) {
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === "XSRF-TOKEN") {
      const rawValue = rest.join("=");
      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }
  return null;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text,
    };
  }
}
