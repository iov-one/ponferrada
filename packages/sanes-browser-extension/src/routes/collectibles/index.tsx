import IconButton from "@material-ui/core/IconButton";
import { Block, Hairline, Image, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import SimplePageLayout from "../../components/SimplePageLayout";
import { history } from "../../utils/history";
import { COLLECTIBLES_ROUTE, WALLET_STATUS_ROUTE } from "../paths";
import chevronLeft from "./assets/chevronLeft.svg";
import CollectibleItem from "./components/CollectibleItem";

const useStyles = makeStyles({
  boxBackground: {
    backgroundColor: "#fff",
  },
  chevronIcon: {
    margin: 0,
    padding: 0,
  },
  chevronButton: {
    height: "20px",
  },
});

const goBack = (): void => {
  history.push(WALLET_STATUS_ROUTE);
};

const Collectibles = ({ location }: RouteComponentProps): JSX.Element => {
  const classes = useStyles();
  const title: string = location.state["type"];
  const icon: string = location.state["icon"];
  const collectibles: string[] = location.state["collectibles"];

  return (
    <SimplePageLayout id={COLLECTIBLES_ROUTE}>
      <Block
        paddingLeft={3}
        paddingRight={3}
        height="103px"
        display="flex"
        alignItems="center"
        className={classes.boxBackground}
      >
        <IconButton className={classes.chevronIcon} onClick={goBack}>
          <Image alt="Back Button" src={chevronLeft} className={classes.chevronButton} />
        </IconButton>
        <Block marginLeft={2}>
          <Typography variant="h5">{title}</Typography>
        </Block>
      </Block>
      <Block marginTop={3} />
      <Block className={classes.boxBackground}>
        {collectibles.map((text: string, index: number) => (
          <React.Fragment>
            {index > 0 && (
              <Block marginLeft={3}>
                <Hairline color="#f3f3f3" />
              </Block>
            )}
            <CollectibleItem icon={icon} text={text} />
          </React.Fragment>
        ))}
      </Block>
    </SimplePageLayout>
  );
};

export default Collectibles;
