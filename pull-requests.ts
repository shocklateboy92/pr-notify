import { IGitApi } from 'azure-devops-node-api/GitApi';
import {
    PullRequestStatus,
    GitPullRequestSearchCriteria,
    GitPullRequest
} from 'azure-devops-node-api/interfaces/GitInterfaces';

export async function fetchActivePullRequests(git: IGitApi, repoIds: string[]) {
    console.log('Fetching active pull requests...');
    const criteria: Partial<GitPullRequestSearchCriteria> = {
        status: PullRequestStatus.Active
    };

    let results: GitPullRequest[] = [];
    for (const repoId of repoIds) {
        const prs = await git.getPullRequests(
            repoId,
            // Man these type definitions are really terrible
            criteria as any
        );

        results = results.concat(prs);
    }

    return results;
}
