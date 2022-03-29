require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const {
  GH_TOKEN: githubToken,
  ISSUE_NUMBER,
} = process.env;
const issueNumber = ISSUE_NUMBER || 127;

const errBody = `🚨 The format of the application issue does not match, please check **email** or **pets list**.

🚨 申请 Issue 格式不符，请检查 **邮箱** 或 **宠物列表**。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`;

const octokit = new Octokit({
  auth: `token ${githubToken}`,
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

  const creator = res.data.user.login;

  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    creator,
    state: 'all'
  })

  if (issues.length > 1) {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `Please do not apply again, thank you for your cooperation! \n\n 请勿重复申请，谢谢配合！若想申请多个，请在此 issue 里评论提出申请！`,
    });
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed'
    });
    return false
  }

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
      if (pet1) {
        if (getPetFullName(pet1)) {
          userNowApp += 1;
          console.log(`Get 1 ${pet1}`);
        } else {
          console.log(`Get ${pet1} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      pet2 = val.replace('2.', '').trim();
      if (pet2) {
        if (getPetFullName(pet2)) {
          userNowApp += 1;
          console.log(`Get 2 ${pet1}`);
        } else {
          console.log(`Get ${pet2} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      pet3 = val.replace('3.', '').trim();
      if (pet3) {
        if (getPetFullName(pet3)) {
          userNowApp += 1;
          console.log(`Get 3 ${pet1}`);
        } else {
          console.log(`Get ${pet3} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      pet4 = val.replace('4.', '').trim();
      if (pet4) {
        if (getPetFullName(pet4)) {
          userNowApp += 1;
          console.log(`Get0 4 ${pet1}`);
        } else {
          console.log(`Get ${pet4} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      pet5 = val.replace('5.', '').trim();
      if (pet5) {
        if (getPetFullName(pet5)) {
          userNowApp += 1;
          console.log(`Get 5 ${pet1}`);
        } else {
          console.log(`Get ${pet5} full err`);
          userNowApp = 0;
          break;
        }
      }
      break;
    }
  }

  // const emailExp = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');

  if (!email || (userNowApp === 0)) {
    console.log(`Error: check application field!`);
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
    console.log(`Success: check application success!`);
    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: ['auto invited']
    });
  }
};

async function getOrganizations() {
  try {
    const res = await axios.get(url);
    organizations = res.data.data;
  } catch(err) {
    console.log('Error: get org error!')
    console.log(err);
  }
};

function getPetFullName(name) {
  let r = organizations.find(o => o.name === name);
  return r ? r.fullName : null;
};

(async () => {
  console.log(`Begin: check application begin!`);
  await getOrganizations();
  await main();
  console.log(`End: check application end!`);
})();
