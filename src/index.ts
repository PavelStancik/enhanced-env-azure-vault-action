import * as core from '@actions/core';

const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI') || process.env.KEY_VAULT_URI;
process.env['KEY_VAULT_URI'] = KEY_VAULT_URI;

import * as manager from "enhanced-env-azure-vault";

const underscoreReplacedBy = "0x";

const environment = [ 'STAGE', 'TEST', 'PROD' ];
const typeVariant = [ 'frontend', 'backend', 'both' ];


const preparation = async (proposedEnvironment: string, proposedType: string ) => {

  //Check proposed Environment [ TEST / STAGE / PROD ]

  if (!environment.includes(proposedEnvironment)) {
    throw new Error("Environment parameter set incorrectly, choose one of [TEST | STAGE | PROD].");
  }
  if (!typeVariant.includes(proposedType)) {
    throw new Error("Type parameter set incorrectly, choose one of [frontend | backend | both].");
  }
  const prefix: string = proposedEnvironment; 
  const type: string = proposedType;
  let arrJson: {}[] = [];
  let tfvars: string[] = [];

  const azureParameters = await manager.listAll(prefix, type); 

  console.log(`Setting ENV params for environment: ${prefix} and type: ${type}:`);
  azureParameters.map( secretObject => {
    if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type === type) {

      const obj:{} = {};
      
      core.exportVariable(secretObject.name, secretObject.value);
      core.setSecret(secretObject.value);

      obj['name'] = secretObject.name;
      obj['value'] = secretObject.value;
      obj['slotSetting'] = false;

      arrJson.push(obj);
      
    }
  })

  const terraformParameters = await manager.listAll(prefix);

  terraformParameters.map( secretObject => {
    if (secretObject.enabled && secretObject.environment === prefix) {
      core.setSecret(secretObject.value);
      tfvars.push(` ${secretObject.name} = ${secretObject.value}`);
console.log(` ${secretObject.name} = ${secretObject.value}`);
    }

  })

  core.setOutput("json", JSON.stringify(arrJson, null));

  core.setOutput("terraform", prepareTfVars(tfvars));

};

const prepareTfVars = (tfvars: string[]) => {
  return `web_app_settings = {${tfvars}}`
}


const e  = core.getInput('ENVIRONMENT') || process.env.ENVIRONMENT;
const t  = core.getInput('TYPE') || process.env.TYPE;

preparation(e,t)
.catch( err => console.error('> ERROR in parameters: ', err ));
