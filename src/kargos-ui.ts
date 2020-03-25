import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { getImagePathFor } from "./images";
import { getHref } from "./notify";
import { IConfig } from "./args";

export const getKargosUiString = (
    config: IConfig,
    items: GitPullRequest[][]
) => `
${items.reduce(
    (a, c) => a + c.length,
    0
)} | imageURL=/usr/local/share/icons/git-pull-request-icon.svg
---
${items
    .filter(r => r.length > 0)
    .map(
        repo =>
            `<b>${repo[0].repository!.name}</b> \n` +
            repo
                .map(
                    pr =>
                        `${pr.title} | 'href=${getHref(
                            config,
                            pr
                        )}' imageURL=${getImagePathFor(
                            pr
                        )} imageHeight=22 imageWidth=22 onclick=href bash='echo test'`
                )
                .join("\n")
    )
    .join("\n")}
`;
