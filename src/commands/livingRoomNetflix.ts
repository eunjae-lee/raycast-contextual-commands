import { ContextualCommands } from "../types";
import { runShellScript, runAppleScript } from "../helpers";

export const livingRoomNetflix: ContextualCommands = {
  valid: () => {
    const day = new Date().getDay();
    const hours = new Date().getHours();
    return day === 0 || day === 6 || (12 <= hours && hours <= 14) || 18 <= hours;
  },
  getCommands: () => {
    return [
      {
        listItem: {
          title: "🎞 Netflix",
        },
        actionPanelItems: [
          {
            title: "Netflix",
            onAction: netflix,
          },
        ],
      },
    ];
  },
};

async function netflix() {
  const shellScript = `
  sqlite3 ~/Library/Group\\ Containers/JLMPQHK86H.com.culturedcode.ThingsMac/Things\\ Database.thingsdatabase/main.sqlite " \\
  SELECT TMTask.uuid, \\
         TMTask.title, \\
         substr(TMTag.title, 3, length(TMTag.title) - 3) AS tag \\
    FROM TMTask, \\
         TMTaskTag, \\
         TMTag \\
   WHERE TMTask.trashed = 0 AND \\
         TMTask.status = 0 AND \\
         TMTask.type = 0 AND  \\
         TMTask.start = 1 AND \\
         TMTask.startdate IS NOT NULL AND \\
         TMTask.uuid = TMTaskTag.tasks AND  \\
         TMTag.uuid = TMTaskTag.tags AND  \\
         TMTag.title LIKE '⏱%';"  
    `;

  const result = await runShellScript(shellScript);

  const tasks = result
    .trim()
    .split("\n")
    .map((line) => {
      const pieces = line.split("|");
      const id = pieces[0];
      const link = `things:///show?id=${id}`;
      const minutes = Number(pieces[pieces.length - 1]);
      const name = pieces.slice(1, pieces.length - 1).join("|");
      return { name, minutes, link };
    });

  tasks.forEach((task) => {
    let appleScript = `
      set theStartDate to current date
      set hours of theStartDate to 10
        set minutes of theStartDate to 0
      set theEndDate to theStartDate + ((${task.minutes} - 1) * minutes)
  
      tell application "Calendar"
      tell calendar "Tasks"
        make new event with properties {summary:${JSON.stringify(
          task.name
        )}, start date:theStartDate, end date:theEndDate, description:${JSON.stringify(task.link)}}
      end tell
    end tell
  `;
    runAppleScript(appleScript);
  });

  runShellScript("open /System/Applications/Calendar.app");

  return "Created " + tasks.length + " events";
}
