import yargs from "yargs";
import path from "path";
import os from "os";
import fs from "fs";

export type IConfig = ReturnType<typeof getConfig>;

export const getConfig = () =>
    yargs
        .option("stateFile", {
            type: "string",
            default: path.resolve(os.homedir(), ".cache/pr-notify.json"),
            description: "Path to file for storing app state between runs."
        })
        .config("config", "Path to JSON configuration file", path =>
            JSON.parse(fs.readFileSync(path, "utf-8"))
        )
        .parse();
