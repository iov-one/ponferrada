import { createStyles, withStyles, WithStyles, makeStyles, Theme } from '@material-ui/core';

import { FormState, FormSubscription } from 'final-form';
import * as React from 'react';
import Form from '../../components/forms/Form';
import Block from '../../components/Block';
import Button from '../../components/Button';
import Hairline from '../../components/Hairline';
import Img from '../../components/Image';
import logo from '~/components/pages/assets/logo.svg';
import logoBlack from '~/components/pages/assets/logoBlack.svg';
import { MatchMediaContext } from '../../context/MatchMediaContext';
import EmptyHeader from './EmptyHeader';
import SubtitleSection from './SubtitleSection';
import TitleSection from './TitleSection';

interface Props extends WithStyles<typeof styles> {
  readonly leftMenu: () => JSX.Element;

  readonly icon: 'white' | 'black';
  readonly nextMsg: string;
  readonly onSubmit: (values: object) => void;
  readonly formRender: () => JSX.Element;
  readonly validation?: (values: object) => object | Promise<object>;

  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly subtitle: string;

  readonly renderHeader?: () => JSX.Element;
}

const ref = React.createRef<GridItem>();

const useStyles = makeStyles((theme: Theme) =>({
  logo: {
    bottom: '80px',
    position: 'relative',
    display: 'flex',
    margin: '0 auto',
  },
  back: {
    marginRight: md,
  },
  content: {
    backgroundColor: background,
  },
});

const subscription: FormSubscription = {
  valid: true,
  submitting: true,
  validating: true,
};

const Layout = ({
  classes,
  formRender,
  onSubmit,
  icon,
  primaryTitle,
  secondaryTitle,
  subtitle,
  nextMsg,
  renderHeader,
  leftMenu,
  validation,
}: Props): JSX.Element => (
  <MatchMediaContext.Consumer>
    {phone => (
      <Grid className={classes.content}>
        {!phone && (
          <GridItem sm={4} ref={ref} maxwidth="sm">
            <Block overlap>
              {leftMenu()}
              <Img src={icon === 'black' ? logoBlack : logo} alt="Logo" className={classes.logo} />
            </Block>
          </GridItem>
        )}
        <GridItem xs={12} sm={8} growSm={4} growElem={ref} variant="column">
          <Form onSubmit={onSubmit} subscription={subscription} validation={validation} grow>
            {({ valid, submitting, validating }: FormState) => (
              <React.Fragment>
                <Block scroll grow>
                  <Block offsetSm={2}>
                    {renderHeader ? renderHeader() : <EmptyHeader />}
                    <TitleSection primaryTitle={primaryTitle} secondaryTitle={secondaryTitle} phone={phone} />
                    <SubtitleSection text={subtitle} phone={phone} />
                    {formRender()}
                  </Block>
                </Block>
                <Hairline />
                <Block margin="md" />
                <Grid nowrap noshrink nogrow>
                  <GridItem xs={12} sm={12} grow center="xs" end="xs">
                    <Block margin="md" offsetSm={2} padding={phone ? 'lg' : 'xxl'}>
                      <Button
                        variant="continue"
                        color="primary"
                        type="submit"
                        disabled={!valid || submitting || validating}
                        size="large"
                        spinner={submitting || validating}
                      >
                        {`${nextMsg}\u00a0`}
                      </Button>
                    </Block>
                  </GridItem>
                </Grid>
              </React.Fragment>
            )}
          </Form>
        </GridItem>
      </Grid>
    )}
  </MatchMediaContext.Consumer>
);

export default withStyles(styles)(Layout);
