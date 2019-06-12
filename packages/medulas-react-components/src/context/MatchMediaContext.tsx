import { throttle } from 'lodash';
import * as React from 'react';

const phoneScreen = 425;

type MatchMediaProps = boolean;

const isPhone = (): boolean => (window.matchMedia(`(min-width: ${phoneScreen}px)`).matches ? false : true);

export const MatchMediaContext = React.createContext<MatchMediaProps>(false);

interface State {
  readonly phone: boolean;
}

class MatchMedia extends React.Component<{}, State> {
  public readonly state = {
    phone: isPhone(),
  };
  private readonly throttledOnResize: () => void;

  public constructor(props: {}) {
    super(props);
    this.throttledOnResize = throttle(this.updateMatchMedia.bind(this), 400);
  }

  public componentDidMount(): void {
    window.addEventListener('resize', this.throttledOnResize);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.throttledOnResize);
  }

  public updateMatchMedia(): void {
    this.setState(() => ({ phone: isPhone() }));
  }

  public render(): JSX.Element {
    return (
      <MatchMediaContext.Provider value={this.state.phone}>{this.props.children}</MatchMediaContext.Provider>
    );
  }
}

export default MatchMedia;
