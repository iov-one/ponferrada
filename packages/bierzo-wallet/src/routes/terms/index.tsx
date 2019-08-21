import * as React from "react";

import PageMenuColumn from "../../components/PageMenuColumn";
import Layout from "./components";

export default class Terms extends React.Component {
  public render(): JSX.Element {
    return (
      <PageMenuColumn maxWidth={960}>
        <Layout />
      </PageMenuColumn>
    );
  }
}
