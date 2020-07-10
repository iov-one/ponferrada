import * as React from "react";

import PageMenuColumn from "../../components/PageMenuColumn";
import Layout from "./components";

class Terms extends React.Component {
  public render(): React.ReactElement {
    return (
      <PageMenuColumn maxWidth={960}>
        <Layout />
      </PageMenuColumn>
    );
  }
}

export default Terms;
