import * as core from '@actions/core';
import * as github from '@actions/github';

const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI');
process.env['KEY_VAULT_URI'] = KEY_VAULT_URI;

import * as manager from "enhanced-env-azure-vault";

const underscoreReplacedBy = "0x";

const environment = [ 'STAGE', 'TEST', 'PROD' ];
const typeVariant = [ 'frontend', 'backend' ];


const preparation = async (proposedEnvironment: string, proposedType: string ) => {

  //Check proposed Environment [ TEST / STAGE / PROD ]

  if (!environment.includes(proposedEnvironment)) {
    throw new Error("Environment parameter set incorrectly, choose one of [TEST | STAGE | PROD].");
  }
  if (!typeVariant.includes(proposedType)) {
    throw new Error("Type parameter set incorrectly, choose one of [frontend | backend].");
  }
  const prefix = proposedEnvironment; 
  const type = proposedType;
  
  const azureParameters = await manager.listAll(prefix, type); 

  console.log(`Setting ENV params for environment: ${prefix} and type: ${type}:`);
  azureParameters.map( secretObject => {
    if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type === type) {
      //console.log(`For this environment: ${prefix} and type: ${type} we have this ENV: ${secretObject.name} = ${(secretObject.value).substr(0,5)}****`);
      core.exportVariable(secretObject.name, secretObject.value);
      core.setSecret(secretObject.value);
    }
  })

};


const e  = core.getInput('ENVIRONMENT');
const t  = core.getInput('TYPE');

preparation(e,t)
.catch( err => console.error('> ERROR in parameters: ', err.message ));
