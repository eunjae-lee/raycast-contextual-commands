import { ListItemProps, ActionPanelItemProps } from "@raycast/api";

export type Command = {
  listItem: ListItemProps;
  actionPanelItems: ActionPanelItemProps[];
};

export type ContextualCommands = {
  valid: () => boolean | Promise<boolean>;
  getCommands: () => Command[];
};
