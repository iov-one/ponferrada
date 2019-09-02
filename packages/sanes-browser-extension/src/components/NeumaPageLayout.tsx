import { PageLayout } from "medulas-react-components";
import * as React from "react";

import neumaLogo from "./assets/NeumaLogo.svg";

interface Props extends StyleProps {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly primaryTitle: string;
  readonly title: string;
  readonly onBack?: () => void;
}

interface StyleProps {
  readonly color?: "white" | "transparent";
  readonly minHeight?: string | number;
}

const NeumaPageLayout = (props: Props): JSX.Element => {
  const allProps = {
    ...props,
    logoWidth: 100,
    logoSource: neumaLogo,
  };
  return <PageLayout {...allProps} />;
};

export default NeumaPageLayout;
