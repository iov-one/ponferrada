import Box, { BoxProps } from "@material-ui/core/Box";
import { ComposedStyleFunction, display, flexbox, PropsFor, sizing, spacing } from "@material-ui/system";
import * as React from "react";

type GridItemStyleFunction = ComposedStyleFunction<
  [typeof flexbox, typeof display, typeof sizing, typeof spacing]
>;
type GridItemStyleProps = PropsFor<GridItemStyleFunction>;

interface Props extends GridItemStyleProps {
  readonly children?: React.ReactNode;
}

const GridItem = ({ children, ...restProps }: BoxProps): JSX.Element => {
  return (
    <Box display="flex" {...restProps}>
      {children}
    </Box>
  );
};

export default GridItem;
