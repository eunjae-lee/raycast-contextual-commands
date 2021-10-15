import { ContextualCommands } from "../types";
import { readClipboard, createThingsTodo, repoAlias, getGitHubPRInfo } from "../helpers";

export const reviewPR: ContextualCommands = {
  valid: async () => {
    const text = await readClipboard();
    return Boolean(text && text.includes("github.com") && text.includes("/pull/"));
  },
  getCommands: () => {
    return [
      {
        listItem: {
          title: "👀 Create a task to review the PR",
        },
        actionPanelItems: [
          {
            title: "Create Task",
            onAction: createTask,
          },
        ],
      },
    ];
  },
};

async function createTask() {
  const url = await readClipboard();
  const { repoName, title, author } = await getGitHubPRInfo(url);
  const repo = repoAlias[repoName] || repoName;
  const taskTitle = `👀 [${repo}] ${title} by ${author}`;
  await createThingsTodo({ title: taskTitle, notes: url });
}
