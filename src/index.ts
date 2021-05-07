import * as core from '@actions/core';
import * as github from '@actions/github';
import * as manager from "@pavelstancik/enhanced-env-azure-vault";

/*
try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
*/

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
  
/*
1, Based on Environment and 
2, Based on tzyep, get all secrets from Azure vault and
3, inject ENV into GH Action
*/

  const azureParameters = await manager.listAll(prefix, type); 

  azureParameters.map( secretObject => {
    if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type === type) {
      console.log(`For this environment: ${prefix} and type: ${type} we have this ENV: ${secretObject.name} = ${secretObject.value}`);
    }
  })

};

const e  = core.getInput('environment');
const t  = core.getInput('type');

preparation(e,t)
.catch( err => console.error('> ERROR in parameters: ', err.message ));
