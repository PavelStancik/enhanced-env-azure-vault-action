# Enhanced ENV Azure Vault Action

This action gets secrets from Azure Vault as ENV parameters for specific environment and type.
It depends on Enhanced ENV Azure Vault NPM package, which prepares data for Azure Key Vault based on environment [staging / testing / production] and type [ Backend / Frontend / ..]
## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/hello-world-javascript-action@main
with:
  who-to-greet: 'Mona the Octocat'
```
