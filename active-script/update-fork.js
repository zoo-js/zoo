require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const {
  GH_TOKEN: githubToken,
} = process.env;

const octokit = new Octokit({ auth: `token ${githubToken}` });

const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';
let organizations = [];

const repo = 'zoo';

async function main() {
  if (organizations.length == 0) {
    console.log('org 0');
    return false;
  }

  for (let i = 0; i < organizations.length; i++) {
    let owner = organizations[i].fullName
    await octokit.repos.delete({
      owner,
      repo
    })
    await octokit.repos.createFork({
      owner: 'zoo-js',
      repo,
      organization: owner
    })
    console.log(`${owner} done`)
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
  await getOrganizations();
  await main();
})();
