import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import { Block, makeStyles } from "medulas-react-components";
import React from "react";

const useAvatar = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#ffe152",
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  },
}));

interface Props {
  readonly id?: string;
  readonly icon: IconDefinition;
  readonly children?: React.ReactNode;
  readonly buttons?: React.ReactNode;
}

const PageContent = ({ id, icon, children, buttons }: Props): JSX.Element => {
  const avatarClasses = useAvatar();
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
      <Block width={650}>
        <Paper>
          <Block
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            marginTop={4}
            padding={5}
          >
            <Avatar classes={avatarClasses}>
              <FontAwesomeIcon icon={icon} color="#ffffff" />
            </Avatar>
            {children}
          </Block>
        </Paper>

        {buttons}
      </Block>
    </Block>
  );
};

export default PageContent;
