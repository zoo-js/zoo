require('dotenv').config();
const core = require('@actions/core')
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const {
  GH_TOKEN: githubToken,
  ISSUE_AUTH,
  ISSUE_NUMBER,
} = process.env;
const issueAuth = ISSUE_AUTH || 'xrkffgg';
const issueNumber = ISSUE_NUMBER || 48;

const issueBody = `🎉 Hi, @${issueAuth}. The invitation has been sent to the specified email address, please check!

🎉 你好，@${issueAuth}。邀请已发送到指定邮箱，请查收！

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
  var email;

  for (var i = 0; i < targetArr.length; i++) {
    let val = targetArr[i];

    if (val.startsWith('GitHub Email:')) {
      email = val.replace('GitHub Email: ', '');
    }
    if (email && val.startsWith('1.') && val.length > 3) {
      let pet = val.replace('1. ', '');
      if (pet) { await invitePeople(email, pet); }
    }
    if (email && val.startsWith('2.') && val.length > 3) {
      let pet = val.replace('2. ', '');
      if (pet) { await invitePeople(email, pet); }
    }
    if (email && val.startsWith('3.') && val.length > 3) {
      let pet = val.replace('3. ', '');
      if (pet) { await invitePeople(email, pet); }
    }
    if (email && val.startsWith('4.') && val.length > 3) {
      let pet = val.replace('4. ', '');
      if (pet) { await invitePeople(email, pet); }
    }
    if (email && val.startsWith('5.') && val.length > 3) {
      let pet = val.replace('5. ', '');
      if (pet) { await invitePeople(email, pet); }
      break;
    }
  }

  core.info('Adding a comment');
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: issueBody,
  });
};

async function invitePeople(email, pet) {
  let org = getPetFullName(pet);
  await octokit.orgs.createInvitation({
    org,
    email,
    role: 'direct_member'
  });
  core.info(`Auto invited ${org}`);
};

async function getOrganizations() {
  await axios.get(url).then(res =>{
    organizations = res.data.data
  },rej => {
    core.info(`Get Org ${rej}`);
  }).catch(err =>{
    core.info(`Get Org ${err}`);
  })
};

function getPetFullName(name) {
  let r = organizations.find(o => o.name === name);
  return r ? r.fullName : null;
};

(async () => {
  await getOrganizations();
  await main();
})();
