import * as React from "react";
export interface ActionMenuItem {
  readonly title: string;
  readonly action: () => void;
}
interface Props {
  readonly menuItems: readonly ActionMenuItem[];
}
declare const ActionMenu: React.FunctionComponent<Props>;
export default ActionMenu;
