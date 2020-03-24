import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { IState } from "./state";

export function getUpdated(
    prev: IState["pullRequestIds"],
    current: GitPullRequest[]
) {
    // Not checking for existing yet updated PRs at the moment
    return current.filter(
        newPr => !prev.find(oldPr => oldPr === newPr.pullRequestId)
    );
}
