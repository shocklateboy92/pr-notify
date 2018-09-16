import { IState } from './state';
import gitm from 'azure-devops-node-api/GitApi';

const WATCHED_REPOS = [
    'OneRF.Library.OneStore.ProductIdentity',
    'RedTiger.Library.Keystone'
];

export async function updateRepos(
    git: gitm.IGitApi,
    prevRepos: IState['repoIds']
) {
    // If nothing new needs to be fetched, bail
    if (WATCHED_REPOS.every(repo => repo in prevRepos)) {
        return prevRepos;
    }

    const repos = await git.getRepositories();
    const results: IState['repoIds'] = {};

    for (const repo of repos) {
        if (repo.name in WATCHED_REPOS) {
            results[repo.name] = repo.id;
        }
    }

    return results;
}
