import * as bech32 from "bech32";
import * as crypto from "crypto";
import { default as IovLedgerApp } from "ledger-cosmos-js";
import RIPEMD160 from "ripemd160";
import { signatureImport } from "secp256k1";
import semver from "semver";

const INTERACTION_TIMEOUT = 120; // seconds to wait for user action on Ledger, currently is always limited to 60
const REQUIRED_IOV_APP_VERSION = "2.16.1";

declare global {
  interface Window {
    chrome: typeof chrome;
    opr: any;
    google: any;
  }
  interface Navigator {
    hid: Record<string, any>;
  }
}

/*
HD wallet derivation path (BIP44)
DerivationPath{44, 234, account, 0, index}
*/
const HDPATH = [44, 234, 0, 0, 0];
const BECH32PREFIX = "star";

interface Version {
  readonly version: string;
  readonly test_mode: boolean;
}

export default class Ledger {
  private readonly testModeAllowed: boolean;
  private iovApp: any;
  private hdPath: Array<number>;
  private hrp: string;
  public platform: string;
  public userAgent: string;

  constructor(
    { testModeAllowed = false }: { testModeAllowed: boolean } = { testModeAllowed: false },
    hdPath: Array<number> = HDPATH,
    hrp: string = BECH32PREFIX,
  ) {
    this.testModeAllowed = testModeAllowed;
    this.hdPath = hdPath;
    this.hrp = hrp;
    this.platform = navigator.platform; // set it here to overwrite in tests
    this.userAgent = navigator.userAgent; // set it here to overwrite in tests
  }

  // quickly test connection and compatibility with the Ledger device throwing away the connection
  async testDevice(): Promise<Ledger> {
    // poll device with low timeout to check if the device is connected
    const secondsTimeout = 3; // a lower value always timeouts
    await this.connect(secondsTimeout);
    this.iovApp = null;

    return this;
  }

  // check if the Ledger device is ready to receive signing requests
  private async isReady(): Promise<void> {
    // check if the version is supported
    const version = await this.getIovAppVersion();

    if (!semver.gte(version.version, REQUIRED_IOV_APP_VERSION)) {
      const msg = "Outdated version: Please update Ledger IOV App to the latest version.";
      throw new Error(msg);
    }

    // throws if not open
    await this.isIovAppOpen();
  }

  // connects to the device and checks for compatibility
  // the timeout is the time the user has to react to requests on the Ledger device
  // set a low timeout to only check the connection without preparing the connection for user input
  async connect(timeout = INTERACTION_TIMEOUT): Promise<Ledger> {
    // assume well connection if connected once
    if (this.iovApp) return this;

    // check if browser is supported
    getBrowser(this.userAgent);

    let transport;
    if (isWindows(this.platform)) {
      if (!navigator.hid) {
        throw new Error(
          "Your browser doesn't have HID enabled. Please enable this feature by visiting: chrome://flags/#enable-experimental-web-platform-features",
        );
      }

      const { default: TransportWebHID } = await import(
        /* webpackChunkName: "webhid" */ "@ledgerhq/hw-transport-webhid"
      );
      transport = await TransportWebHID.create(timeout * 1000);
    }
    // OSX / Linux
    else {
      try {
        const { default: TransportWebUSB } = await import(
          /* webpackChunkName: "webusb" */ "@ledgerhq/hw-transport-webusb"
        );
        transport = await TransportWebUSB.create(timeout * 1000);
      } catch (err) {
        /* istanbul ignore next: specific error rewrite */
        if (err.message.trim().startsWith("No WebUSB interface found for your Ledger device")) {
          throw new Error(
            "Couldn't connect to a Ledger device. Please use Ledger Live to upgrade the Ledger firmware to version 1.5.5 or later.",
          );
        }
        /* istanbul ignore next: specific error rewrite */
        if (err.message.trim().startsWith("Unable to claim interface")) {
          // apparently can't use it in several tabs in parallel
          throw new Error("Could not access Ledger device. Is it being used in another tab?");
        }
        /* istanbul ignore next: specific error rewrite */
        if (err.message.trim().startsWith("Not supported")) {
          // apparently can't use it in several tabs in parallel
          throw new Error(
            "Your browser doesn't seem to support WebUSB yet. Try updating it to the latest version.",
          );
        }
        /* istanbul ignore next: specific error rewrite */
        if (err.message.trim().startsWith("No device selected")) {
          // apparently can't use it in several tabs in parallel
          throw new Error(
            "You did not select a Ledger device. If you didn't see your Ledger, check if the Ledger is plugged in and unlocked.",
          );
        }

        // throw unknown error
        throw err;
      }
    }

    this.iovApp = new IovLedgerApp(transport);

    // checks if the Ledger is connected and the app is open
    await this.isReady();

    return this;
  }

