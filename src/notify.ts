import notifier from 'node-notifier';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { IMAGE_CACHE_PATH } from './images';

const MAX_NOTIFICATIONS = 5;

export function notify(updatedPrList: GitPullRequest[]) {
    if (updatedPrList.length > MAX_NOTIFICATIONS) {
        console.warn(`Notifications throttled to ${5}.`);
    }

    console.log(
        `Firing ${Math.min(
            updatedPrList.length,
            MAX_NOTIFICATIONS
        )} notifications...`
    );

    for (const pr of updatedPrList.slice(0, MAX_NOTIFICATIONS)) {
        notifier.notify({
            title: pr.title,
            message: `<strong>${
                pr.createdBy.displayName
            }</strong> has created a new Pull Request to ${pr.repository.name}`,
            icon: IMAGE_CACHE_PATH + pr.createdBy.id
        });
    }
}
