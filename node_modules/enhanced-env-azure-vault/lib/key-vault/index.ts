import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const url = process.env.KEY_VAULT_URI;
const credential = new DefaultAzureCredential();
const client = new SecretClient(url, credential);

export { client };