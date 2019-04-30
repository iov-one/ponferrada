import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FormApi, FieldSubscription } from 'final-form';
import { useField } from 'react-final-form-hooks';
import * as React from 'react';
import selectChevron from '../../../theme/assets/selectField/selectChevron.svg';
import { useOpen } from '../../../hooks/open';
import Image from '../../Image';
import Block from '../../Block';
import SelectItems from './SelectItems';

export interface Item {
  readonly name: string;
  readonly additionalText?: string;
}

interface RootStyleProps {
  readonly maxWidth: number | string;
}

const useStyles = makeStyles<Theme, RootStyleProps>((theme: Theme) => ({
  dropdown: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '5px',
    padding: `0 ${theme.spacing(1)}px`,
    cursor: 'pointer',
  },
  root: props => ({
    fontSize: theme.typography.subtitle2.fontSize,
    height: '32px',
    maxWidth: props.maxWidth,
  }),
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
  readonly maxWidth?: string;
}

export type Props = InnerProps & InputBaseProps;

const SelectFieldForm = ({
  fieldName,
  form,
  initial,
  items,
  onChangeCallback,
  maxWidth = '100%',
}: Props): JSX.Element => {
  const [isOpen, toggle] = useOpen();
  const classes = useStyles({ maxWidth });
  const inputRef = React.useRef(null);
  const { input } = useField(fieldName, form);

  const { name, onChange, value, ...restInput } = input;
  const inputProps = { ...restInput, autoComplete: 'off' };

  // TODO due a bug in rffH I can not use ", [])", so for setting initial value in form
  // I have to hack in this way. Fix it.
  // https://reactjs.org/docs/forms.html
  // https://reactjs.org/docs/uncontrolled-components.html
  React.useEffect(() => {
    try {
      const firstRender = value === '';
      if (firstRender) {
        onChange(initial);
      }
    } catch (err) {}
  }, [input]);
  const inputClasses = { root: classes.root, input: classes.input };

  const onAction = (item: Item): (() => void) => () => {
    onChange(item.name);
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
        <Image noShrink src={selectChevron} alt="Phone Menu" width={`${CHEVRON_WIDTH}`} height="5" />
      </div>
      <Popper open={isOpen} anchorEl={inputRef.current} placement="bottom-start">
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
