import * as React from 'react';

type OpenType = [boolean, () => void];

export function useOpen(): OpenType {
  const [open, setOpen] = React.useState<boolean>(false);
  const toggle = (): void => setOpen(open => !open);

  const isOpen = open;
  return [isOpen, toggle];
}
