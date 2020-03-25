import * as jsonfile from "jsonfile";
import logger from "./logger";
import { IConfig } from "./args";

export interface IState {
    repoIds: {
        [key: string]: string;
    };
    pullRequestIds: number[];
}

export const getState = async (config: IConfig): Promise<IState> => {
    try {
        return await jsonfile.readFile(config.stateFile);
    } catch {
        logger("Missing state file. Assuming initial state...");
        return {
            repoIds: {},
            pullRequestIds: []
        };
    }
};

export const setState = (config: IConfig, state: IState) =>
    jsonfile.writeFile(config.stateFile, state, { spaces: 2 });
