import {
  ExecuteMigrationAction,
  SetAccountConfigurationAction,
  SetCashConfigurationAction,
  SetMsgFeeConfigurationAction,
  SetPreRegistrationConfigurationAction,
  SetQualityScoreConfigurationAction,
  SetTermDepositConfigurationAction,
  SetTxFeeConfigurationAction,
  UpgradeSchemaAction,
} from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly action:
    | ExecuteMigrationAction
    | SetAccountConfigurationAction
    | SetCashConfigurationAction
    | SetMsgFeeConfigurationAction
    | SetPreRegistrationConfigurationAction
    | SetQualityScoreConfigurationAction
    | SetTermDepositConfigurationAction
    | SetTxFeeConfigurationAction
    | UpgradeSchemaAction;
}

const GenericProposal = ({ action }: Props): JSX.Element => {
  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        {action.kind}:
      </Typography>
      <Block marginTop={0.5}>
        <Typography variant="body2">{JSON.stringify(action)}</Typography>
      </Block>
    </Block>
  );
};

export default GenericProposal;
