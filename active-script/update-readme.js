// node ./active-script/update-readme.js
const { readFileSync, writeFileSync } = require('fs');
const axios = require('axios');
const { format } = require('prettier');
const { stripIndent } = require('common-tags');

const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';
var organizations = [];

function main() {
  const baseReadme = readFileSync('./base/README.base.md', { encoding:'utf8', flag:'r' });
  const baseReadmeEn = readFileSync('./base/README.en-US.base.md', { encoding:'utf8', flag:'r' });
  if (organizations.length == 0) {
    console.log(`❌ Get organizations error`);
    return false;
  }
  let content = '';
  let row = organizations.length / 6;
  const lastNo = organizations.length % 6;
  if (lastNo != 0) row += 1;
  for (var j = 1; j <= row; j++ ) {
    let data = '';
    data = stripIndent`
      <tr>
        <td align="center">${getFullName(organizations[(j-1)*6])}</td>
        <td align="center">${getFullName(organizations[(j-1)*6+1])}</td>
        <td align="center">${getFullName(organizations[(j-1)*6+2])}</td>
        <td align="center">${getFullName(organizations[(j-1)*6+3])}</td>
        <td align="center">${getFullName(organizations[(j-1)*6+4])}</td>
        <td align="center">${getFullName(organizations[(j-1)*6+5])}</td>
      </tr>
      <tr>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6])}</td>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6+1])}</td>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6+2])}</td>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6+3])}</td>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6+4])}</td>
        <td width="160" align="center">${getCnName(organizations[(j-1)*6+5])}</td>
      </tr>
    `;
    content += data
  }

  let newReadme = baseReadme.replace('UPDATE_README_NUMBER', organizations.length);
  newReadme = newReadme.replace('UPDATE_README_TABLE', `<table>${content}</table>`);
  const newReadmeFormatted = format(newReadme, {
    parser: 'markdown',
  });
  writeFileSync('./README.md', newReadmeFormatted);
  console.log(`🎉 Done readme`);

  let newReadmeEn = baseReadmeEn.replace('UPDATE_README_NUMBER', organizations.length);
  newReadmeEn = newReadmeEn.replace('UPDATE_README_TABLE', `<table>${content}</table>`);
  const newReadmeEnFormatted = format(newReadmeEn, {
    parser: 'markdown',
  });
  writeFileSync('./README.en-US.md', newReadmeEnFormatted);
  console.log(`🎉 Done readme-us`);
};

function getFullName(pet) {
  if (pet) {
    return `<a href="https://github.com/${pet.fullName}" target="_blank"><img src="https://avatars0.githubusercontent.com/u/${pet.code}?s=200&v=4" width="50" /></a>`;
  }
  return '';
};

function getCnName(pet) {
  if (pet) {
    return `${pet.name}<br />${pet.cnName}`;
  }
  return '';
};

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
