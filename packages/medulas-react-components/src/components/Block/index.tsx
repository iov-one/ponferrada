import Box from "@material-ui/core/Box";
import {
  border,
  borders,
  ComposedStyleFunction,
  display,
  flexbox,
  palette,
  positions,
  PropsFor,
  sizing,
  spacing,
  typography,
} from "@material-ui/system";
import * as React from "react";

type BlockStyleFunction = ComposedStyleFunction<
  [
    typeof flexbox,
    typeof sizing,
    typeof spacing,
    typeof display,
    typeof border,
    typeof positions,
    typeof palette,
    typeof borders,
    typeof typography,
  ]
>;
type BlockStyleProps = PropsFor<BlockStyleFunction>;

interface Props extends BlockStyleProps {
  readonly children?: React.ReactNode;
  readonly id?: string;
  readonly className?: string;
  readonly onClick?: React.MouseEventHandler<Element>;
  readonly onMouseLeave?: React.MouseEventHandler<Element>;
  readonly onMouseEnter?: React.MouseEventHandler<Element>;
}

const Block = ({ children, display = "block", ...restProps }: Props): JSX.Element => {
  return (
    <Box display={display} {...restProps}>
      {children}
    </Box>
  );
};

export default Block;
