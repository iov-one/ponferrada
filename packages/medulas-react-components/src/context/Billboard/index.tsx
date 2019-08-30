import * as React from "react";

import Billboard from "./Billboard";

export interface BillboardContextInterface {
  readonly show: (message: React.ReactNode) => void;
  readonly close: () => void;
}

export const BillboardContext = React.createContext<BillboardContextInterface>({
  show: (): void => {},
  close: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
}

interface BillboardState {
  readonly show: boolean;
  readonly message: React.ReactNode;
}

export const BillboardProvider = ({ children }: Props): JSX.Element => {
  const [message, setMessage] = React.useState<BillboardState>({
    show: false,
    message: "",
  });

  const show = (message: React.ReactNode): void =>
    setMessage({
      show: true,
      message,
    });

  const close = (): void =>
    setMessage({
      show: false,
      message: "",
    });

  const billboardConfig: BillboardContextInterface = {
    show,
    close,
  };

  return (
    <BillboardContext.Provider value={billboardConfig}>
      <Billboard {...message}>{children}</Billboard>
    </BillboardContext.Provider>
  );
};
