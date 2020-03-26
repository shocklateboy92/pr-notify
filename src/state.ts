import * as jsonfile from "jsonfile";
import logger from "./logger";

export interface IState {
    repoIds: {
        [key: string]: string;
    };
    pullRequestIds: number[];
    hiddenPrIds: number[];
}

interface IConfig {
    stateFile: string;
}

export const getState = async (config: IConfig): Promise<IState> => {
    const initial = {
        repoIds: {},
        pullRequestIds: [],
        hiddenPrIds: []
    };
    try {
        return Object.assign(
            {},
            initial,
            await jsonfile.readFile(config.stateFile)
        );
    } catch {
        logger("Missing state file. Assuming initial state...");
        return initial;
    }
};

export const setState = (config: IConfig, state: IState) =>
    jsonfile.writeFile(config.stateFile, state, { spaces: 2 });
