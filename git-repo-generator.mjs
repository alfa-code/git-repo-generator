#!/usr/bin/env node

import { input, number, confirm } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';

async function main() {
    console.log("🚀 Git Repository Generator\n");

    const repoName = await input({ message: 'Название репозитория:', default: 'my-repo' });
    const commitCount = await number({ message: 'Сколько коммитов сделать в основной ветке?', default: 5 });
    const branchCount = await number({ message: 'Сколько создать дополнительных веток?', default: 2 });
    const mergeBranches = await confirm({ message: 'Делать merge между ветками?', default: true });

    console.log(`\n📂 Создаю репозиторий: ${repoName}...`);
    mkdirSync(repoName);
    process.chdir(repoName);
    execSync('git init');

    console.log("📄 Создаю README.md...");
    writeFileSync('README.md', `# ${repoName}\n\nСгенерированный репозиторий`);
    execSync('git add .');
    execSync('git commit -m "Initial commit"');

    console.log(`✍️ Добавляю ${commitCount} коммитов в main...`);
    for (let i = 1; i <= commitCount; i++) {
        writeFileSync(`file${i}.txt`, `Контент файла ${i}`);
        execSync('git add .');
        execSync(`git commit -m "Добавлен файл file${i}.txt"`);
    }

    const branches = [];
    for (let i = 1; i <= branchCount; i++) {
        const branchName = `feature-${i}`;
        branches.push(branchName);
        console.log(`🌿 Создаю ветку ${branchName}...`);
        execSync(`git checkout -b ${branchName}`);
        writeFileSync(`feature${i}.txt`, `Файл в ветке ${branchName}`);
        execSync('git add .');
        execSync(`git commit -m "Добавлен файл feature${i}.txt в ${branchName}"`);
    }

    execSync('git checkout main');

    if (mergeBranches) {
        for (const branch of branches) {
            console.log(`🔀 Мержу ветку ${branch} в main...`);
            execSync(`git merge ${branch} --no-edit`);
        }
    }

    console.log("🎉 Репозиторий готов!");
}

main().catch(console.error);
