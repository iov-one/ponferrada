import {
  Address,
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  UnsignedTransaction,
} from "@iov/bcp";
import {
  AddAccountCertificateTx,
  DeleteAccountCertificateTx,
  DeleteAccountTx,
  DeleteAllAccountsTx,
  DeleteDomainTx,
  isAddAccountCertificateTx,
  isDeleteAccountCertificateTx,
  isDeleteAccountTx,
  isDeleteAllAccountsTx,
  isDeleteDomainTx,
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRenewAccountTx,
  isRenewDomainTx,
  isReplaceAccountMsgFeesTx,
  isReplaceAccountTargetsTx,
  isTransferAccountTx,
  isTransferDomainTx,
  isUpdateAccountConfigurationTx,
  RegisterAccountTx,
  RegisterDomainTx,
  RenewAccountTx,
  RenewDomainTx,
  ReplaceAccountMsgFeesTx,
  ReplaceAccountTargetsTx,
  TransferAccountTx,
  TransferDomainTx,
  UpdateAccountConfigurationTx,
} from "@iov/bns";

import { ProcessedSendTransaction } from "../../../store/notifications";
import { BwParser, ProcessedTx } from "../types/BwParser";
import { BwAddAccountCertificateParser } from "./BwAddAccountCertificateTx";
import { BwDeleteAccountCertificateParser } from "./BwDeleteAccountCertificateTx";
import { BwDeleteAccountParser } from "./BwDeleteAccountTx";
import { BwDeleteAllAccountsParser } from "./BwDeleteAllAccountsTx";
import { BwDeleteDomainParser } from "./BwDeleteDomainTx";
import { BwRegisterAccountParser } from "./BwRegisterAccountTx";
import { BwRegisterDomainParser } from "./BwRegisterDomainTx";
import { BwRenewAccountParser } from "./BwRenewAccountTx";
import { BwRenewDomainParser } from "./BwRenewDomainTx";
import { BwReplaceAccountMsgFeesParser } from "./BwReplaceAccountMsgFeesTx";
import { BwReplaceAccountTargetsParser } from "./BwReplaceAccountTargetsTx";
import { BwSendParser } from "./BwSendTransaction";
import { BwTransferAccountParser } from "./BwTransferAccountTx";
import { BwTransferDomainParser } from "./BwTransferDomainTx";
import { BwUnkownParser } from "./BwUnkownTransaction";
import { BwUpdateAccountConfigurationParser } from "./BwUpdateAccountConfigurationTx";

function isProcessedSendTransaction(tx: ProcessedTx): tx is ProcessedSendTransaction {
  return isSendTransaction(tx.original);
}

function isProcessedRegisterDomainTx(tx: ProcessedTx): tx is ProcessedTx<RegisterDomainTx> {
  return isRegisterDomainTx(tx.original);
}

function isProcessedTransferDomainTx(tx: ProcessedTx): tx is ProcessedTx<TransferDomainTx> {
  return isTransferDomainTx(tx.original);
}

function isProcessedRenewDomainTx(tx: ProcessedTx): tx is ProcessedTx<RenewDomainTx> {
  return isRenewDomainTx(tx.original);
}

function isProcessedDeleteDomainTx(tx: ProcessedTx): tx is ProcessedTx<DeleteDomainTx> {
  return isDeleteDomainTx(tx.original);
}

function isProcessedRegisterAccountTx(tx: ProcessedTx): tx is ProcessedTx<RegisterAccountTx> {
  return isRegisterAccountTx(tx.original);
}

function isProcessedTransferAccountTx(tx: ProcessedTx): tx is ProcessedTx<TransferAccountTx> {
  return isTransferAccountTx(tx.original);
}

function isProcessedReplaceAccountTargetsTx(tx: ProcessedTx): tx is ProcessedTx<ReplaceAccountTargetsTx> {
  return isReplaceAccountTargetsTx(tx.original);
}

function isProcessedDeleteAccountTx(tx: ProcessedTx): tx is ProcessedTx<DeleteAccountTx> {
  return isDeleteAccountTx(tx.original);
}

function isProcessedDeleteAllAccountsTx(tx: ProcessedTx): tx is ProcessedTx<DeleteAllAccountsTx> {
  return isDeleteAllAccountsTx(tx.original);
}

function isProcessedRenewAccountTx(tx: ProcessedTx): tx is ProcessedTx<RenewAccountTx> {
  return isRenewAccountTx(tx.original);
}

function isProcessedAddAccountCertificateTx(tx: ProcessedTx): tx is ProcessedTx<AddAccountCertificateTx> {
  return isAddAccountCertificateTx(tx.original);
}

function isProcessedReplaceAccountMsgFeesTx(tx: ProcessedTx): tx is ProcessedTx<ReplaceAccountMsgFeesTx> {
  return isReplaceAccountMsgFeesTx(tx.original);
}

