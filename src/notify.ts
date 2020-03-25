import notifier from "node-notifier";
import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { getImagePathFor } from "./images";
import logger from "./logger";
import { IConfig } from "./args";

const MAX_NOTIFICATIONS = 3;

export function notify(config: IConfig, updatedPrList: GitPullRequest[]) {
    if (updatedPrList.length > MAX_NOTIFICATIONS) {
        console.warn(`Notifications throttled to ${5}.`);
    }

    logger(
        `Firing ${Math.min(
            updatedPrList.length,
            MAX_NOTIFICATIONS
        )} notifications...`
    );

    for (const pr of updatedPrList.slice(0, MAX_NOTIFICATIONS)) {
        // I'm not sure why these things can suddenly be undefined, but
        // let's just skip if they are.
        if (!(pr.repository && pr.repository.project && pr.createdBy)) {
            continue;
        }

        notifier.notify({
            title: pr.title,
            message: `<a href='${config.organization}/${pr.repository.project.name}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}'>${pr.createdBy.displayName} has created a new Pull Request to ${pr.repository.name}</a>`,
            icon: getImagePathFor(pr)
        });
    }
}
