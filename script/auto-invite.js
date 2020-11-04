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

const issueBody = `🎉 Hi, @${issueAuth}. Already invited, please check your email.
<!-- Created by GitHub Actios. -->
`;

const octokit = new Octokit({ auth: `token ${githubToken}` });

const owner = 'zoo-js';
const repo = 'zoo';
const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';
let organizations = [];

async function main() {
  const res = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber
  });

  const targetArr = res.data.pop().body.split('\r\n');
  const email = targetArr[0];
  const pets = targetArr.slice(1);
  for (var i = 0; i < pets.length; i++) {
    let fullName = getPetFullName(pets[i]);
    console.log(fullName)
    await octokit.orgs.createInvitation({
      org: fullName,
      email,
      role: 'direct_member'
    })
    core.info(`Auto invited ${fullName}`);
  }

  core.info('Adding a comment');
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: issueBody,
  })
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
