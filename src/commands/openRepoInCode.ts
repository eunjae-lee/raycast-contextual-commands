import fs from "fs";
import { ContextualCommands } from "../types";
import { readClipboard, runShellScript } from "../helpers";
import config from "../config";

export const openRepoInCode: ContextualCommands = {
  valid: async () => {
    const text = await readClipboard();
    return Boolean(text && text.startsWith("https://github.com/"));
  },
  getCommands: () => {
    return [
      {
        listItem: {
          title: "💻 Open repo in VSCode",
        },
        actionPanelItems: [
          {
            title: "Open repo",
            onAction: openRepo,
          },
        ],
      },
    ];
  },
};

async function openRepo() {
  const { workspace } = config;
  const url = await readClipboard();
  const org = url.split("/")[3];
  const repo = url.split("/")[4];

  if (!fs.existsSync(`${workspace}/${repo}`)) {
    const sshUrl = `git@github.com:${org}/${repo}.git`;
    runShellScript(`cd ${workspace} && git clone ${sshUrl}`);
  }

  runShellScript(`/usr/local/bin/code ${workspace}/${repo}`);
}
