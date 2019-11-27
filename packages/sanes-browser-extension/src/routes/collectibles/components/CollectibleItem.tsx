import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

const useStyles = makeStyles({
  collectibleIcon: {
    height: "40px",
  },
});

interface Props {
  readonly icon: string;
  readonly text: string;
}

const CollectibleItem = ({ icon, text }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block
      display="flex"
      alignItems="center"
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={3}
      paddingRight={3}
    >
      <Image alt={`${text} Icon`} src={icon} className={classes.collectibleIcon} />
      <Block marginLeft={2}>
        <Typography variant="body2">{text}</Typography>
      </Block>
    </Block>
  );
};

export default CollectibleItem;
