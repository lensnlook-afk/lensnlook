#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const DEFAULT_INPUT = "data/vtu-diary.json";
const BRAVE_APP_NAME = "Brave Browser";

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const inputPath = path.resolve(process.cwd(), process.argv[2] || DEFAULT_INPUT);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const browserScript = buildBrowserScript(payload);

  executeInBrave(browserScript);

  const started = await waitForRunStart();
  if (!started) {
    throw new Error("The VTU page did not start the diary submission script.");
  }

  const result = await waitForRunResult();
  if (result.status === "error") {
    throw new Error(result.message || "Diary submission failed inside the browser.");
  }

  console.log(JSON.stringify(result.result, null, 2));
}

function buildBrowserScript(payload) {
  return `
(() => {
  const payload = ${JSON.stringify(payload)};
  const API_BASE = "https://vtuapi.internyet.in/api/v1";

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function tokenize(value) {
    return normalizeKey(value)
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);
  }

  function normalizeOptionalText(value) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean).join("\\n");
    }
    if (value == null) {
      return "";
    }
    return String(value).trim();
  }

  function pickDefined(...values) {
    for (const value of values) {
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  }

  function getCookie(name) {
    const raw = document.cookie
      .split("; ")
      .find((part) => part.startsWith(name + "="));

    if (!raw) {
      return null;
    }

    const value = raw.slice(name.length + 1);
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  async function apiRequest(method, endpoint, options = {}) {
    const url = new URL(API_BASE + endpoint);
    const query = options.query || {};
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const headers = {
      "Accept": "application/json, text/plain, */*"
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    const response = await fetch(url.toString(), {
      method,
      credentials: "include",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { success: false, message: text };
    }

    if (!response.ok) {
      throw new Error((data && data.message) || ("HTTP " + response.status + " " + response.statusText));
    }

    return data;
  }

  async function fetchAcceptedInternships() {
    const items = [];
    let page = 1;
    let lastPage = 1;

    do {
      const response = await apiRequest("GET", "/student/internship-applys", {
        query: { page, status: 6 }
      });

      if (!response || !response.success) {
        throw new Error((response && response.message) || "Failed to load accepted internships.");
      }

      const pageData = response.data || {};
      const records = Array.isArray(pageData.data) ? pageData.data : [];

      for (const record of records) {
        const details = record && record.internship_details ? record.internship_details : {};
        const name = String(details.name || "").trim();
        const company = String(details.company || "").trim();
        const label = [name, company].filter(Boolean).join(" — ") || ("Internship " + (record && record.internship_id ? record.internship_id : "Unknown"));

        items.push({
          id: Number(record && record.internship_id),
          name,
          company,
          label,
          key: normalizeKey(label)
        });
      }

      lastPage = Number(pageData.last_page || 1);
      page += 1;
    } while (page <= lastPage);

    return items.filter((item) => Number.isFinite(item.id) && item.id > 0);
  }

  async function fetchSkills() {
    const response = await apiRequest("GET", "/master/skills");
    if (!response || !response.success) {
      throw new Error((response && response.message) || "Failed to load skills.");
    }

    const rawSkills = Array.isArray(response.data) ? response.data : [];
    return rawSkills
      .map((skill) => ({
        id: Number(skill && skill.id),
        name: String(skill && skill.name || "").trim(),
        key: normalizeKey(skill && skill.name || "")
      }))
      .filter((skill) => Number.isFinite(skill.id) && skill.id > 0 && skill.name);
  }

  function resolveInternship(entry, defaults, internships, index) {
    const internshipId = Number(pickDefined(entry.internship_id, defaults.internship_id));
    if (Number.isFinite(internshipId) && internshipId > 0) {
      const byId = internships.find((item) => item.id === internshipId);
      return {
        id: internshipId,
        label: byId ? byId.label : ("Internship " + internshipId)
      };
    }

    const internshipLabel = pickDefined(
      entry.internship,
      entry.internship_label,
      entry.internshipLabel,
      defaults.internship,
      defaults.internship_label,
      defaults.internshipLabel
    );

    if (!internshipLabel) {
      if (internships.length === 1) {
        return internships[0];
      }
      throw new Error("Entry " + (index + 1) + " is missing internship information, and multiple accepted internships are available.");
    }

    const target = normalizeKey(internshipLabel);
    const exact = internships.find((item) => item.key === target);
    if (exact) {
      return exact;
    }

    const nameMatches = internships.filter((item) => normalizeKey(item.name) === target);
    if (nameMatches.length === 1) {
      return nameMatches[0];
    }

    const partial = internships.filter((item) => item.key.includes(target) || target.includes(item.key));
    if (partial.length === 1) {
      return partial[0];
    }

    throw new Error("Could not resolve internship for entry " + (index + 1) + ": " + internshipLabel);
  }

  function resolveSkillId(name, skills) {
    const target = normalizeKey(name);
    if (!target) {
      return null;
    }

    const exact = skills.find((skill) => skill.key === target);
    if (exact) {
      return exact.id;
    }

    const partial = skills.filter((skill) => skill.key.includes(target) || target.includes(skill.key));
    if (partial.length === 1) {
      return partial[0].id;
    }

    const targetTokens = tokenize(name);
    let best = null;
    for (const skill of skills) {
      const skillTokens = tokenize(skill.name);
      const overlap = skillTokens.filter((token) => targetTokens.includes(token)).length;
      if (overlap === 0) {
        continue;
      }

      if (!best || overlap > best.overlap) {
        best = { id: skill.id, overlap };
      } else if (best && overlap === best.overlap) {
        best = { id: null, overlap };
      }
    }

    return best && best.id ? best.id : null;
  }

  function resolveSkillIds(entry, defaults, skills, index) {
    const rawNames = [];
    const skillsField = pickDefined(entry.skills, defaults.skills);
    if (Array.isArray(skillsField)) {
      rawNames.push(...skillsField);
    } else if (typeof skillsField === "string") {
      rawNames.push(...skillsField.split(/[,\\n]/g));
    }

    const rawIds = Array.isArray(pickDefined(entry.skill_ids, defaults.skill_ids))
      ? pickDefined(entry.skill_ids, defaults.skill_ids)
      : [];

    const resolved = [];
    const unresolved = [];

    for (const value of rawIds) {
      const number = Number(value);
      if (Number.isFinite(number) && number > 0) {
        resolved.push(number);
      }
    }

    for (const name of rawNames) {
      const id = resolveSkillId(name, skills);
      if (id) {
        resolved.push(id);
      } else {
        unresolved.push(String(name).trim());
      }
    }

    const unique = Array.from(new Set(resolved));
    if (unique.length === 0) {
      throw new Error("Entry " + (index + 1) + " does not match any available portal skills.");
    }

    if (unresolved.length > 0) {
      throw new Error("Unresolved skills for entry " + (index + 1) + ": " + unresolved.join(", "));
    }

    return unique;
  }

  async function findExistingDiary(internshipId, date) {
    const response = await apiRequest("GET", "/student/internship-diaries/show", {
      query: { internship_id: internshipId, date }
    });

    if (!response || !response.success) {
      throw new Error((response && response.message) || ("Failed to check existing diary entry for " + date));
    }

    if (response.code === "DATA_FOUND" && response.data) {
      return response.data;
    }

    return null;
  }

  async function saveDiary(body) {
    const response = await apiRequest("POST", "/student/internship-diaries/store", {
      body
    });

    if (!response || !response.success) {
      throw new Error((response && response.message) || ("Failed to save diary entry for " + body.date));
    }

    return response;
  }

  window.__vtuDiaryRun = {
    status: "running",
    startedAt: new Date().toISOString()
  };

  (async () => {
    if (!window.location.host.includes("internyet.in")) {
      throw new Error("The active Brave tab is not on the VTU Internyet site.");
    }

    const defaults = payload && payload.defaults && typeof payload.defaults === "object" ? payload.defaults : {};
    const entries = Array.isArray(payload && payload.entries) ? payload.entries : [];
    if (entries.length === 0) {
      throw new Error("No entries found in the payload.");
    }

    const internships = await fetchAcceptedInternships();
    const skills = await fetchSkills();

    const summary = {
      created: 0,
      updated: 0,
      internshipCount: internships.length,
      internships: internships.map((item) => item.label)
    };

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const internship = resolveInternship(entry, defaults, internships, index);
      const skillIds = resolveSkillIds(entry, defaults, skills, index);
      const body = {
        internship_id: internship.id,
        date: String(pickDefined(entry.date, defaults.date) || "").trim(),
        description: String(pickDefined(entry.description, defaults.description) || "").trim(),
        hours: Number(pickDefined(entry.hours, defaults.hours)),
        links: normalizeOptionalText(pickDefined(entry.links, defaults.links)),
        blockers: normalizeOptionalText(pickDefined(entry.blockers, defaults.blockers)),
        learnings: String(pickDefined(entry.learnings, defaults.learnings) || "").trim(),
        mood_slider: Number(pickDefined(entry.mood_slider, defaults.mood_slider, 5)),
        skill_ids: skillIds
      };

      const existing = await findExistingDiary(body.internship_id, body.date);
      if (existing && existing.id) {
        body.id = existing.id;
      }

      await saveDiary(body);
      if (body.id) {
        summary.updated += 1;
      } else {
        summary.created += 1;
      }
      window.__vtuDiaryRun = {
        status: "running",
        startedAt: window.__vtuDiaryRun.startedAt,
        progress: {
          current: index + 1,
          total: entries.length,
          date: body.date
        }
      };
    }

    window.__vtuDiaryRun = {
      status: "done",
      result: summary
    };
  })().catch((error) => {
    window.__vtuDiaryRun = {
      status: "error",
      message: error && error.message ? error.message : String(error),
      stack: error && error.stack ? error.stack : ""
    };
  });

  return "started";
})();
`;
}

