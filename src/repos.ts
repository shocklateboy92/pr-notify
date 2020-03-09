import { IState } from "./state";
import gitm from "azure-devops-node-api/GitApi";
import logger from "./logger";

const PROJECT_NAME = "Universal Store";
const WATCHED_REPOS = [
    "Store.Cart",
    "Store.Cart.Services",
    "Store.Web.Services.Commerce-Integration"
];

export async function updateRepos(
    git: gitm.IGitApi,
    prevRepos: IState["repoIds"]
) {
    // If nothing new needs to be fetched, bail
    if (WATCHED_REPOS.every(repo => repo in prevRepos)) {
        return prevRepos;
    }

    logger("Missing IDs for some pepos. Fetching repo list...");
    const repos = await git.getRepositories(PROJECT_NAME);
    const results: IState["repoIds"] = {};

    logger(`Fetched ${repos.length} repos. Processing results...`);
    for (const repo of repos) {
        if (!(repo.name && repo.id)) {
            console.error(`Got invalid repo '${JSON.stringify(repo)}'`);
            continue;
        }

        if (WATCHED_REPOS.includes(repo.name)) {
            results[repo.name] = repo.id;
        }
    }

    // Check if any of our watched repos are missing
    const missing = WATCHED_REPOS.filter(
        wr => !repos.find(ar => ar.name === wr)
    );
    if (missing.length) {
        console.error(
            `ERROR: Fetched repos did not include ${JSON.stringify(missing)}`
        );
    }

    return results;
}
