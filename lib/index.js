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
const manager = __importStar(require("@pavelstancik/enhanced-env-azure-vault"));
/*
try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
*/
const underscoreReplacedBy = "0x";
const environment = ['STAGE', 'TEST', 'PROD'];
const typeVariant = ['frontend', 'backend'];
const preparation = (proposedEnvironment, proposedType) => __awaiter(void 0, void 0, void 0, function* () {
    //Check proposed Environment [ TEST / STAGE / PROD ]
    if (!environment.includes(proposedEnvironment)) {
        throw new Error("Environment parameter set incorrectly, choose one of [TEST | STAGE | PROD].");
    }
    if (!typeVariant.includes(proposedType)) {
        throw new Error("Type parameter set incorrectly, choose one of [frontend | backend].");
    }
    const prefix = proposedEnvironment;
    const type = proposedType;
    /*
    1, Based on Environment and
    2, Based on tzyep, get all secrets from Azure vault and
    3, inject ENV into GH Action
    */
    const azureParameters = yield manager.listAll(prefix, type);
    azureParameters.map(secretObject => {
        if (secretObject.enabled && secretObject.environment === prefix && secretObject.tags.type === type) {
            console.log(`For this environment: ${prefix} and type: ${type} we have this ENV: ${secretObject.name} = ${secretObject.value}`);
        }
    });
});
preparation('TEST', 'frontend').catch(e => console.error('> ERROR in parameters: ', e.message));
//# sourceMappingURL=index.js.map