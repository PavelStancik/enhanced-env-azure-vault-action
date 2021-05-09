import ProgressBar from "progress";
import { client }  from "./key-vault/index";

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
 * Load all environment variables from key-vault.
 *
 * @param envKeys
 * @param underscoreReplacedBy
 * @returns {Promise<void>}
 */
async function init ({
    envKeys = [],
    underscoreReplacedBy = '0x',
    prefix
}: setupOptions ): Promise<void> {

    const envPrefix = `${prefix}-`;
    const keys = Object.keys(envKeys).map(key => {

        return {
            name: key,
            secretName: envPrefix+key.split('_').join(underscoreReplacedBy)
        };

    });

    try {

        const bar = new ProgressBar('setting up environment [:bar] :current of :total', {
            total: Object.keys(envKeys).length
        });

        await Promise.all(keys.map(async (key, index) => {

            try {

                const result = await client.getSecret(key.secretName);

                if (!process.env[key.name]) {

                    process.env[key.name] = result.value;

                } else {

                    console.debug(`process.env.${key.name} already exists. skipping...`);

                }

                bar.tick();

            } catch (error) {

                if (error && error.statusCode === 404) {

                    throw new Error(`secret not found: ${key.name}.`);

                }

            }

        }));

    } catch (error) {

        console.error(error);
        console.error('process.env setup failed');
        process.exit(1);

    }

}

export { init };
