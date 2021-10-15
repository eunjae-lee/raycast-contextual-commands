import { Command } from "./types";
import { reviewPR } from "./commands/reviewPR";
import { reviewIssue } from "./commands/reviewIssue";

const list = [reviewPR, reviewIssue];

export async function getCommands(): Promise<Command[]> {
  const validMap: Record<number, boolean> = {};
  await Promise.all(
    list.map((command, index) =>
      Promise.resolve(command.valid()).then((result) => {
        validMap[index] = result;
      })
    )
  );

  return list.filter((command, index) => validMap[index]).flatMap((command) => command.getCommands());
}
