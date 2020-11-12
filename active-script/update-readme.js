// node ./active-script/update-readme.js
const fs = require('fs');
const axios = require('axios');

const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';
var organizations = [];

function main() {
  const baseReadme = readFileSync('./README.base.md', { encoding:'utf8', flag:'r' });
  const baseReadmeEn = readFileSync('./README.en-US.base.md', { encoding:'utf8', flag:'r' });
  let content = '';

}

async function getOrganizations() {
  await axios.get(url).then(res =>{
    organizations = res.data.data;
  },rej => {
    console.log(rej);
  }).catch(err =>{
    console.log(err);
  })
};

(async () => {
  await getOrganizations();
  main();
})();