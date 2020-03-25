import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";

export const getKargosUiString = (items: GitPullRequest[][]) => `
${items.length}
---
${items
    .filter(r => r.length > 0)
    .map(
        repo =>
            `${repo[0].repository!.name}\n---\n` +
            repo
                .map(pr => `${pr.title} | imageUrl=${pr.createdBy?.imageUrl}`)
                .join("\n")
    )
    .join("\n")}
`;
