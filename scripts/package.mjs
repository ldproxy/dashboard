// Creates the npm package @ldproxy/dashboard in ./package from the static export in ./out,
// with the SBOM of the runtime dependencies. The package has no dependencies, everything is bundled.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const app = JSON.parse(readFileSync("package.json", "utf8"));

if (!existsSync("out/index.html")) {
  throw new Error("Static export not found, run 'npm run buildStatic' first");
}

rmSync("package", { recursive: true, force: true });
mkdirSync("package");
cpSync("out", "package/dashboard", { recursive: true });

execFileSync("npm", ["run", "sbom", "--", "--output-file", "package/sbom.json"], { stdio: "inherit" });

writeFileSync(
  "package/package.json",
  JSON.stringify(
    {
      name: app.name,
      version: app.version,
      description: "Static export of the xtraplatform operations dashboard",
      license: app.license,
      repository: "github:ldproxy/dashboard",
      files: ["dashboard", "sbom.json"],
    },
    null,
    2
  ) + "\n"
);

console.log(`Created package ${app.name}@${app.version} in ./package`);
