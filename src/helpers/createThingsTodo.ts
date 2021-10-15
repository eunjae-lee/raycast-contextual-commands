import { runAppleScript } from "./utils";

export async function createThingsTodo({ title, notes }: { title: string; notes: string }) {
  const appleScript = `
  tell application "Things3"
    set newToDo to make new to do

    set name of newToDo to ${JSON.stringify(title)}
    set notes of newToDo to ${JSON.stringify(notes)}
  end tell
`;
  await runAppleScript(appleScript);
}
