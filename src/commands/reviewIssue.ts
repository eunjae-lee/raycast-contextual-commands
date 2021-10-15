import { ContextualCommands } from "../types";
import { readClipboard, createThingsTodo, repoAlias, getGitHubIssueInfo } from "../helpers";

export const reviewIssue: ContextualCommands = {
  valid: async () => {
    const text = await readClipboard();
    return Boolean(text && text.includes("github.com") && text.includes("/issues/"));
  },
  getCommands: () => {
    return [
      {
        listItem: {
          title: "👀 Create a task to review the issue",
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
  const { repoName, title, author } = await getGitHubIssueInfo(url);
  const repo = repoAlias[repoName] || repoName;
  const taskTitle = `👀 [${repo}] ${title} by ${author}`;
  await createThingsTodo({ title: taskTitle, notes: url });
}
