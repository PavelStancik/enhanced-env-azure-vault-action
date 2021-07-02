import * as manager from '../index';

/**
 * Gets environment variables out of Azure Key Vault
 */

const getEnv = async (tagType: string = '', prefix: string = '') => {

    console.log('Getting ENV params from Azure Key Vault');
    const result = await manager.listAll(prefix, tagType,'0x');
    result.forEach(element => {

        console.log(`${element.name}: ${element.value}`);
        
        if (element.tags) {

            console.log(' tag environment:', element.tags.environment);
            console.log(' tag type:', element.tags.type);
            console.log(' whole:', element);

        }

    });

};

//getEnv('frontend', 'TEST').then((res) => console.log("Done."));
getEnv('', 'STAGE').then((res) => console.log("Done."));
getEnv().then((res) => console.log("Done."));