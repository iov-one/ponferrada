import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../../utils/storybook";
import Form, { useForm } from "../Form";
import DateTimePicker from "./index";

interface Props {
  readonly name: string;
}

const DateTimePickerExample = ({ name }: Props): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action("Form submit"),
  });

  return (
    <Form onSubmit={handleSubmit}>
      <DateTimePicker name={name} form={form} />
    </Form>
  );
};

storiesOf(`${medulasRoot}/components/forms`, module).add("DateTimePicker", () => (
  <Storybook>
    <DateTimePickerExample name="When" />
  </Storybook>
));
