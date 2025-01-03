#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const gitRepoUrl = "https://github.com/LQT1102/web3-game-coin-spin.git";

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please specify the project name.");
  console.log("Usage: ez-create-next <project-name>");
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
  console.error(`The directory ${projectName} already exists.`);
  process.exit(1);
}

console.log(`Creating a new project in ${projectPath}...`);

// Clone the repository
console.log(`Cloning repository from ${gitRepoUrl}...`);
execSync(`git clone ${gitRepoUrl} ${projectPath}`, { stdio: "inherit" });

// Xóa thư mục .git để tránh thành nested git repo
const rimraf = require("rimraf");
rimraf.sync(path.join(projectPath, ".git"));

// Update package.json (nếu có)
const packageJsonPath = path.join(projectPath, "package.json");
if (fs.existsSync(packageJsonPath)) {
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  packageJson.name = projectName;
  // Xóa các thông tin không cần thiết như:
  delete packageJson.repository;
  delete packageJson.bugs;
  delete packageJson.homepage;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Replace các thông tin khác (nếu cần)
// Ví dụ: Thay đổi nội dung trong README.md
const readmePath = path.join(projectPath, "README.md");
if (fs.existsSync(readmePath)) {
  let readmeContent = fs.readFileSync(readmePath, "utf-8");
  readmeContent = readmeContent.replace(/web3-game-coin-spin/g, projectName); // Thay thế tên repo cũ bằng tên project mới
  fs.writeFileSync(readmePath, readmeContent);
}
// ... thêm các bước thay thế thông tin khác nếu cần

console.log(`Project created successfully!`);
console.log(
  `cd ${projectName} cd ${projectPath} && npm install to get started.`
);
