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

  const targetArr = res.data.body.split('\r\n');
  var email, pet1, pet2, pet3, pet4, pet5;
  let userNowApp = 0; // user application number

  for (var i = 0; i < targetArr.length; i++) {
    let val = targetArr[i];

    if (val.startsWith('GitHub Email:')) {
      email = val.replace('GitHub Email: ', '');
    } else {
      console.log('Error: email is empty!')
    }

    if (email && val.startsWith('1.') && val.length > 3) {
      pet1 = val.replace('1. ', '');
      if (pet1) {
        if (getPetFullName(pet1)) {
          userNowApp += 1; 
        } else {
          console.log(`Get ${pet1} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      pet2 = val.replace('2. ', '');
      if (pet2) {
        if (getPetFullName(pet2)) {
          userNowApp += 1; 
        } else {
          console.log(`Get ${pet2} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      pet3 = val.replace('3. ', '');
      if (pet3) {
        if (getPetFullName(pet3)) {
          userNowApp += 1; 
        } else {
          console.log(`Get ${pet3} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      pet4 = val.replace('4. ', '');
      if (pet4) {
        if (getPetFullName(pet4)) {
          userNowApp += 1; 
        } else {
          console.log(`Get ${pet4} full err`);
          userNowApp = 0;
          break;
        }
      }
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      pet5 = val.replace('5. ', '');
      if (pet5) {
        if (getPetFullName(pet5)) {
          userNowApp += 1; 
        } else {
          console.log(`Get ${pet5} full err`);
          userNowApp = 0;
          break;
        }
      }
      break;
    }
  }

  const emailExp = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');

  if (!email || !emailExp.test(email) || (userNowApp === 0)) {
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
