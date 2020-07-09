import {
  Block,
  Form,
  Image,
  SelectField,
  SelectFieldItem,
  Typography,
  useForm,
} from "medulas-react-components";
import * as React from "react";

import arrowLeft from "../../../assets/arrowLeft.svg";
import arrowRight from "../../../assets/arrowRight.svg";

interface Props {
  readonly onChangeRows: (item: SelectFieldItem | undefined) => void;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

const rowsSelectorData: readonly SelectFieldItem[] = [
  { name: "5" },
  { name: "10" },
  { name: "25" },
  { name: "50" },
];

const onSubmit = (): void => {};

const TxTableFooter = ({ onChangeRows, onPrevPage, onNextPage }: Props): JSX.Element => {
  const { handleSubmit, form } = useForm({
    onSubmit,
  });

  return (
    <React.Fragment>
      <Block margin={1} />
      <Block display="flex" alignItems="center" paddingLeft={3} paddingRight={3}>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular">
          Rows per page
        </Typography>
        <Block padding={0.5} />
        <Form onSubmit={handleSubmit}>
          <SelectField
            items={rowsSelectorData}
            initial={rowsSelectorData[0].name}
            form={form}
            fieldName="rows-per-page"
            onChangeCallback={onChangeRows}
            maxWidth="40px"
          />
        </Form>
        <Image src={arrowLeft} alt="Previous page" width={40} height={40} onClick={onPrevPage} />
        <Image src={arrowRight} alt="Next page" width={40} height={40} onClick={onNextPage} />
      </Block>
      <Block margin={1} />
    </React.Fragment>
  );
};

export default TxTableFooter;
