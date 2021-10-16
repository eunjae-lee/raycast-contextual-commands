import { Command } from "./types";
import { reviewPR } from "./commands/reviewPR";
import { reviewIssue } from "./commands/reviewIssue";
import { timeBlock } from "./commands/timeBlock";
import { openRepoInCode } from "./commands/openRepoInCode";

const list = [reviewPR, reviewIssue, timeBlock, openRepoInCode];

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
