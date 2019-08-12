import React from "react";
interface DrawerItems {
  readonly icon?: string;
  readonly text: string;
  readonly action: () => void;
}
interface Props {
  readonly children: React.ReactNode;
  readonly items: readonly DrawerItems[];
  readonly footer?: React.ReactNode;
  readonly elevation?: number;
}
export declare const DRAWER_HTML_ID = "account-drawer";
declare function PersistentDrawerRight({ children, items, footer, elevation }: Props): JSX.Element;
export default PersistentDrawerRight;
