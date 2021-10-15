import {
  ActionPanel,
  CopyToClipboardAction,
  List,
  OpenInBrowserAction,
  showToast,
  ToastStyle,
  getSelectedText,
} from "@raycast/api";
import { useState, useEffect } from "react";

import { getCommands } from "./getCommands";
import { Command } from "./types";

export default function ArticleList() {
  const [commands, setCommands] = useState<Command[]>();
  useEffect(() => {
    getCommands().then((commands) => setCommands(commands));
  }, []);

  return (
    <List isLoading={!commands} searchBarPlaceholder="Filter commands by name...">
      {(commands || []).map((command, index) => (
        <List.Item
          key={index}
          {...command.listItem}
          actions={
            <ActionPanel>
              {command.actionPanelItems.map((actionPanelItem, index) => {
                const { onAction, ...restActionPanelItem } = actionPanelItem;
                return (
                  <ActionPanel.Item
                    key={index}
                    {...restActionPanelItem}
                    onAction={async () => {
                      showToast(ToastStyle.Animated, "Running...");
                      Promise.resolve(onAction!())
                        .then(() => {
                          showToast(ToastStyle.Success, "Done");
                        })
                        .catch(() => {
                          showToast(ToastStyle.Failure, "Failed");
                        });
                    }}
                  />
                );
              })}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
