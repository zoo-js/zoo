require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const {
  GH_TOKEN: githubToken,
  ISSUE_NUMBER,
} = process.env;
const issueNumber = ISSUE_NUMBER || 89;

const errBody = `🚨 The format of the application issue does not match, please check **email** or **pets list**.

🚨 申请 Issue 格式不符，请检查 **邮箱** 或 **宠物列表**。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const octokit = new Octokit({
  auth: `token ${githubToken}`,
});

const owner = 'zoo-js';
const repo = 'zoo';

async function main() {
  const res = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  });

  if (res.data.state != 'open') return false;
  if (JSON.stringify(res.data.labels).indexOf('need accurate info') == -1) return false;

  const targetArr = res.data.body.split(/\r?\n/);
  var email, pet1, pet2, pet3, pet4, pet5;
  let userNowApp = 0; // user application number

  for (var i = 0; i < targetArr.length; i++) {
    let val = targetArr[i];

    if (val.startsWith('GitHub Email:')) {
      email = val.replace('GitHub Email:', '').trim();
    }
    if (email && val.startsWith('1.') && val.length > 3) {
      pet1 = val.replace('1.', '').trim();
      if (pet1) { userNowApp += 1; }
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      pet2 = val.replace('2.', '').trim();
      if (pet2) { userNowApp += 1; }
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      pet3 = val.replace('3.', '').trim();
      if (pet3) { userNowApp += 1; }
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      pet4 = val.replace('4.', '').trim();
      if (pet4) { userNowApp += 1; }
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      pet5 = val.replace('5.', '').trim();
      if (pet5) { userNowApp += 1; }
      break;
    }
  }

  // const emailExp = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');

  if (!email || (userNowApp === 0)) {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: errBody,
    });
  } else {
    await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: issueNumber,
      name: 'need accurate info'
    });

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: ['auto invited']
    });
  }
};

(async () => {
  await main();
})();
