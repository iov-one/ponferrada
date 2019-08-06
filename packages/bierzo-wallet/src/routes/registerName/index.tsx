import React from "react";

import PageMenu from "../../components/PageMenu";
import Layout from "./components";

async function onSubmit(values: object): Promise<void> {
  console.log(values);
}

function onCancel(): void {
  console.log("on cancel");
}

const RegisterUsername = (): JSX.Element => {
  return (
    <PageMenu>
      <Layout onSubmit={onSubmit} onCancel={onCancel} />
    </PageMenu>
  );
};

export default RegisterUsername;
