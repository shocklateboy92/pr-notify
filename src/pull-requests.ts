import { IGitApi } from "azure-devops-node-api/GitApi";
import {
    PullRequestStatus,
    GitPullRequestSearchCriteria,
    GitPullRequest
} from "azure-devops-node-api/interfaces/GitInterfaces";
import logger from "./logger";

export async function fetchActivePullRequests(git: IGitApi, repoIds: string[]) {
    logger("Fetching active pull requests...");
    const criteria: Partial<GitPullRequestSearchCriteria> = {
        status: PullRequestStatus.Active
    };

    let results: GitPullRequest[][] = [];
    let count = 0;
    for (const repoId of repoIds) {
        const prs = await git.getPullRequests(
            repoId,
            // Man these type definitions are really terrible
            criteria as any
        );

        results.push(prs);
        count += prs.length;
    }

    logger(`Fetched ${count} active pull requets for ${repoIds.length} repos.`);
    return results;
}
