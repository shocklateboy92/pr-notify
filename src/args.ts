import yargs from "yargs";
import path from "path";
import os from "os";
import fs from "fs";

export type IConfig = ReturnType<typeof getConfig>;

export const getConfig = () =>
    yargs
        .option("stateFile", {
            type: "string",
            default: resolvePath(".cache/pr-notify.json"),
            description: "Path to file for storing app state between runs."
        })
        .option("organization", {
            alias: ["org", "orgUrl"],
            type: "string",
            demand: true
        })
        .option("pat", {
            alias: "personalAccessToken",
            type: "string",
            description:
                "Personal Access Token with read scope of all the repos"
        })
        .option("patFilePath", {
            alias: "peronalAccessTokenFile",
            type: "string",
            description:
                "Path of plain text file file containing just the Personal Access Token"
        })
        .config("config", "Path to JSON configuration file", path =>
            fs.existsSync(path)
                ? JSON.parse(fs.readFileSync(path, "utf-8"))
                : {}
        )
        .default("config", resolvePath(".config/pr-notify.json"))
        .check(args => {
            if (args.pat || args.patFilePath) {
                return true;
            } else {
                throw new Error("Either pat or patFilePath must be provided.");
            }
        })
        .parse();

const resolvePath = (suffix: string) => path.resolve(os.homedir(), suffix);
