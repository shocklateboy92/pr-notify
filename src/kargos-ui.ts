import { GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { getImagePathFor } from "./images";
import { getHref } from "./notify";

interface IConfig {
    organization: string;
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
    }
) =>
    `${text.replace("|", "/")} | ${Object.entries(options)
        .map(([k, v]) => k + "=" + formatValue(v))
        .join(" ")}`;

export const getKargosUiString = (config: IConfig, items: GitPullRequest[][]) =>
    [
        formatLine(items.reduce((a, c) => a + c.length, 0).toString(), {
            imageURL: "/usr/local/share/icons/git-pull-request-icon.svg"
        }),
        "---",
        ...items
            .filter(r => r.length > 0)
            .flatMap(repo => [
                formatLine(`<b>${repo[0].repository!.name}</b>`, {
                    icon: "arrow-right"
                }),
                ...repo.map(pr =>
                    formatLine(pr.title!, {
                        href: getHref(config, pr),
                        imageURL: getImagePathFor(pr),
                        imageHeight: 22,
                        imageWidth: 22,
                        onclick: "href",
                        bash: "echo test"
                    })
                )
            ])
    ].join("\n");
