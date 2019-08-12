import * as React from "react";
interface Props {
  readonly starter: (open: boolean, visited?: boolean) => JSX.Element;
  readonly listWidth: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly listId?: string;
}
declare const ListMenu: ({ listWidth, starter, children, color, listId, onClick }: Props) => JSX.Element;
export default ListMenu;
