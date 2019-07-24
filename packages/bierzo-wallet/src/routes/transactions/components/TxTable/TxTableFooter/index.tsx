import { makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Form, { useForm } from 'medulas-react-components/lib/components/forms/Form';
import SelectFieldForm, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import arrowLeft from '../../../assets/arrowLeft.svg';
import arrowRight from '../../../assets/arrowRight.svg';

const useStyles = makeStyles({
  footer: {
    display: 'flex',
    alignItems: 'center',
  },
});

interface Props {
  readonly onChangeRows: (item: Item) => void;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

const rowsSelectorData: ReadonlyArray<Item> = [{ name: '5' }, { name: '10' }, { name: '25' }, { name: '50' }];

const onSubmit = (): void => {};

const TxTableFooter = ({ onChangeRows, onPrevPage, onNextPage }: Props): JSX.Element => {
  const classes = useStyles();

  const { handleSubmit, form } = useForm({
    onSubmit,
  });

  return (
    <React.Fragment>
      <Block margin={1} />
      <Block paddingLeft={3} paddingRight={3} className={classes.footer}>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular">
          Rows per page
        </Typography>
        <Block padding={0.5} />
        <Form onSubmit={handleSubmit}>
          <SelectFieldForm
            items={rowsSelectorData}
            initial={rowsSelectorData[0].name}
            form={form}
            fieldName="rows-per-page"
            onChangeCallback={onChangeRows}
            maxWidth="40px"
          />
        </Form>
        <Img src={arrowLeft} alt="Previous page" width={40} height={40} onClick={onPrevPage} />
        <Img src={arrowRight} alt="Next page" width={40} height={40} onClick={onNextPage} />
      </Block>
      <Block margin={1} />
    </React.Fragment>
  );
};

export default TxTableFooter;
