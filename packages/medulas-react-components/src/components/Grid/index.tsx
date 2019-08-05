import Box from "@material-ui/core/Box";
import { ComposedStyleFunction, flexbox, PropsFor, sizing } from "@material-ui/system";
import * as React from "react";

type GridStyleFunction = ComposedStyleFunction<[typeof flexbox, typeof sizing]>;
type GridStyleProps = PropsFor<GridStyleFunction>;

interface Props extends GridStyleProps {
  readonly children?: React.ReactNode;
}

const Grid = ({ children, ...restProps }: Props): JSX.Element => {
  return (
    <Box display="flex" {...restProps}>
      {children}
    </Box>
  );
};

export default Grid;
