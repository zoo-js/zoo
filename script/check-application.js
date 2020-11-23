require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const {
  GH_TOKEN: githubToken,
  ISSUE_AUTH,
  ISSUE_NUMBER,
} = process.env;
const issueAuth = ISSUE_AUTH || 'xrkffgg';
const issueNumber = ISSUE_NUMBER || 87;

const errBody = `🚨 The format of the application issue does not match, please check **email** or **pets list**.

🚨 申请 Issue 格式不符，请检查 **邮箱** 或 **宠物列表**。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const maxBody = `😅 At present, in principle, only 5 small cute items are supported by one person. Please choose carefully.

😅 目前原则上仅支持单人领取 5 只 小萌物，请大家谨慎挑选。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const octokit = new Octokit({
  auth: `token ${githubToken}`,
  request: {
    timeout: 2000
  }
});

const owner = 'zoo-js';
const repo = 'zoo';
const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';
let organizations = [];

async function main() {
  const res = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  });

  const targetArr = res.data.body.split('\r\n');
  var email, pet1, pet2, pet3, pet4, pet5;
  let userNowApp = 0; // user application number

  for (var i = 0; i < targetArr.length; i++) {
    let val = targetArr[i];

    if (val.startsWith('GitHub Email:')) {
      email = val.replace('GitHub Email: ', '');
    }
    if (email && val.startsWith('1.') && val.length > 3) {
      pet1 = val.replace('1. ', '');
      if (pet1) { userNowApp += 1; }
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      pet2 = val.replace('2. ', '');
      if (pet2) { userNowApp += 1; }
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      pet3 = val.replace('3. ', '');
      if (pet3) { userNowApp += 1; }
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      pet4 = val.replace('4. ', '');
      if (pet4) { userNowApp += 1; }
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      pet5 = val.replace('5. ', '');
      if (pet5) { userNowApp += 1; }
      break;
    }
  }

  const emailExp = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');

  if (!email || !emailExp.test(email) || (userNowApp === 0)) {
    core.info('empty');
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: errBody,
    });

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: ['need accurate info']
    });
  } else {
    await getOrganizations();
    if (organizations.length === 0) return false;

    let userNowOrg = 0; // user now number
    for (let i = 0; i < organizations.length; i++) {
      let checkStatus = await checkMembershipForUser(organizations[i].fullName, issueAuth);
      console.log(organizations[i].fullName, Number(checkStatus) == 204);
      if (Number(checkStatus) == 204) {
        userNowOrg += 1;
      }
    }

    if (userNowOrg + userNowApp > 5) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: maxBody,
      });

      await octokit.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: 'closed'
      });
    } else {
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: ['auto invited']
      });
    }
  }
};

async function checkMembershipForUser(org, username) {
  try {
    let res = await octokit.orgs.checkMembershipForUser({
      org,
      username
    });
    return res.status;
  } catch (err) {
    return 404
  }
};

async function getOrganizations() {
  try {
    const res = await axios.get(url);
    organizations = res.data.data;
  } catch(err) {
    console.log(err);
  }
};

(async () => {
  await main();
})();
