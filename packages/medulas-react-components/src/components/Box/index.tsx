import { unstable_Box as Box } from '@material-ui/core/Box';

interface Props {
  readonly children: React.ReactNode;
  //readonly container: Boolean;
}

export const Grid = ({ children }: Props): JSX.Element => {
  return <Box display="flex">{children}</Box>;
};

export default Grid;
