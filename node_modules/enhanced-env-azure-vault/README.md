enhanced-env-azure-vault
========================
Managing environment variables using Azure Key Vault tags.

### Problem
When your application has many environment variables, they 
become difficult to manage. 

Sharing long env file with team members and then sharing again when updating them is a difficult task.
Managing multiple environemnt (local, demo, staging, production,...) again introduces some more challenges.

### Solution
If you are already using azure, manage your environment variables using key vault. It's a good service with many
benefits. [(learn more)](https://azure.microsoft.com/en-us/services/key-vault/)
- create a azure key vault.
- create a service principal with access to above key vault.
- use this package to set up and load env.

### Installation

```npm
npm install enhanced-env-azure-vault
```
or
```yarn
yarn add enhanced-env-azure-vault
```
### Usage
Send all your environment variables to your azure key vault.

Setup process is described in /examples/insert.ts.

```javascript

// enhanced-env-azure-vault expects the following environment variables
// KEY_VAULT_URI: The keyvault uri in Azure
// AZURE_TENANT_ID: The tenant ID in Azure Active Directory
// AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
// AZURE_CLIENT_SECRET: The client secret for the registered application

import * as manager from 'enhanced-env-azure-vault';

// Your environment variables.
const envKeys = [

    { name: 'API_URL', value: 'AA', tags: { environment: 'testing', type: 'backend' } },
    { name: 'API_URL_FE', value: 'AA', tags: { environment: 'staging', type: 'frontend' } }

    // Any other variables
];

const result = await manager.setup({ envKeys });

```

### Load Variables in your app.
 
```javascript
import * as manager from 'enhanced-env-azure-vault';
const result = await manager.init({ envKeys });

```
  
### Getting all Variables from Azure, based on tags. 

```javascript
const scanVault = async (): Promise<secretObject[]> => {
  return await manager.listAll();
};

scanVault()
  .then(async (res) => {
    await res.forEach((element) => {
      if (element.tags && element.tags.type === "backend") {
        console.log(element);
        getEnv(element.name).then((env) => console.log(process.env));
      }
    });
  })
  .then((env) => console.log(env))
  .catch((err) => {
    console.log("Error scanning Azure Vault: ", err);
  });

// Now we can distinguish for example [testing / staging / production] environments
// AND type: [backend / frontend]
// OR utilize any other tag patterns 
```