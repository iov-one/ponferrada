import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import { Block, makeStyles } from "medulas-react-components";
import React from "react";

interface AvatarStyleProps {
  readonly bgcolor: string;
}

const useAvatar = makeStyles<Theme, AvatarStyleProps>({
  root: props => ({
    backgroundColor: props.bgcolor,
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  }),
});

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

interface Props {
  readonly id?: string;
  readonly icon: React.ReactNode;
  readonly avatarColor?: string;
  readonly width?: number | string;
  readonly children?: React.ReactNode;
  readonly buttons?: React.ReactNode;
}
function PageContent({
  id,
  icon,
  children,
  buttons,
  avatarColor = "#ffe152",
  width = 650,
}: Props): React.ReactElement {
  const avatarClasses = useAvatar({ bgcolor: avatarColor });
  const paperClasses = usePaper();
  const theme = useTheme<Theme>();

  return (
    <Block
      id={id}
      marginTop={4}
      display="flex"
      alignContent="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
    >
      <Block width={width}>
        <Paper classes={paperClasses}>
          <Block
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            marginTop={4}
            padding={5}
            border="1px solid #F3F3F3"
          >
            <Avatar classes={avatarClasses}>{icon}</Avatar>
            {children}
          </Block>
        </Paper>

        {buttons}
      </Block>
    </Block>
  );
}

export default PageContent;
