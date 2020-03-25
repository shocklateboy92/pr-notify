import * as azdev from "azure-devops-node-api";
import { updateRepos } from "./repos";
import { getState, setState } from "./state";
import { fetchActivePullRequests } from "./pull-requests";
import { getUpdated } from "./diff";
import { notify } from "./notify";
import { fetchImages } from "./images";
import { ORG_URL, PAT_PATH } from "./constants";
import { readFileSync } from "fs";
import logger from "./logger";
import { getConfig } from "./args";

(async () => {
    logger("Authenticating...");
    const authHandler = azdev.getPersonalAccessTokenHandler(
        readFileSync(PAT_PATH, { encoding: "utf-8" })
    );

    const config = getConfig();

    const connection = new azdev.WebApi(ORG_URL, authHandler);

    const state = await getState(config);
    const git = await connection.getGitApi();

    state.repoIds = await updateRepos(git, state.repoIds);

    const newPullRequests = await fetchActivePullRequests(
        git,
        Object.values(state.repoIds)
    );

    const updated = getUpdated(state.pullRequestIds, newPullRequests);
    logger(`Found ${updated.length} new pull requests.`);

    // Ensure images are already cached before calling notify
    await fetchImages(authHandler, updated);

    notify(updated);

    state.pullRequestIds = newPullRequests
        .map(p => p.pullRequestId)
        .filter(isNotNull);

    console.log(state.pullRequestIds.length);

    logger("Operation complete. Saving new state...");
    setState(config, state);
})();

function isNotNull<T>(it: T): it is NonNullable<T> {
    return it != null;
}
