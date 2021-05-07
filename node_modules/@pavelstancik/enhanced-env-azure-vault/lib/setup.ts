import { client } from "./key-vault";

interface environmentParams {

    [x: string]: any;
    name: string;
    value: string;
    tags: {
        environment: string;
        type: string;
    };
}[];

interface setupOptions {
    envKeys: environmentParams | any[],
    underscoreReplacedBy: string,
    prefix: string
}

/**
 * Setup environment variables in key-vault.
 *
 * @param envKeys
 * @param underscoreReplacedBy
 * @param prefix
 * @returns {Promise<void>}
 */
async function setup ({
    envKeys = [],
    underscoreReplacedBy = '0x',
    prefix = ''
} : setupOptions ): Promise<void> {

    console.log('set up env: starting...');

    const envFieldsArray = [];

    envKeys.forEach(element => {

        envFieldsArray.push({
            name: element.name,
            value: element.value,
            tags: element.tags
        });

    });

    for (const item of envFieldsArray) {

        const stripped = item.name.split('_').join(underscoreReplacedBy);
        const secretName = `${prefix}-${stripped}`;
        const value = item.value;
        const tags = item.tags;

        await client.setSecret(secretName, value, { tags });
        console.log(`${secretName} ===> saved`);

    }

    console.log('set up env: completed.');

}

export { setup };
