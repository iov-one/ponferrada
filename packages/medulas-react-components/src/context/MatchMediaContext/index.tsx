import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const phoneScreen = 425;

type MatchMediaProps = boolean;

export const MatchMediaContext = React.createContext<MatchMediaProps>(false);

interface Props {
  readonly children: React.ReactNode;
}

const MatchMedia = ({ children }: Props): JSX.Element => {
  const isPhone = useMediaQuery(`(max-width:${phoneScreen}px)`);

  return <MatchMediaContext.Provider value={isPhone}>{children}</MatchMediaContext.Provider>;
};

export default MatchMedia;
