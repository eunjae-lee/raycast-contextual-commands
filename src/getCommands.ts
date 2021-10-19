import { Command } from "./types";
import { reviewPR } from "./commands/reviewPR";
import { reviewIssue } from "./commands/reviewIssue";
import { timeBlock } from "./commands/timeBlock";
import { openPRInCode } from "./commands/openPRInCode";
import { openRepoInCode } from "./commands/openRepoInCode";
import { livingRoomNetflix } from "./commands/livingRoomNetflix";

const list = [reviewPR, reviewIssue, timeBlock, openPRInCode, openRepoInCode, livingRoomNetflix];

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
