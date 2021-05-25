# Enhanced ENV Azure Vault Action

This action gets secrets from Azure Vault as ENV parameters for specific environment and type.
It depends on Enhanced ENV Azure Vault NPM package, which prepares data for Azure Key Vault based on environment [staging / testing / production] and type [ Backend / Frontend / ..].
See https://www.npmjs.com/package/enhanced-env-azure-vault
## Inputs

### `KEY_VAULT_URI`

**Required** URL to the Azure Key Vault.

### `ENVIRONMENT`

**Required** One of [TEST | STAGE | PROD] environments, for which the Azure Secrets wil be downloaded.

### `TYPE`

**Required** One of [frontend | backend] type of secret, stored in Azure Kez Vault as secret.

## Outputs

### `env`

Environment parameters, you can see them in your Action job as `${{ env.xxxx }}`

### `json`

The JSON structure of App Service setting (You normally find in AppService - Setting - Configuration in your Azure).   
This could be used by `Azure/appservice-settings@v1` action.

### `terraform`

The Hashicorp Terraform `tfvars.json` structure as `portal_app_settings_secrets` object.   
This could be used by `hashicorp/setup-terraform@v1.2.1` action.

## Example usage

```yaml
- name: Login via Az module
  uses: azure/login@v1
    with:
      creds: ${{ secrets.AZ_LOGIN_CREDENTIALS }}
      enable-AzPSSession: false

- name: Get the secrets
  uses: PavelStancik/enhanced-env-azure-vault-action@v1.0.10
  with:
    KEY_VAULT_URI: ${{ secrets.KEY_VAULT_URI }}
    ENVIRONMENT: TEST
    TYPE: frontend
  id: aenv

#This is just for zou to see the output, this is just printing output
- name: Get the output variables as standard ENV
  run: |
    echo "***************************************"
    echo $json_var | jq '.[].name'
    echo "***************************************"
    echo $json_var | jq
  env:
    json_var: ${{ steps.aenv.outputs.json}}

#This sets the Azure App Service settings
- name: Set Web App Settings
  uses: Azure/appservice-settings@v1
  with:
    app-name: ${{ env.AZURE_WEBAPP_NAME }}
    mask-inputs: false
    app-settings-json: ${{ steps.aenv.outputs.json}}

#This creates file for Terraform in ../terraform dir
- name: Set the ENV as tfvars
  working-directory: terraform
  run: |
    echo $terraform_var > ./terraform.tfvars.json   
  env:
    terraform_var: ${{ steps.aenv.outputs.terraform}}
  
```

The structure of variable.tf is:
```yaml
variable "web_app_settings" {
  type      = map(map(string))
  default   = { "eun" = { "Hello" = "World" } }
  sensitive = true
}
```

After deploy do not forget to remove the `terraform.tfvars.json` file for security reasons:
```yaml
      # Create/Destroy infrastructure
      - name: Create/Destroy infrastructure
        working-directory: terraform
        run: |
          terraform init -input=false
          terraform plan -out=tfplan -input=false
          terraform apply -input=false tfplan
          rm ./terraform.tfvars.json
          rm ./tfplan

```

The structure:
```json
{ 
  "web_app_settings": {
  "frontend": {
    "WEBSITES_PORT": "3000",
    "WEBSITES_URL": "http://localhost"
    }  
  }
}
```
Assigning in Terraform:
```yaml
  app_settings = var.web_app_settings[frontend]
```
