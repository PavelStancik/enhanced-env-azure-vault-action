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
    throw new Error("Type parameter set incorrectly, choose one of [frontend | backend.");
  }
  const prefix: string = proposedEnvironment; 
  const type: string = proposedType;
  let arrJson: {}[] = [];
  let tfvars_frontend: string[] = [];
  let tfvars_backend: string[] = [];

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
    if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type !== undefined) {
      
      //core.setSecret(secretObject.value);
      secretObject.value = (secretObject.value).replace(/\\/g, "\\\\");

      if (secretObject.tags.type === 'frontend') tfvars_frontend.push(` "${secretObject.name}":"${secretObject.value}" `);
      if (secretObject.tags.type === 'backend') tfvars_backend.push(` "${secretObject.name}":"${secretObject.value}" `);

    }

  })

  core.setOutput("json", JSON.stringify(arrJson, null));
  core.setOutput("terraform", prepareTfVars(tfvars_frontend,tfvars_backend));

};

const prepareTfVars = (frontend: string[], backend: string[]) => {
  
  let return_object = `{ "web_app_settings": {\
    `;
  return_object = return_object.concat(` "frontend": { ${frontend} }, `);
  return_object = return_object.concat(` "backend": { ${backend} } } }`);
  return return_object;
}


const e  = core.getInput('ENVIRONMENT') || process.env.ENVIRONMENT;
const t  = core.getInput('TYPE') || process.env.TYPE;

preparation(e,t)
.catch( err => console.error('> ERROR in parameters: ', err ));
