"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI') || process.env.KEY_VAULT_URI;
process.env['KEY_VAULT_URI'] = KEY_VAULT_URI;
const manager = __importStar(require("enhanced-env-azure-vault"));
const underscoreReplacedBy = "0x";
const environment = ['STAGE', 'TEST', 'PROD'];
const typeVariant = ['frontend', 'backend', 'both'];
const preparation = (proposedEnvironment, proposedType) => __awaiter(void 0, void 0, void 0, function* () {
    //Check proposed Environment [ TEST / STAGE / PROD ]
    if (!environment.includes(proposedEnvironment)) {
        throw new Error("Environment parameter set incorrectly, choose one of [TEST | STAGE | PROD].");
    }
    if (!typeVariant.includes(proposedType)) {
        throw new Error("Type parameter set incorrectly, choose one of [frontend | backend.");
    }
    const prefix = proposedEnvironment;
    const type = proposedType;
    let arrJson = [];
    let tfvars_frontend = [];
    let tfvars_backend = [];
    const azureParameters = yield manager.listAll(prefix, type);
    console.log(`Setting ENV params for environment: ${prefix} and type: ${type}:`);
    azureParameters.map(secretObject => {
        if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type === type) {
            const obj = {};
            core.exportVariable(secretObject.name, secretObject.value);
            core.setSecret(secretObject.value);
            obj['name'] = secretObject.name;
            obj['value'] = secretObject.value;
            obj['slotSetting'] = false;
            arrJson.push(obj);
        }
    });
    const terraformParameters = yield manager.listAll(prefix);
    terraformParameters.map(secretObject => {
        if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type !== undefined) {
            //core.setSecret(secretObject.value);
            secretObject.value = (secretObject.value).replace(/\\/g, "\\\\");
            if (secretObject.tags.type === 'frontend')
                tfvars_frontend.push(` "${secretObject.name}":"${secretObject.value}" `);
            if (secretObject.tags.type === 'backend')
                tfvars_backend.push(` "${secretObject.name}":"${secretObject.value}" `);
        }
    });
    core.setOutput("json", JSON.stringify(arrJson, null));
    core.setOutput("terraform", prepareTfVars(tfvars_frontend, tfvars_backend));
});
const prepareTfVars = (frontend, backend) => {
    let return_object = `{ "web_app_settings": {\
    `;
    return_object = return_object.concat(` "frontend": { ${frontend} }, `);
    return_object = return_object.concat(` "backend": { ${backend} } } }`);
    return return_object;
};
const e = core.getInput('ENVIRONMENT') || process.env.ENVIRONMENT;
const t = core.getInput('TYPE') || process.env.TYPE;
preparation(e, t)
    .catch(err => console.error('> ERROR in parameters: ', err));
//# sourceMappingURL=index.js.map