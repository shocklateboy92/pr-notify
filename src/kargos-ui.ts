import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { getImagePathFor } from "./images";
import { getHref } from "./notify";
import { IState } from "./state";

interface IConfig {
    organization: string;
    hiddenPrs: IState["hiddenPrs"];
    bashOverride?: string;
    iconSize: number;
    thumbnailSize: number;
}

const formatValue = (val: unknown) =>
    typeof val === "string" ? `'${val}'` : String(val);

const formatLine = (
    text: string,
    options: {
        imageURL?: string;
        imageWidth?: number;
        imageHeight?: number;
        onclick?: "href" | "bash";
        icon?: string;
        bash?: string;
        href?: string;
        refresh?: boolean;
    }
) =>
    `${text.replace("|", "/")} | ${Object.entries(options)
        .map(([k, v]) => k + "=" + formatValue(v))
        .join(" ")}`;

export const getKargosUiString = (
    config: IConfig,
    items: GitPullRequest[][]
) => {
    const hidden = new Set(config.hiddenPrs.map(f => f.id));
    return formatKargosUiString(
        config,
        items
            .map(repo => repo.filter(pr => !hidden.has(pr.pullRequestId!)))
            .filter(repo => repo.length > 0)
    );
};

const formatKargosUiString = (config: IConfig, items: GitPullRequest[][]) =>
    [
        formatLine(items.reduce((a, c) => a + c.length, 0).toString(), {
            imageURL: "/usr/local/share/icons/git-pull-request-icon.svg",
            imageWidth: config.iconSize,
            imageHeight: config.iconSize
        }),
        "---",
        ...items.flatMap(repo => [
            formatLine(`<b>${repo[0].repository!.name}</b>`, {
                icon: "arrow-right"
            }),
            ...repo.map(pr =>
                formatLine(pr.title!, {
                    href: getHref(config, pr),
                    imageURL: getImagePathFor(pr),
                    imageHeight: config.thumbnailSize,
                    imageWidth: config.thumbnailSize,
                    onclick: "href",
                    bash: `${config.bashOverride ||
                        process.argv.join(" ")} dismiss ${pr.pullRequestId}`,
                    refresh: true
                })
            )
        ])
    ].join("\n");
