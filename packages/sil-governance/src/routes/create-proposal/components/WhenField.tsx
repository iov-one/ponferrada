import { FormApi } from "final-form";
import { Block, DateTimePicker, Typography } from "medulas-react-components";
import React from "react";

const WHEN_FIELD = "When";
export const DATE_FIELD = "Date";

export const getNextMinuteDate = (): Date => new Date(new Date().getTime() + 60 * 1000);
const getNextWeekDate = (): Date => new Date(new Date().getTime() + 7 * 24 * 3600 * 1000);

interface Props {
  readonly form: FormApi;
}

const WhenField = ({ form }: Props): JSX.Element => {
  const minDate = getNextMinuteDate();
  const maxDate = getNextWeekDate();

  return (
    <Block>
      <Typography>{WHEN_FIELD}</Typography>
      <DateTimePicker
        name={DATE_FIELD}
        form={form}
        strictCompareDates
        disablePast
        minDate={minDate}
        maxDate={maxDate}
        ampm={false}
      />
    </Block>
  );
};

export default WhenField;
