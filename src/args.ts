import yargs from "yargs";
import path from "path";
import os from "os";
import fs, { stat } from "fs";
import * as azdev from "azure-devops-node-api";
import { updateRepos } from "./repos";
import { getState, setState } from "./state";
import { fetchActivePullRequests } from "./pull-requests";
import { getUpdated } from "./diff";
import { notify } from "./notify";
import { fetchImages } from "./images";
import { readFileSync } from "fs";
import logger from "./logger";
import { getKargosUiString } from "./kargos-ui";

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
        .command(
            ["notfiy", "$0"],
            "Notify",
            builder => builder,
            async config => {
                logger("Authenticating...");
                const authHandler = azdev.getPersonalAccessTokenHandler(
                    config.pat ||
                        readFileSync(
                            // while it was tricky to encode in type definition, we
                            // know that if they were both undefined, we'd bail out
                            // at the post args check.
                            config.patFilePath!,
                            { encoding: "utf-8" }
                        )
                );
                const connection = new azdev.WebApi(
                    config.organization,
                    authHandler
                );

                const state = await getState(config);
                const git = await connection.getGitApi();

                state.repoIds = await updateRepos(git, state.repoIds);

                const results = await fetchActivePullRequests(
                    git,
                    Object.values(state.repoIds)
                );

                const newPullRequests = results.flatMap(a => a);

                const updated = getUpdated(
                    state.pullRequestIds,
                    newPullRequests
                );
                logger(`Found ${updated.length} new pull requests.`);

                // Ensure images are already cached before calling notify
                await fetchImages(authHandler, newPullRequests);

                notify(config, updated);

                state.pullRequestIds = newPullRequests
                    .map(p => p.pullRequestId)
                    .filter(isNotNull);

                logger("Operation complete. Saving new state...");
                setState(config, state);

                console.log(getKargosUiString(config, results));
            }
        )
        .command(
            "dismiss <id>",
            "Hide PR with given ID until it updates",
            builder =>
                builder.option("id", {
                    type: "number",
                    demand: true
                }),
            async config => {
                const state = await getState(config);
                await setState(config, {
                    ...state,
                    hiddenPrIds: [...state.hiddenPrIds, config.id]
                });
            }
        )
        .parse();

const resolvePath = (suffix: string) => path.resolve(os.homedir(), suffix);

function isNotNull<T>(it: T): it is NonNullable<T> {
    return it != null;
}
