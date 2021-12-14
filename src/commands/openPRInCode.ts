import fs from "fs";
import { ContextualCommands } from "../types";
import { readClipboard, runShellScript } from "../helpers";
import config from "../config";

export const openPRInCode: ContextualCommands = {
  valid: async () => {
    const text = await readClipboard();
    return Boolean(text && text.includes("github.com") && text.includes("/pull/"));
  },
  getCommands: () => {
    return [
      {
        listItem: {
          title: "💻 Open PR in VSCode",
        },
        actionPanelItems: [
          {
            title: "Open PR",
            onAction: openPR,
          },
        ],
      },
    ];
  },
};

async function openPR() {
  const { workspace } = config;
  const url = await readClipboard();
  const org = url.split("/")[3];
  const repo = url.split("/")[4];
  const prNumber = url.split("/")[6].split("#")[0];

  if (!fs.existsSync(`${workspace}/${repo}`)) {
    const sshUrl = `git@github.com:${org}/${repo}.git`;
    runShellScript(`cd ${workspace} && git clone ${sshUrl}`);
  }

  runShellScript(`cd ${workspace}/${repo} && /usr/local/bin/gh pr checkout ${prNumber}`);
  runShellScript(`/usr/local/bin/code ${workspace}/${repo}`);
}
