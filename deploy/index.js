"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const path_1 = __importDefault(require("path"));
const shared_1 = require("../shared");
async function run() {
    try {
        const testDeploy = !!core.getInput('testDeploy');
        const deployScript = path_1.default.join(shared_1.divvunConfigDir(), "repo", "scripts", "pahkat_deploy_new.sh");
        const exit = await exec.exec("bash", [deployScript], {
            env: {
                ...process.env,
                "DEPLOY_SVN_USER": await shared_1.getDivvunEnv("DEPLOY_SVN_USER"),
                "DEPLOY_SVN_PASSWORD": await shared_1.getDivvunEnv("DEPLOY_SVN_PASSWORD"),
                "DEPLOY_SVN_REPO": core.getInput('repository'),
                "DEPLOY_SVN_PKG_ID": core.getInput('package'),
                "DEPLOY_SVN_PKG_PLATFORM": core.getInput('platform'),
                "DEPLOY_SVN_PKG_PAYLOAD": path_1.default.resolve(core.getInput('payload')),
                "DEPLOY_SVN_PKG_VERSION": core.getInput('version'),
                "DEPLOY_SVN_REPO_ARTIFACTS": "https://pahkat.uit.no/artifacts/",
                "DEPLOY_SVN_COMMIT": !testDeploy ? "1" : ""
            }
        });
        if (exit != 0) {
            throw new Error("deploy failed");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
