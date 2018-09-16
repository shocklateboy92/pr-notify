import * as azdev from 'azure-devops-node-api';
import { updateRepos } from './repos';
import { getState } from './state';

const ORG_URL = "https://microsoft.visualstudio.com";
const PAT = "nszqakn4d5kktanud3rm6sjswphe4eoxx6qwmsxbiohqqasmiedq";

(async () => {
    console.log('Authenticating...');
    const authHandler = azdev.getPersonalAccessTokenHandler(PAT);
    const connection = new azdev.WebApi(ORG_URL, authHandler);

    const state = await getState();
    const git = await connection.getGitApi();

    debugger;
    state.repoIds = await updateRepos(git, state.repoIds);
    
    console.log(JSON.stringify(state, null, 4));

    // console.log(JSON.stringify(repos, null, 4));
    // git.getPullRequests()
    // console.log('checking for new PRs');
})()
