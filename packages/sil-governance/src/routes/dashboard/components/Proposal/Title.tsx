import { Block, makeStyles, Typography } from "medulas-react-components";
import React from "react";

const useStyles = makeStyles({
  title: {
    wordBreak: "break-all",
  },
});

interface Props {
  readonly title: string;
}

const Title = ({ title }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block display="flex" alignItems="center">
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
    </Block>
  );
};

export default Title;
