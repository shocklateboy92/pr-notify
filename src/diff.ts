import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

export function getUpdated(prev: GitPullRequest[], current: GitPullRequest[]) {
    // Not checking for existing yet updated PRs at the moment
    return current.filter(
        newPr =>
            !prev.find(oldPr => oldPr.pullRequestId === newPr.pullRequestId)
    );
}