  // returns the test_mode and IOV app version as a string like "1.1.0"
  async getIovAppVersion(): Promise<Version> {
    await this.connect();

    const response = await this.iovApp.getVersion();
    this.checkLedgerErrors(response);
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { major, minor, patch, test_mode } = response;
    checkAppMode(this.testModeAllowed, test_mode);
    const version = versionString({ major, minor, patch });

    // eslint-disable-next-line @typescript-eslint/camelcase
    return { version, test_mode };
  }

  // checks if the IOV app is open
  // to be used for a nicer UX
  async isIovAppOpen(): Promise<void> {
    const appName = await this.getOpenApp();

    if (appName.toLowerCase() === "dashboard") {
      throw new Error("Please open the IOV Ledger app on your Ledger device.");
    }
    if (appName !== "IOV" && appName !== "IOVTEST") {
      throw new Error(`Please close ${appName} and open the IOV Ledger app on your Ledger device.`);
    }
  }

  async getOpenApp(): Promise<string> {
    await this.connect();

    const response = await this.iovApp.appInfo();
    this.checkLedgerErrors(response);
    const { appName } = response;

    return appName;
  }

  // returns the public key from the Ledger device as a Buffer
  async getPubKey(): Promise<Buffer> {
    await this.connect();

    const response = await this.iovApp.publicKey(this.hdPath);
    this.checkLedgerErrors(response);
    return response.compressed_pk;
  }

  // returns the star1 address from the Ledger as a string
  async getIovAddress(): Promise<string> {
    await this.connect();

    const pubKey = await this.getPubKey();
    const res = await getBech32FromPK(this.hrp, pubKey);
    return res;
  }

  // triggers a confirmation request of the IOV address on the Ledger device
  async confirmLedgerAddress(): Promise<void> {
    await this.connect();
    const iovAppVersion = await this.getIovAppVersion();

    if (semver.lt(iovAppVersion.version, REQUIRED_IOV_APP_VERSION)) {
      // we can't check the address on an old IOV app
      return;
    }

    const response = await this.iovApp.showAddressAndPubKey(this.hdPath, this.hrp);
    this.checkLedgerErrors(response, {
      rejectionMessage: "Displayed address was rejected",
    });
  }

  // create a signature for any message
  // in IOV this should be a serialized StdSignMsg
  // this is ideally generated by the @lunie/cosmos-js library
  async sign(signMessage: string): Promise<Uint8Array> {
    await this.connect();

    const response = await this.iovApp.sign(this.hdPath, signMessage);
    this.checkLedgerErrors(response);
    // we have to parse the signature from Ledger as it's in DER format
    const parsedSignature = signatureImport(response.signature);
    return parsedSignature;
  }

  // parse Ledger errors in a more user friendly format
  /* istanbul ignore next: maps a bunch of errors */
  private checkLedgerErrors(
    // eslint-disable-next-line @typescript-eslint/camelcase
    { error_message, device_locked }: { error_message: string; device_locked: boolean },
    {
      timeoutMessage = "Connection timed out. Please try again.",
      rejectionMessage = "User rejected the transaction",
    } = {},
  ): Error | void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (device_locked) {
      throw new Error("Ledger's screensaver mode is on");
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    switch (error_message) {
      case "U2F: Timeout":
        throw new Error(timeoutMessage);
      case "IOV app does not seem to be open":
        throw new Error("IOV app is not open");
      case "Command not allowed":
        throw new Error("Transaction rejected");
      case "Transaction rejected":
        throw new Error(rejectionMessage);
      case "Unknown Status Code: 26628":
        throw new Error("Ledger's screensaver mode is on");
      case "Instruction not supported":
        throw new Error(
          `Your IOV Ledger App is not up to date. Please update to version ${REQUIRED_IOV_APP_VERSION}.`,
        );
      case "No errors":
        // do nothing
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/camelcase
        throw new Error(`Ledger Native Error: ${error_message}`);
    }
  }
}

// stiched version string from Ledger app version object
function versionString({ major, minor, patch }: { major: number; minor: number; patch: number }): string {
  return `${major}.${minor}.${patch}`;
}

// wrapper to throw if app is in testmode but it is not allowed to be in testmode
export const checkAppMode = (testModeAllowed: boolean, testMode: boolean): void => {
  if (testMode && !testModeAllowed) {
    throw new Error("DANGER: The IOV Ledger app is in test mode and shouldn't be used on mainnet!");
  }
};

// doesn't properly work in ledger-cosmos-js
function getBech32FromPK(hrp: string, pk: Buffer): string {
  if (pk.length !== 33) {
    throw new Error("expected compressed public key [31 bytes]");
  }
  const hashSha256 = crypto
    .createHash("sha256")
    .update(pk)
    .digest();
  const hashRip = new RIPEMD160().update(hashSha256).digest();
  return bech32.encode(hrp, bech32.toWords(hashRip));
}

function isWindows(platform: string): boolean {
  return platform.indexOf("Win") > -1;
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  const isChrome = /chrome|crios/.test(ua) && !/edge|opr\//.test(ua);
  const isBrave = isChrome && !window.google;

  if (isBrave) return "brave";
  if (isChrome) return "chrome";

  throw new Error("Your browser doesn't support Ledger devices.");
}
