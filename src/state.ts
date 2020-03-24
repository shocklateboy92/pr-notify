import * as jsonfile from "jsonfile";
import { STATE_FILE } from "./constants";
import logger from "./logger";

export interface IState {
    repoIds: {
        [key: string]: string;
    };
    pullRequestIds: number[];
}

export const getState = async (): Promise<IState> => {
    try {
        return await jsonfile.readFile(STATE_FILE);
    } catch {
        logger("Missing state file. Assuming initial state...");
        return {
            repoIds: {},
            pullRequestIds: []
        };
    }
};

export const setState = (state: IState) =>
    jsonfile.writeFile(STATE_FILE, state, { spaces: 2 });
