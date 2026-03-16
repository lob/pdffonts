#!/usr/bin/env node

/**
 * Generates a JSON metrics file for the current repository.
 * Designed to run during CI after tests + coverage have completed.
 *
 * Output: metrics.json in the repo root
 *
 * Metrics captured:
 *   - repository name and timestamp
 *   - test file counts (unit vs integration)
 *   - coverage summary parsed from LCOV
 */

const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();

function getPackageInfo() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
    );
    return {
      name: pkg.name,
      version: pkg.version,
      repository: pkg.repository?.url || pkg.repository || "",
    };
  } catch {
    return { name: path.basename(repoRoot), version: "unknown", repository: "" };
  }
}

function findTestFiles(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTestFiles(fullPath, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function classifyTests() {
  const testDir = path.join(repoRoot, "test");
  const allTestFiles = findTestFiles(testDir, /\.(test|spec)\.js$|^(?!setup)[a-zA-Z]+\.js$/);

  const unit = [];
  const integration = [];

  for (const file of allTestFiles) {
    const relative = path.relative(repoRoot, file);
    if (relative.includes("setup") || relative.includes("mock") || relative.includes("fixture")) {
      continue;
    }
    if (relative.includes("integration")) {
      integration.push(relative);
    } else {
      unit.push(relative);
    }
  }

  return { unit, integration };
}

function parseLcov() {
  const lcovPaths = [
    path.join(repoRoot, "coverage", "lcov.info"),
    path.join(repoRoot, "coverage", "lcov-report", "lcov.info"),
    path.join(repoRoot, "coverage.info"),
  ];

  let lcovContent = null;
  for (const p of lcovPaths) {
    if (fs.existsSync(p)) {
      lcovContent = fs.readFileSync(p, "utf8");
      break;
    }
  }

  if (!lcovContent) {
    return { lines: null, branches: null, functions: null, statements: null };
  }

  let linesHit = 0, linesTotal = 0;
  let branchesHit = 0, branchesTotal = 0;
  let functionsHit = 0, functionsTotal = 0;

  for (const line of lcovContent.split("\n")) {
    if (line.startsWith("LH:")) linesHit += parseInt(line.slice(3), 10);
    if (line.startsWith("LF:")) linesTotal += parseInt(line.slice(3), 10);
    if (line.startsWith("BRH:")) branchesHit += parseInt(line.slice(4), 10);
    if (line.startsWith("BRF:")) branchesTotal += parseInt(line.slice(4), 10);
    if (line.startsWith("FNH:")) functionsHit += parseInt(line.slice(4), 10);
    if (line.startsWith("FNF:")) functionsTotal += parseInt(line.slice(4), 10);
  }

  const pct = (hit, total) =>
    total > 0 ? Math.round((hit / total) * 10000) / 100 : null;

  return {
    lines: { hit: linesHit, total: linesTotal, pct: pct(linesHit, linesTotal) },
    branches: { hit: branchesHit, total: branchesTotal, pct: pct(branchesHit, branchesTotal) },
    functions: { hit: functionsHit, total: functionsTotal, pct: pct(functionsHit, functionsTotal) },
  };
}

function main() {
  const pkg = getPackageInfo();
  const tests = classifyTests();
  const coverage = parseLcov();

  const metrics = {
    repository: pkg.name,
    version: pkg.version,
    repositoryUrl: pkg.repository,
    generatedAt: new Date().toISOString(),
    tests: {
      unitFiles: tests.unit.length,
      integrationFiles: tests.integration.length,
      totalFiles: tests.unit.length + tests.integration.length,
      unitTestFiles: tests.unit,
      integrationTestFiles: tests.integration,
    },
    coverage,
  };

  const outPath = path.join(repoRoot, "metrics.json");
  fs.writeFileSync(outPath, JSON.stringify(metrics, null, 2));
  console.log(`Metrics written to ${outPath}`);
  console.log(JSON.stringify(metrics, null, 2));
}

main();
