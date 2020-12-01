require('dotenv').config();
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const {
  GH_TOKEN: githubToken,
  ISSUE_AUTH,
  ISSUE_NUMBER,
} = process.env;
const issueAuth = ISSUE_AUTH || 'xrkffgg';
const issueNumber = ISSUE_NUMBER || 48;

const issueBody = `🎉 Hi, @${issueAuth}. The invitation has been sent to the specified email address, please check! This issue will be closed. If you have any questions, please comment below.

🎉 你好，@${issueAuth}。邀请已发送到指定邮箱，请查收！这个 issue 将要被关闭，如果你有任何问题，欢迎在下方评论。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const errBody = `🚨 The format of the application issue does not match, please check **email** or **pets list**.

🚨 申请 Issue 格式不符，请检查 **邮箱** 或 **宠物列表**。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const octokit = new Octokit({ auth: `token ${githubToken}` });

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

  for (var i = 0; i < targetArr.length; i++) {
    let val = targetArr[i];

    if (val.startsWith('GitHub Email:')) {
      email = val.replace('GitHub Email: ', '');
    }
    if (email && val.startsWith('1.') && val.length > 3) {
      pet1 = val.replace('1. ', '');
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      pet2 = val.replace('2. ', '');
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      pet3 = val.replace('3. ', '');
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      pet4 = val.replace('4. ', '');
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      pet5 = val.replace('5. ', '');
      break;
    }
  }

  const emailExp = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');

  if ((!email || !emailExp.test(email)) || (!pet1 && !pet2 && !pet3 && !pet4 && !pet5)) {
    core.info('empty');
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: errBody,
    });

    await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: issueNumber,
      name: 'auto invited'
    });

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: ['need accurate info']
    });
  } else {
    core.info('Inviting ~~~~');
    if (pet1) { await invitePeople(email, pet1); }
    if (pet2) { await invitePeople(email, pet2); }
    if (pet3) { await invitePeople(email, pet3); }
    if (pet4) { await invitePeople(email, pet4); }
    if (pet5) { await invitePeople(email, pet5); }
    core.info('Adding a comment');
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: issueBody,
    });

    core.info('Closing issue');
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed'
    });
  }
};

async function invitePeople(email, pet) {
  let org = getPetFullName(pet);
  if (org) {
    await octokit.orgs.createInvitation({
      org,
      email,
      role: 'direct_member'
    });
    core.info(`Auto invited ${org}`);
  } else {
    core.info(`Get ${pet} fullName error!`);
    return false;
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

function getPetFullName(name) {
  let r = organizations.find(o => o.name === name);
  return r ? r.fullName : null;
};

(async () => {
  await getOrganizations();
  await main();
})();
