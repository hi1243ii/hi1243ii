#!/usr/bin/env node
/**
 * Builds the EquipRent desktop app (Windows + Mac installers) with one
 * command, and collects the output somewhere easy to find:
 *
 *   dist-installers/windows/*.exe   (.msi)
 *   dist-installers/mac/*.dmg
 *
 * It also copies them into public/downloads/ so the website's /download
 * page can link straight to them.
 *
 * Windows installers only build on Windows; .dmg only builds on macOS —
 * that's an Apple/Tauri constraint, not something this script controls.
 * Run this on each platform (or in CI with a matrix of runners) to produce
 * both.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BUNDLE_DIR = path.join(ROOT, "src-tauri", "target", "release", "bundle");
const OUT_DIR = path.join(ROOT, "dist-installers");
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT, "public", "downloads");

const PLATFORM_BY_EXT = {
  ".exe": "windows",
  ".msi": "windows",
  ".dmg": "mac",
  ".app.tar.gz": "mac",
};

function extForFile(file) {
  if (file.endsWith(".app.tar.gz")) return ".app.tar.gz";
  return path.extname(file);
}

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, { stdio: "inherit", cwd: ROOT, shell: true });
  if (result.status !== 0) {
    console.error(`\n"${command} ${args.join(" ")}" failed (exit ${result.status}).`);
    process.exit(result.status ?? 1);
  }
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function main() {
  console.log("Building EquipRent desktop app…");
  run("npx", ["tauri", "build"]);

  const built = walk(BUNDLE_DIR).filter((f) => extForFile(f) in PLATFORM_BY_EXT);

  if (built.length === 0) {
    console.warn("\nNo installer files found under src-tauri/target/release/bundle — check the build output above.");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });

  console.log("\nCollecting installers:");
  for (const file of built) {
    const ext = extForFile(file);
    const platform = PLATFORM_BY_EXT[ext];
    const platformDir = path.join(OUT_DIR, platform);
    fs.mkdirSync(platformDir, { recursive: true });

    const destName = path.basename(file);
    const dest = path.join(platformDir, destName);
    fs.copyFileSync(file, dest);
    console.log(`  ${path.relative(ROOT, dest)}`);

    // Only ship the real installers to the website, not the raw .app bundle archive.
    if (ext === ".exe" || ext === ".msi" || ext === ".dmg") {
      fs.copyFileSync(file, path.join(PUBLIC_DOWNLOADS_DIR, destName));
    }
  }

  console.log(`\nDone. Installers are in:\n  ${OUT_DIR}\n  ${PUBLIC_DOWNLOADS_DIR} (served by the website's /download page)`);
}

main();
