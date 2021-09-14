const fs = require('fs');
const YAML = require('yaml');

let TRUFFLE_CONFIG = require('./truffle-config');
const manifestations = require('./src/assets/contracts/Manifestations.json');
const uploadEvidence = require('./src/assets/contracts/UploadEvidence.json');
const clytoken = require('./src/assets/contracts/CLYToken.json');

const file = fs.readFileSync('./subgraph.yaml', { encoding: 'utf8' })

const networkId = TRUFFLE_CONFIG.networks.viviani.network_id;

console.log('Current network id:', networkId);
let manifestationsAddress = manifestations.networks[networkId].address;
console.log('Manifestations at:', manifestationsAddress);
let uploadEvidenceAddress = uploadEvidence.networks[networkId].address;
console.log('UploadEvidence at:', uploadEvidenceAddress);
let clytokenAddress = clytoken.networks[networkId].address;
console.log('CLYToken at:', clytokenAddress);
let subgraph = YAML.parse(file);
subgraph.dataSources = subgraph.dataSources.map(datasource => {
  datasource.network = 'viviani';
  datasource.source.startBlock = 13029212;
  if (datasource.name === 'Manifestations') {
    datasource.source.address = manifestationsAddress;
  } else if (datasource.name === 'UploadEvidence') {
    datasource.source.address = uploadEvidenceAddress;
  } else if (datasource.name === 'CLYToken') {
    datasource.source.address = clytokenAddress;
  }
  return datasource;
});
fs.writeFile('./subgraph-viviani.yaml',
  YAML.stringify(subgraph, { defaultStringType: 'QUOTE_SINGLE', lineWidth: 0 }),
  { encoding: 'utf8' }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Updated subgraph manifest written to: subgraph-viviani.yaml')
  }
  process.exit();
});
