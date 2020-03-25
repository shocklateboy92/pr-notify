import yargs from "yargs";
import path from "path";
import os from "os";

export type IConfig = ReturnType<typeof getConfig>;

export const getConfig = () =>
    yargs
        .option("stateFile", {
            type: "string",
            default: path.resolve(os.homedir(), ".cache/pr-notify.json"),
            description: "Path to file for storing app state between runs."
        })
        .parse();
