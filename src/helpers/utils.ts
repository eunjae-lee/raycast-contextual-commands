// import { exec } from "shelljs";
import applescript from "applescript";
import execa from "execa";

export async function runShellScript(command: string) {
  const { stdout } = await execa.command(command);
  return stdout;
}

export async function runAppleScript(script: string) {
  return new Promise((resolve, reject) => {
    applescript.execString(script, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function readClipboard() {
  return await runShellScript("pbpaste");
}