function isProcessedDeleteAccountCertificateTx(
  tx: ProcessedTx,
): tx is ProcessedTx<DeleteAccountCertificateTx> {
  return isDeleteAccountCertificateTx(tx.original);
}

function isProcessedUpdateAccountConfigurationTx(
  tx: ProcessedTx,
): tx is ProcessedTx<UpdateAccountConfigurationTx> {
  return isUpdateAccountConfigurationTx(tx.original);
}

export class BwParserFactory {
  public static getReactComponent(tx: ProcessedTx, userAddresses: readonly Address[]): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().graphicalRepresentation(tx, userAddresses);
    } else if (isProcessedRegisterDomainTx(tx)) {
      return new BwRegisterDomainParser().graphicalRepresentation(tx);
    } else if (isProcessedTransferDomainTx(tx)) {
      return new BwTransferDomainParser().graphicalRepresentation(tx);
    } else if (isProcessedRenewDomainTx(tx)) {
      return new BwRenewDomainParser().graphicalRepresentation(tx);
    } else if (isProcessedDeleteDomainTx(tx)) {
      return new BwDeleteDomainParser().graphicalRepresentation(tx);
    } else if (isProcessedRegisterAccountTx(tx)) {
      return new BwRegisterAccountParser().graphicalRepresentation(tx);
    } else if (isProcessedTransferAccountTx(tx)) {
      return new BwTransferAccountParser().graphicalRepresentation(tx);
    } else if (isProcessedReplaceAccountTargetsTx(tx)) {
      return new BwReplaceAccountTargetsParser().graphicalRepresentation(tx);
    } else if (isProcessedDeleteAccountTx(tx)) {
      return new BwDeleteAccountParser().graphicalRepresentation(tx);
    } else if (isProcessedDeleteAllAccountsTx(tx)) {
      return new BwDeleteAllAccountsParser().graphicalRepresentation(tx);
    } else if (isProcessedRenewAccountTx(tx)) {
      return new BwRenewAccountParser().graphicalRepresentation(tx);
    } else if (isProcessedAddAccountCertificateTx(tx)) {
      return new BwAddAccountCertificateParser().graphicalRepresentation(tx);
    } else if (isProcessedReplaceAccountMsgFeesTx(tx)) {
      return new BwReplaceAccountMsgFeesParser().graphicalRepresentation(tx);
    } else if (isProcessedDeleteAccountCertificateTx(tx)) {
      return new BwDeleteAccountCertificateParser().graphicalRepresentation(tx);
    } else if (isProcessedUpdateAccountConfigurationTx(tx)) {
      return new BwUpdateAccountConfigurationParser().graphicalRepresentation(tx);
    }

    return new BwUnkownParser().graphicalRepresentation(tx);
  }

  public static getHeaderRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedRegisterDomainTx(tx)) {
      return new BwRegisterDomainParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedTransferDomainTx(tx)) {
      return new BwTransferDomainParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedRenewDomainTx(tx)) {
      return new BwRenewDomainParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedDeleteDomainTx(tx)) {
      return new BwDeleteDomainParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedRegisterAccountTx(tx)) {
      return new BwRegisterAccountParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedTransferAccountTx(tx)) {
      return new BwTransferAccountParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedReplaceAccountTargetsTx(tx)) {
      return new BwReplaceAccountTargetsParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedDeleteAccountTx(tx)) {
      return new BwDeleteAccountParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedDeleteAllAccountsTx(tx)) {
      return new BwDeleteAllAccountsParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedRenewAccountTx(tx)) {
      return new BwRenewAccountParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedAddAccountCertificateTx(tx)) {
      return new BwAddAccountCertificateParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedReplaceAccountMsgFeesTx(tx)) {
      return new BwReplaceAccountMsgFeesParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedDeleteAccountCertificateTx(tx)) {
      return new BwDeleteAccountCertificateParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedUpdateAccountConfigurationTx(tx)) {
      return new BwUpdateAccountConfigurationParser().headerRepresentation(tx, lastOne);
    }

    return new BwUnkownParser().headerRepresentation(tx, lastOne);
  }

  public static getBwTransactionFrom(
    trans: ConfirmedTransaction<UnsignedTransaction> | FailedTransaction,
  ): BwParser<UnsignedTransaction> {
    if (isFailedTransaction(trans)) {
      throw new Error("Not supported error txs for now");
    }

    if (!isConfirmedTransaction(trans)) {
      throw new Error("Confirmed transaction expected");
    }

    const { transaction: payload } = trans;

    if (isSendTransaction(payload)) {
      return new BwSendParser();
    } else if (isRegisterAccountTx(payload)) {
      return new BwRegisterAccountParser();
    } else if (isReplaceAccountTargetsTx(payload)) {
      return new BwReplaceAccountTargetsParser();
    } else if (isTransferAccountTx(payload)) {
      return new BwTransferAccountParser();
    } else if (isTransferDomainTx(payload)) {
      return new BwTransferDomainParser();
    }

    return new BwUnkownParser();
  }
}
