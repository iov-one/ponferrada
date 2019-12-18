/* eslint-disable no-console */
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../../utils/storybook";
import Block from "../../Block";
import Button from "../../Button";
import Form, { FormValues, useForm, ValidationError } from "../Form";
import SelectField, { SelectFieldItem } from "./index";

interface Props {
  readonly value?: string;
  readonly fieldName: string;
  readonly placeholder?: string;
}

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  if (!formValues["SELECT_FIELD_ATTR_EMPTY"]) {
    errors["SELECT_FIELD_ATTR_EMPTY"] = "Field is required";
  }
  return errors;
};

const SelectFieldExample = ({ value, fieldName, placeholder }: Props): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action("Form submit"),
    validate,
  });

  const items = [
    { name: "Create new account", additionalText: "Hello world" },
    { name: "IOV2", additionalText: "This attr is optional" },
    { name: "ETH3" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <SelectField
        items={items}
        initial={value}
        form={form}
        fieldName={fieldName}
        placeholder={placeholder}
        onChangeCallback={(item: SelectFieldItem | undefined) => {
          if (item) {
            console.log(`received ---> ${item.name}`);
          } else {
            console.log("Default item was selected");
          }
        }}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

storiesOf(`${medulasRoot}/components/forms`, module).add("SelectField", () => (
  <Storybook>
    <Block marginBottom={2}>
      <SelectFieldExample value="IOV2" fieldName="SELECT_FIELD_ATTR" />
    </Block>
    <Block marginBottom={2}>
      <SelectFieldExample fieldName="SELECT_FIELD_ATTR_EMPTY" />
    </Block>
    <Block marginBottom={2}>
      <SelectFieldExample fieldName="SELECT_FIELD_ATTR_PLACEHOLDER" placeholder="Select" />
    </Block>
  </Storybook>
));
