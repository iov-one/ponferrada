import { faRegistered } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import Block from "medulas-react-components/lib/components/Block";
import Button from "medulas-react-components/lib/components/Button";
import Back from "medulas-react-components/lib/components/Button/Back";
import Form, { useForm } from "medulas-react-components/lib/components/forms/Form";
import TextFieldForm from "medulas-react-components/lib/components/forms/TextFieldForm";
import makeStyles from "medulas-react-components/lib/theme/utils/styles";
import React from "react";

import AddressesTable from "../../../components/AddressesTable";

export const SET_USERNAME_VIEW_ID = "set-username-view-id";
export const SET_USERNAME_FIELD = "set-username-field";

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
  readonly onSubmit: (values: object) => Promise<void>;
  readonly onCancel: () => void;
}

const Layout = ({ onSubmit, onCancel }: Props): JSX.Element => {
  const avatarClasses = useAvatar();
  const theme = useTheme<Theme>();

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <Block
      id={SET_USERNAME_VIEW_ID}
      marginTop={4}
      display="flex"
      alignContent="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
    >
      <Form onSubmit={handleSubmit}>
        <Block width={650}>
          <Paper>
            <Block
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              marginTop={4}
              paddingTop={5}
              padding={3}
            >
              <Avatar classes={avatarClasses}>
                <FontAwesomeIcon icon={faRegistered} color="#ffffff" />
              </Avatar>
              <Block width="100%" marginTop={2} marginBottom={1}>
                <TextFieldForm
                  name={SET_USERNAME_FIELD}
                  form={form}
                  placeholder="Register IOV username"
                  fullWidth
                  margin="none"
                />
              </Block>
            </Block>
          </Paper>

          <Paper>
            <Block
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              marginTop={4}
              paddingTop={5}
              padding={3}
            >
              <AddressesTable />
            </Block>
          </Paper>

          <Block
            marginTop={4}
            marginBottom={1}
            justifyContent="center"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Block width="75%">
              <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
                Register
              </Button>
            </Block>
            <Block width="75%" marginTop={1}>
              <Back fullWidth disabled={submitting} onClick={onCancel}>
                Cancel
              </Back>
            </Block>
          </Block>
        </Block>
      </Form>
    </Block>
  );
};

export default Layout;
