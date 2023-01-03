const fs = require('fs');
const YAML = require('yaml');

let TRUFFLE_CONFIG = require('./truffle-config');
const manifestations = require('./src/assets/contracts/Manifestations.json');
const uploadEvidence = require('./src/assets/contracts/UploadEvidence.json');
const clytoken = require('./src/assets/contracts/CLYToken.json');
const youTubeEvidence = require('./src/assets/contracts/YouTubeEvidence.json');
const clynft = require("./src/assets/contracts/CopyrightLYNFT.json");

const file = fs.readFileSync('./subgraph.yaml', { encoding: 'utf8' })

const networkId = TRUFFLE_CONFIG.networks.goerli.network_id;

console.log('Current network id:', networkId);
let manifestationsAddress = manifestations.networks[networkId].address;
console.log('Manifestations at:', manifestationsAddress);
let uploadEvidenceAddress = uploadEvidence.networks[networkId].address;
console.log('UploadEvidence at:', uploadEvidenceAddress);
let clytokenAddress = clytoken.networks[networkId].address;
console.log('CLYToken at:', clytokenAddress);
let youTubeEvidenceAddress = youTubeEvidence.networks[networkId].address;
console.log('YouTubeEvidence at:', youTubeEvidenceAddress);
let clynftAddress = clynft.networks[networkId].address;
console.log('CopyrightLYNFT at:', clynftAddress);
let subgraph = YAML.parse(file);
subgraph.dataSources = subgraph.dataSources.map(datasource => {
  datasource.network = 'goerli';
  datasource.source.startBlock = 8249738;
  if (datasource.name === 'Manifestations') {
    datasource.source.address = manifestationsAddress;
  } else if (datasource.name === 'UploadEvidence') {
    datasource.source.address = uploadEvidenceAddress;
  } else if (datasource.name === 'CLYToken') {
    datasource.source.address = clytokenAddress;
  } else if (datasource.name === 'YouTubeEvidence') {
    datasource.source.address = youTubeEvidenceAddress;
  } else if (datasource.name === 'CopyrightLYNFT') {
    datasource.source.address = clynftAddress;
  }
  return datasource;
});
fs.writeFile('./subgraph-goerli.yaml',
  YAML.stringify(subgraph, { defaultStringType: 'QUOTE_SINGLE', lineWidth: 0 }),
  { encoding: 'utf8' }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Updated subgraph manifest written to: subgraph-goerli.yaml')
    }
    process.exit();
  });
