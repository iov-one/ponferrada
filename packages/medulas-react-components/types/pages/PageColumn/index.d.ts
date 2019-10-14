interface Props {
  readonly onLoginWithNeuma: () => void;
  readonly onLoginWithLedger: () => void;
  readonly onGetNeumaExtension: () => void;
}
declare const PageColumn: ({
  onLoginWithNeuma,
  onLoginWithLedger,
  onGetNeumaExtension,
}: Props) => JSX.Element;
export default PageColumn;
