import { runShellScript } from "./utils";

export async function getGitHubPRInfo(url: string) {
  let repoName = url.split("/")[4];
  const result = await runShellScript(`/usr/local/bin/gh pr view ${url}`);
  const lines = result.split("\n");
  const title = lines
    .find((line) => line.startsWith("title:"))!
    .split(":")
    .slice(1)
    .join(":")
    .trim();

  const author = lines
    .find((line) => line.startsWith("author:"))!
    .split(":")
    .slice(1)
    .join(":")
    .trim();

  return {
    repoName,
    title,
    author,
  };
}

export async function getGitHubIssueInfo(url: string) {
  let repoName = url.split("/")[4];
  const result = await runShellScript(`/usr/local/bin/gh issue view ${url}`);
  const lines = result.split("\n");
  const title = lines
    .find((line) => line.startsWith("title:"))!
    .split(":")
    .slice(1)
    .join(":")
    .trim();

  const author = lines
    .find((line) => line.startsWith("author:"))!
    .split(":")
    .slice(1)
    .join(":")
    .trim();

  return {
    repoName,
    title,
    author,
  };
}
