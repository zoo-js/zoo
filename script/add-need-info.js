require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const {
  GH_TOKEN: githubToken,
  ISSUE_AUTH,
  ISSUE_NUMBER,
} = process.env;
const issueAuth = ISSUE_AUTH;
const issueNumber = ISSUE_NUMBER;

const issueBody = `🎈 Hi, @${issueAuth}. We cannot accurately obtain your email address or the pets you want to adopt. Please complete your information. You can refer to the following format.

- Requirement：
  - email: Add a space after the English colon, add email
  - pets: Add a period after the number, and add pet abbreviation

---

🎈 你好，@${issueAuth}。我们无法准确获取你的邮箱或想要领养的宠物，请完善你的信息。可参考如下格式。

- 格式要求：
  - email: 英文冒号后加空格，加邮箱
  - pets: 数字后加英文句号，加 pet 英文简称

---

![](https://user-images.githubusercontent.com/29775873/98193446-32839780-1f58-11eb-8cf1-e66a37e65981.png)

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const octokit = new Octokit({ auth: `token ${githubToken}` });

const owner = 'zoo-js';
const repo = 'zoo';

async function main() {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: issueBody,
  });
};

(async () => {
  await main();
})();
