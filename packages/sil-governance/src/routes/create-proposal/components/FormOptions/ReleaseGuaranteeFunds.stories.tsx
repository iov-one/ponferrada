import { TokenTicker } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { useForm } from "medulas-react-components";
import React from "react";

import DecoratedStorybook, { governanceRoot } from "../../../../utils/storybook";
import ReleaseGuaranteeFunds from "./ReleaseGuaranteeFunds";

const initialTickers = ["BASH" as TokenTicker, "CASH" as TokenTicker];

storiesOf(governanceRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("ReleaseGuaranteeFunds", () => {
    const { form } = useForm({ onSubmit: () => 0 });
    return (
      <DecoratedStorybook>
        <ReleaseGuaranteeFunds form={form} initialTickers={initialTickers} />
      </DecoratedStorybook>
    );
  });
