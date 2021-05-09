# Enhanced ENV Azure Vault Action

This action gets secrets from Azure Vault as ENV parameters for specific environment and type.
It depends on Enhanced ENV Azure Vault NPM package, which prepares data for Azure Key Vault based on environment [staging / testing / production] and type [ Backend / Frontend / ..]
See https://www.npmjs.com/package/enhanced-env-azure-vault
## Inputs

### `key_vault_uri`

**Required** URL to the Azure Key Vault.

### `environment`

**Required** One of [TEST | STAGE | PROD] environments, for which the Azure Secrets wil be downloaded.

### `type`

**Required** One of [frontend | backend] type of secret, stored in Azure Kez Vault as secret.

## Outputs

### `env`

Environment parameters

## Example usage

```yaml
- name: Login via Az module
  uses: azure/login@v1
    with:
      creds: ${{ secrets.AZ_LOGIN_CREDENTIALS }}
      enable-AzPSSession: false

- name: Get the secrets
  uses: actions/enhanced-env-azure-vault@v1.2.0
    with:
      key_vault_uri: ${{ secrets.KEY_VAULT_URI }}
      environment: TEST
      type: frontend
    id: env
```
