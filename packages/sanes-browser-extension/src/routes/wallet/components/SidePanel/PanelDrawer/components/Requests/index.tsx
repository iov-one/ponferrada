import { Block } from "medulas-react-components";
import React, { useState } from "react";

import RequestList from "./RequestList";
import ShowRequest from "./ShowRequest";

// TODO find better way to calculate 100% of the parent component (panelWidth = 310px) minus 2 x 24px margins = 262px
const maxWidthWithMargins = "262px";

const Requests = (): JSX.Element => {
  const [showRequest, setShowRequest] = useState(false);

  const goBackToList = (): void => setShowRequest(false);

  return (
    <Block maxWidth={maxWidthWithMargins} marginLeft={3} marginRight={3}>
      {showRequest && <ShowRequest goBackToList={goBackToList} />}
      {!showRequest && <RequestList setShowRequest={setShowRequest} />}
    </Block>
  );
};

export default Requests;
