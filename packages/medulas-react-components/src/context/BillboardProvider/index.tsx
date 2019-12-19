import * as React from "react";

import Billboard, { HPosition, VPosition } from "./Billboard";

export interface BillboardContextInterface {
  readonly show: (
    message: React.ReactNode,
    vPosition: VPosition,
    hPosition: HPosition,
    delay: number,
  ) => void;
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
  readonly vPosition: VPosition;
  readonly hPosition: HPosition;
  readonly delay: number; // Delay before showing billboard message in milliseconds
}

export function BillboardProvider({ children }: Props): JSX.Element {
  const [message, setMessage] = React.useState<BillboardState>({
    show: false,
    message: "",
    vPosition: "center",
    hPosition: "center",
    delay: 0,
  });

  const show = (
    message: React.ReactNode,
    vPosition: VPosition = "center",
    hPosition: HPosition = "center",
    delay = 0,
  ): void =>
    setMessage({
      show: true,
      message,
      vPosition,
      hPosition,
      delay,
    });

  const close = (): void =>
    setMessage({
      show: false,
      message: "",
      vPosition: "center",
      hPosition: "center",
      delay: 0,
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
}
