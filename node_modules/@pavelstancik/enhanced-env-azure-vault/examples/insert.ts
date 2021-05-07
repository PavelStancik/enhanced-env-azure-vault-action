import * as manager from '../index';
/**
 * Uploads ENV parameters with appropriate tags to the Azure Kaz Vault
 */

const envKeys = [

    { name: 'API_URL', value: 'AA', tags: { environment: 'testing', type: 'backend' } },
    { name: 'API_URL_FE', value: 'AA', tags: { environment: 'testing', type: 'frontend' } }

    // Any other variables
];

const underscoreReplacedBy = '0x';
const prefix = 'TEST';

const setEnv = async (): Promise<void> => {

    console.log('Getting ENV params from Azure Key Vault');
    await manager.setup({ envKeys, underscoreReplacedBy, prefix });

};

setEnv();
