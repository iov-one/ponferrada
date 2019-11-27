import { Block, Image, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import greenRightChevron from "../../assets/chevronRightGreen.svg";

const useStyles = makeStyles({
  listItem: {
    padding: "16px 24px",
  },
});

interface Props {
  readonly onClick: () => void;
  readonly icon: string;
  readonly title: string;
  readonly numItems: number;
}

const CollectibleItem = ({ onClick, icon, title, numItems }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <ListItem button onClick={onClick} className={classes.listItem}>
      <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Block display="flex" alignItems="center">
          <Image alt={title} src={icon} />
          <Block marginLeft={2}>
            <Typography variant="body2">{title}</Typography>
            <Block marginTop={0.5} />
            <Typography variant="body2" color="textPrimary">
              {numItems} items
            </Typography>
          </Block>
        </Block>
        <Image alt="Right Chevron" src={greenRightChevron} />
      </Block>
    </ListItem>
  );
};

export default CollectibleItem;
