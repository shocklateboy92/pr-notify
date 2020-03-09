import * as jsonfile from "jsonfile";
import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { STATE_FILE } from "./constants";

export interface IState {
    repoIds: {
        [key: string]: string;
    };
    pullRequests: GitPullRequest[];
}

export const getState = async (): Promise<IState> => {
    try {
        return await jsonfile.readFile(STATE_FILE);
    } catch {
        console.log("Missing state file. Assuming initial state...");
        return {
            repoIds: {},
            pullRequests: []
        };
    }
};

export const setState = (state: IState) =>
    jsonfile.writeFile(STATE_FILE, state, { spaces: 2 });
