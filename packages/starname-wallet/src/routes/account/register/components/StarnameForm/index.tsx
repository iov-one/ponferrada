import { FormHelperText, OutlinedInput } from "@material-ui/core";
import { RpcEndpoint } from "communication/rpcEndpoint";
import { TooltipContent } from "components/AccountManage";
import LedgerBillboardMessage from "components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "components/BillboardMessage/NeumaBillboardMessage";
import PageContent from "components/PageContent";
import { FormStatus } from "forms";
// import { getCurrentSigner, Signer } from "logic/signer";
import { Account } from "logic/api";
import { Task } from "logic/http";
import {
  BillboardContext,
  Block,
  Form,
  Image,
  ToastContext,
  ToastVariant,
  Tooltip,
  Typography,
} from "medulas-react-components";
import React from "react";
import { Buttons } from "routes/account/register/components/StarnameForm/buttons";
import { starnameValidator } from "routes/account/register/components/StarnameForm/helpers";
import { NoStarnameHeader } from "routes/account/register/components/StarnameForm/noStarnameHeader";
import {
  Action,
  initialState,
  reducer,
  StarnameFormActions,
  State,
} from "routes/account/register/components/StarnameForm/reducer";
import { ErrorParser } from "ui-logic";

import shield from "../../assets/shield.svg";

export const REGISTER_STARNAME_VIEW_ID = "register-starname-view-id";
export const REGISTER_STARNAME_FIELD = "register-starname-field";

interface Props {
  readonly onCancel: () => void;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const StarnameForm = ({ rpcEndpoint, onCancel, setTransactionId }: Props): React.ReactElement => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const inputField: React.Ref<HTMLInputElement> = React.createRef<HTMLInputElement>();
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initialState);
  const { starname, status, error } = state;

  const handleSubmit = async (/* event?: React.SyntheticEvent<HTMLFormElement>*/): Promise<
    object | undefined
  > => {
    // FIXME: this is in fact not being used for now, it's the original code
    //        with some stuff commented out to allow compilation to work
    try {
      const request = {};
      if (rpcEndpoint.type === "extension") {
        billboard.show(
          <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "start",
          "flex-end",
          0,
        );
      } else {
        billboard.show(
          <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "center",
          "center",
          0,
        );
      }
      const transactionId: string | undefined = await rpcEndpoint.executeRequest(request);
      if (transactionId === undefined) {
        toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
        /* } else if (transactionId === null) {
          toast.show("Request rejected", ToastVariant.ERROR);*/
      } else {
        setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
    return undefined;
  };

  React.useEffect(() => {
    // If the input is empty, we reset the form
    if (starname.length === 0) {
      dispatch({
        type: StarnameFormActions.RESET_ALL,
      });
      return;
    }
    dispatch({
      type: StarnameFormActions.SET_FORM_STATUS,
      payload: FormStatus.Validating,
    });
    // If there's a validation error, we show it
    // right away
    const error: string | undefined = starnameValidator(starname);
    if (error !== undefined) {
      dispatch({
        type: StarnameFormActions.SET_FORMAT_ERROR,
        payload: error,
      });
      return;
    }
    // Finally, let's check that the starname is new
    const task: Task<Account> = rpcEndpoint.resolveStarname(starname);
    task
      .run()
      .then(() => {
        dispatch({
          type: StarnameFormActions.SET_STARNAME_EXISTS_ERROR,
        });
      })
      .catch(() => {
        dispatch({
          type: StarnameFormActions.SET_VALIDATION_SUCCEEDED,
        });
      });
    return () => {
      task.abort();
    };
  }, [rpcEndpoint, starname]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      currentTarget: { value },
    } = event;
    dispatch({
      type: StarnameFormActions.SET_STARNAME,
      payload: value,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PageContent
        id={REGISTER_STARNAME_VIEW_ID}
        buttons={<Buttons status={status} onCancel={onCancel} />}
        icon={<Image src={shield} alt="shield" />}
        avatarColor="#31E6C9"
      >
        <Block width="100%" textAlign="left">
          <Block display="flex" justifyContent="space-between" marginBottom={1}>
            <Typography variant="subtitle2" weight="semibold">
              Register your starname
            </Typography>
            <Block display="flex" alignItems="center">
              <Tooltip maxWidth={320}>
                <TooltipContent header={<NoStarnameHeader />} title="Choose your address">
                  With IOV you can choose your easy to read human readable address. No more complicated
                  cryptography when sending to friends.
                </TooltipContent>
              </Tooltip>
              <Block marginRight={1} />
              <Typography variant="subtitle2" inline weight="regular">
                How it works
              </Typography>
            </Block>
          </Block>
          <Block width="100%" marginBottom={1}>
            <OutlinedInput
              ref={inputField}
              fullWidth={true}
              labelWidth={0}
              placeholder={"eg. *starname"}
              error={error !== undefined}
              spellCheck={false}
              onChange={onChange}
            />
            <FormHelperText error={error !== undefined}>{error}</FormHelperText>
          </Block>
        </Block>
      </PageContent>
    </Form>
  );
};

export default StarnameForm;
