/* eslint-disable no-console */
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../../utils/storybook";
import Block from "../../Block";
import Grid from "../../Grid";
import GridItem from "../../GridItem";
import Form, { useForm } from "../Form";
import SelectField, { SelectFieldItem } from "../SelectField";
import TextField from "../TextField";
import InputGroup from "./index";

interface Props {
  readonly name: string;
  readonly label?: string;
  readonly defaultValue?: string;
  readonly value?: string;
  readonly helperText?: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly error?: boolean;
  readonly multiline?: boolean;
  readonly rows?: string | number;
  readonly rowsMax?: string | number;
}

const TextFieldExample = ({
  name,
  label,
  defaultValue,
  value,
  helperText,
  disabled,
  placeholder,
  error,
  multiline,
  rows,
  rowsMax,
}: Props): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action("Form submit"),
  });

  const items = [
    { name: "", additionalText: "" },
    { name: "Create new account", additionalText: "Hello world" },
    { name: "IOV2", additionalText: "This attr is optional" },
    { name: "ETH3" },
  ];

  const selectItem = (
    <SelectField
      items={items}
      initial={value}
      maxWidth="150px"
      form={form}
      fieldName={`${name}_select`}
      onChangeCallback={(item: SelectFieldItem) => console.log(`received ---> ${item.name}`)}
    />
  );

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup prepend={selectItem}>
        <TextField
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          helperText={helperText}
          form={form}
          name={name}
          disabled={disabled}
          error={error}
          multiline={multiline}
          rows={rows}
          rowsMax={rowsMax}
        />
      </InputGroup>
    </Form>
  );
};

const gridItemWidth = {
  xs: "100%",
  sm: "50%",
};

storiesOf(`${medulasRoot}/components/forms`, module).add("Input Group", () => (
  <Storybook>
    <Block marginTop={2} />
    <Grid flexWrap="wrap">
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample name="field-filled" defaultValue="test*iov" />
      </GridItem>
    </Grid>
  </Storybook>
));
