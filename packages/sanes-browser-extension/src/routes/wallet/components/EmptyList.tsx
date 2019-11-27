import { Block, Image, ListItem, ListItemIcon, ListItemText, Typography } from "medulas-react-components";
import * as React from "react";

interface Props {
  readonly src: string;
  readonly alt: string;
  readonly text: string;
  readonly subText?: string;
}

const EmptyList = ({ src, alt, text, subText }: Props): JSX.Element => {
  return (
    <ListItem disableGutters>
      <Block width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Block marginTop={3} marginBottom={2}>
          <ListItemIcon>
            <Image src={src} alt={alt} height="72" />
          </ListItemIcon>
        </Block>
        <ListItemText>
          <Typography variant="body1">{text}</Typography>
        </ListItemText>
        <Block marginTop={1} marginLeft={5} marginRight={5} textAlign="center">
          <ListItemText>
            <Typography variant="body2" color="textPrimary">
              {subText}
            </Typography>
          </ListItemText>
        </Block>
      </Block>
    </ListItem>
  );
};

export default EmptyList;
