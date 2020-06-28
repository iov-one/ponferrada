import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";

import { QUANTITY_FIELD } from "../components/CurrencyToSend";
import { ADDRESS_FIELD } from "../components/ReceiverAddress";

export function getCancelButton(paymentDom: React.Component): Element {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(paymentDom, "button");
  return buttons[2];
}

export function getSelectedCurrency(inputs: Element[]): string {
  const input = inputs[1] as HTMLInputElement;
  return input.value;
}

export async function fillPaymentForm(page: Page, quantity: string, address: string): Promise<void> {
  await page.bringToFront();
  await page.type(`input[name="${QUANTITY_FIELD}"]`, quantity);
  await page.type(`input[name="${ADDRESS_FIELD}"]`, address);
  await page.click("button[type=submit]");
}

export async function getPaymentRequestData(page: Page, dataIndex: number): Promise<string> {
  const element = await page.$(`li:nth-of-type(${dataIndex}) p`);
  if (element === null) {
    throw new Error(`LI element with index: ${dataIndex} not found.`);
  }

  return (await (await element.getProperty("textContent")).jsonValue()) as string;
}

export async function getInvalidAddressError(page: Page): Promise<string> {
  const validationError = await page.$("p.MuiFormHelperText-root");
  if (validationError === null) {
    throw new Error(`Validation error message was not found.`);
  }

  return (await (await validationError.getProperty("textContent")).jsonValue()) as string;
}
