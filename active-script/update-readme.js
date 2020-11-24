// node ./active-script/update-readme.js
const { readFileSync, writeFileSync } = require('fs');
const axios = require('axios');
const { format } = require('prettier');
const { stripIndent } = require('common-tags');

const url = 'https://raw.githubusercontent.com/zoo-js/zoo-data/main/json/organizations.json';

var orgs = [];  // 总
var animal = [];
var food = [];
var natural = [];
var life = [];
var technology = [];

function main() {
  const baseReadme = readFileSync('./base/README.base.md', { encoding:'utf8', flag:'r' });
  const baseReadmeEn = readFileSync('./base/README.en-US.base.md', { encoding:'utf8', flag:'r' });

  if (orgs.length == 0) {
    console.log(`orgs 0`);
    return false;
  }

  for (let i = 0; i < orgs.length; i++) {
    if (orgs[i].type === 'animal') {
      animal.push(orgs[i])
    }
    if (orgs[i].type === 'food') {
      food.push(orgs[i])
    }
    if (orgs[i].type === 'natural') {
      natural.push(orgs[i])
    }
    if (orgs[i].type === 'life') {
      life.push(orgs[i])
    }
    if (orgs[i].type === 'technology') {
      technology.push(orgs[i])
    }
  }

  animal = animal.sort((a, b) => a.name.localeCompare(b.name));
  food = food.sort((a, b) => a.name.localeCompare(b.name));
  natural = natural.sort((a, b) => a.name.localeCompare(b.name));

  const animalTable = getContent(animal);
  const foodTable = getContent(food);
  const naturalTable = getContent(natural);
  const lifeTable = getContent(life);
  const technologyTable = getContent(technology);

  // cn
  let newReadme = baseReadme.replace('UPDATE_README_NUMBER', orgs.length);
  newReadme = newReadme.replace('UPDATE_TECHNOLOGY_TABLE', `<table>${technologyTable}</table>`);
  newReadme = newReadme.replace('UPDATE_LIFE_TABLE', `<table>${lifeTable}</table>`);
  newReadme = newReadme.replace('UPDATE_ANIMAL_TABLE', `<table>${animalTable}</table>`);
  newReadme = newReadme.replace('UPDATE_FOOD_TABLE', `<table>${foodTable}</table>`);
  newReadme = newReadme.replace('UPDATE_NATURAL_TABLE', `<table>${naturalTable}</table>`);
  const newReadmeFormatted = format(newReadme, {
    parser: 'markdown',
  });
  writeFileSync('./README.md', newReadmeFormatted);
  console.log(`🎉 Done readme`);

  // en
  let newReadmeEn = baseReadmeEn.replace('UPDATE_README_NUMBER', orgs.length);
  newReadmeEn = newReadmeEn.replace('UPDATE_TECHNOLOGY_TABLE', `<table>${technologyTable}</table>`);
  newReadmeEn = newReadmeEn.replace('UPDATE_LIFE_TABLE', `<table>${lifeTable}</table>`);
  newReadmeEn = newReadmeEn.replace('UPDATE_ANIMAL_TABLE', `<table>${animalTable}</table>`);
  newReadmeEn = newReadmeEn.replace('UPDATE_FOOD_TABLE', `<table>${foodTable}</table>`);
  newReadmeEn = newReadmeEn.replace('UPDATE_NATURAL_TABLE', `<table>${naturalTable}</table>`);
  const newReadmeEnFormatted = format(newReadmeEn, {
    parser: 'markdown',
  });
  writeFileSync('./README.en-US.md', newReadmeEnFormatted);
  console.log(`🎉 Done readme-us`);
};

function getContent (organizations) {
  let content = '';
  let row = organizations.length / 6;
  let lastNo = organizations.length % 6;
  if (lastNo != 0) row += 1;
  for (let j = 1; j <= row; j++) {
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
  return content;
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
  try {
    const res = await axios.get(url);
    orgs = res.data.data;
  } catch(err) {
    console.log(err);
  }
};

(async () => {
  await getOrganizations();
  main();
})();
