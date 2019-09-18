import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Storybook } from "../../../utils/storybook";
import Block from "../../Block";
import Grid from "../../Grid";
import GridItem from "../../GridItem";
import Form, { useForm } from "../Form";
import TextField from "./index";

interface Props {
  readonly name: string;
  readonly label: string;
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

  return (
    <Form onSubmit={handleSubmit}>
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
    </Form>
  );
};

const gridItemWidth = {
  xs: "100%",
  sm: "50%",
};

storiesOf("Components/forms", module).add("TextField", () => (
  <Storybook>
    <Block marginTop={2} />
    <Grid flexWrap="wrap">
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample
          name="field-with-error"
          label="Error"
          defaultValue="Standard Error"
          helperText="This is an error message"
          error
        />
      </GridItem>
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample name="field-filled" label="Filled" defaultValue="test*iov" />
      </GridItem>
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample disabled name="standard-disabled" label="Disabled" defaultValue="Disabled input" />
      </GridItem>
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample
          name="standard-with-placeholder"
          label="Empty"
          placeholder="IOV or wallet address"
        />
      </GridItem>
      <GridItem marginBottom={4} width={gridItemWidth}>
        <TextFieldExample
          multiline
          rows={5}
          name="standard-with-placeholder"
          label="Empty"
          value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
        />
      </GridItem>
    </Grid>
  </Storybook>
));
