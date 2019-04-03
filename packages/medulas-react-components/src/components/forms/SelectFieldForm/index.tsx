import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useOpen } from '~/hooks/open';
import Image from '~/components/Image';
import Block from '~/components/Block';
import selectChevron from './assets/selectChevron.svg';
import { FormApi, FieldSubscription } from 'final-form';
import { useField } from '../Form';
import SelectItems from './SelectItems';

export interface Item {
  readonly name: string;
  readonly additionalText?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  dropdown: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '5px',
    padding: `0 ${theme.spacing(1)}`,
    cursor: 'pointer',
  },
  root: {
    fontSize: theme.typography.fontSize,
    height: '32px',
  },
  input: {
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center',
    cursor: 'pointer',
  },
}));

const CHEVRON_WIDTH = 8;

interface InnerProps {
  readonly fieldName: string;
  readonly initial: string;
  readonly form: FormApi;
  readonly onChangeCallback?: (value: Item) => void;
  readonly subscription?: FieldSubscription;
  readonly items: ReadonlyArray<Item>;
}

type Props = InnerProps & InputBaseProps;

const SelectFieldForm = ({
  fieldName,
  form,
  initial,
  items,
  onChangeCallback,
}: Props): JSX.Element => {
  const [isOpen, toggle] = useOpen();
  const [value, setValue] = React.useState<string>(initial);
  const classes = useStyles();
  const inputRef = React.useRef(null);
  const { input } = useField(fieldName, form);

  const { name, ...restInput } = input;
  const inputProps = { ...restInput, autoComplete: 'off' };
  delete inputProps.value;
  delete inputProps.onChange;
  const inputClasses = { root: classes.root, input: classes.input };

  const onAction = (item: Item): (() => void) => () => {
    setValue(item.name);
    if (onChangeCallback) {
      onChangeCallback(item);
    }
    toggle();
  };

  return (
    <React.Fragment>
      <div className={classes.dropdown} ref={inputRef} onClick={toggle}>
        <InputBase
          name={name}
          classes={inputClasses}
          inputProps={inputProps}
          value={value}
          readOnly
          role="button"
        />
        <Image
          noShrink
          src={selectChevron}
          alt="Phone Menu"
          width={`${CHEVRON_WIDTH}`}
          height="5"
        />
      </div>
      <Popper
        open={isOpen}
        anchorEl={inputRef.current}
        placement="bottom-start"
      >
        {() => (
          <Block marginTop={1}>
            <SelectItems selectedItem={value} items={items} action={onAction} />
          </Block>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default SelectFieldForm;
