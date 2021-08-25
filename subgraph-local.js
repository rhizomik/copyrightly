const Web3 = require('web3');
const fs = require('fs');
const YAML = require('yaml');

let TRUFFLE_CONFIG = require('./truffle-config');
let localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' + TRUFFLE_CONFIG.networks.development.port;
const manifestations = require('./src/assets/contracts/Manifestations.json');
const uploadEvidence = require('./src/assets/contracts/UploadEvidence.json');
const clytoken = require('./src/assets/contracts/CLYToken.json');
this.web3 = new Web3(new Web3.providers.WebsocketProvider(localNode));

const file = fs.readFileSync('./subgraph.yaml', { encoding: 'utf8' })

this.web3.eth.net.getId()
  .then((networkId) => {
    console.log('Current network id:', networkId);
    let manifestationsAddress = manifestations.networks[networkId].address;
    console.log('Manifestations at:', manifestationsAddress);
    let uploadEvidenceAddress = uploadEvidence.networks[networkId].address;
    console.log('UploadEvidence at:', uploadEvidenceAddress);
    let clytokenAddress = clytoken.networks[networkId].address;
    console.log('CLYToken at:', clytokenAddress);
    let subgraph = YAML.parse(file);
    subgraph.dataSources = subgraph.dataSources.map(datasource => {
      datasource.network = 'mainnet';
      datasource.source.startBlock = 0;
      if (datasource.name === 'Manifestations') {
        datasource.source.address = manifestationsAddress;
      } else if (datasource.name === 'UploadEvidence') {
        datasource.source.address = uploadEvidenceAddress;
      } else if (datasource.name === 'CLYToken') {
        datasource.source.address = clytokenAddress;
      }
      return datasource;
    });
    fs.writeFile('./subgraph-local.yaml',
      YAML.stringify(subgraph, { defaultStringType: 'QUOTE_SINGLE', lineWidth: 0 }),
      { encoding: 'utf8' }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Updated subgraph manifest written to: subgraph-local.yaml')
      }
      process.exit();
    } )
  });