function executeInBrave(js) {
  const appleScript = `
on run argv
  set jsCode to item 1 of argv
  tell application "${BRAVE_APP_NAME}"
    activate
    tell active tab of front window
      return execute javascript jsCode
    end tell
  end tell
end run
`;

  const result = spawnSync("osascript", ["-e", appleScript, js], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Failed to execute script in Brave.").trim());
  }
}

async function waitForRunStart() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const state = readRunState();
    if (state && state.status) {
      return true;
    }
    await sleep(500);
  }
  return false;
}

async function waitForRunResult() {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const state = readRunState();
    if (!state) {
      await sleep(500);
      continue;
    }

    if (state.status === "done" || state.status === "error") {
      return state;
    }

    await sleep(500);
  }

  throw new Error("Timed out waiting for the VTU diary submission to finish.");
}

function readRunState() {
  const appleScript = `
on run
  tell application "${BRAVE_APP_NAME}"
    activate
    tell active tab of front window
      return execute javascript "window.__vtuDiaryRun ? JSON.stringify(window.__vtuDiaryRun) : \\"null\\""
    end tell
  end tell
end run
`;

  const result = spawnSync("osascript", ["-e", appleScript], {
    encoding: "utf8",
    maxBuffer: 2 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Failed to read VTU run state from Brave.").trim());
  }

  const text = String(result.stdout || "").trim();
  if (!text || text === "null") {
    return null;
  }

  return JSON.parse(text);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
