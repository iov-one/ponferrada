import { makeStyles, Theme } from '@material-ui/core';
import useTheme from '@material-ui/styles/useTheme';
import { FormApi } from 'final-form';
import React from 'react';
import Block from '../../components/Block';
import BoxScroll from '../../components/BoxScroll';
import Button from '../../components/Button';
import Form, { useForm } from '../../components/forms/Form';
import Hairline from '../../components/Hairline';
import Img from '../../components/Image';
import logo from '../../theme/assets/pageColumn/logo.svg';
import logoBlack from '../../theme/assets/pageColumn/logoBlack.svg';
import people from '../../theme/assets/pageColumn/People.svg';
import EmptyHeader from './EmptyHeader';
import SubtitleSection from './SubtitleSection';
import TitleSection from './TitleSection';

interface Props {
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
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
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
}: Props): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const { form, handleSubmit, submitting, invalid, validating } = useForm({
    onSubmit,
  });

  return (
    <Block
      display="flex"
      flexGrow={1}
      flexShrink={1}
      flexDirection="row"
      flexWrap="wrap"
      bgcolor={theme.palette.background.paper}
    >
      <Block>
        <Img src={people} alt="Log in Image" cover />
        <Img src={icon === 'black' ? logoBlack : logo} alt="Logo" className={classes.logo} />
      </Block>
      <Block flexGrow={1}>
        <Form onSubmit={handleSubmit} className={classes.form}>
          <BoxScroll flexGrow={1}>
            <Block marginLeft="8.333%" marginRight="8.333%">
              {renderHeader ? renderHeader() : <EmptyHeader />}
              <TitleSection primaryTitle={primaryTitle} secondaryTitle={secondaryTitle} />
              <SubtitleSection text={subtitle} />
              {formRender(form)}
            </Block>
          </BoxScroll>
          <Hairline />
          <Block padding={2} marginRight={8} display="flex" justifyContent="flex-end">
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
        </Form>
      </Block>
    </Block>
  );
};

export default Layout;
