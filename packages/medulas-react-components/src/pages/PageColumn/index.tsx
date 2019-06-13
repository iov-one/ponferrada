import { makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Form, { useForm } from '../../components/forms/Form';
import Block from '../../components/Block';
import Button from '../../components/Button';
import Hairline from '../../components/Hairline';
import Img from '../../components/Image';
import logo from '../assets/logo.svg';
import logoBlack from '../assets/logoBlack.svg';
import EmptyHeader from './EmptyHeader';
import SubtitleSection from './SubtitleSection';
import TitleSection from './TitleSection';
import useTheme from '@material-ui/styles/useTheme';
import { FormApi } from 'final-form';

interface Props {
  readonly leftMenu: () => JSX.Element;

  readonly icon: 'white' | 'black';
  readonly nextMsg: string;
  readonly onSubmit: (values: object) => void;
  readonly formRender: (form: FormApi) => JSX.Element;
  readonly validation?: (values: object) => object | Promise<object>;

  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly subtitle: string;

  readonly renderHeader?: () => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    bottom: '80px',
    position: 'relative',
    display: 'flex',
    margin: '0 auto',
  },
  form: {
    width: '100%',
    height: '100%',
  },
}));

const Layout = ({
  formRender,
  onSubmit,
  icon,
  primaryTitle,
  secondaryTitle,
  subtitle,
  nextMsg,
  renderHeader,
  leftMenu,
}: Props): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const { form, handleSubmit, submitting, invalid, validating } = useForm({
    onSubmit,
  });

  return (
    <Block
      display="flex"
      flex="1 1 auto"
      flexDirection="row"
      flexWrap="wrap"
      bgcolor={theme.palette.background.paper}
    >
      <Block>
        {leftMenu()}
        <Img src={icon === 'black' ? logoBlack : logo} alt="Logo" className={classes.logo} />
      </Block>
      <Block flexGrow={1}>
        <Form onSubmit={handleSubmit}>
          <Block display="flex" flexDirection="column">
            <Block scroll>
              <Block marginLeft="8.333%" marginRight="8.333%">
                {renderHeader ? renderHeader() : <EmptyHeader />}
                <TitleSection primaryTitle={primaryTitle} secondaryTitle={secondaryTitle} />
                <SubtitleSection text={subtitle} />
                {formRender(form)}
              </Block>
            </Block>
            <Block>
              <Hairline />
              <Block>
                <Block margin={2} />
                <Block display="flex" justifyContent="flex-end">
                  <Button
                    variant="continue"
                    color="primary"
                    type="submit"
                    disabled={invalid || submitting || validating}
                    size="large"
                    spinner={submitting || validating}
                  >
                    {`${nextMsg}\u00a0`}
                  </Button>
                </Block>
              </Block>
            </Block>
          </Block>
        </Form>
      </Block>
    </Block>
  );
};

export default Layout;
