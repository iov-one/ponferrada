import * as React from "react";

type OpenType = [boolean, (callBack?: () => void) => void, () => void, boolean];

export function useOpen(): OpenType {
  const [open, setOpen] = React.useState<boolean>(false);
  const [visited, setVisited] = React.useState<boolean>(false);
  const toggle = (callBack?: () => void): void => {
    if (callBack && typeof callBack === "function") {
      callBack();
    }

    setVisited(true);
    setOpen(open => !open);
  };

  const clickAway = (): void => {
    setVisited(true);
    setOpen(false);
  };

  const isOpen = open;
  return [isOpen, toggle, clickAway, visited];
}
