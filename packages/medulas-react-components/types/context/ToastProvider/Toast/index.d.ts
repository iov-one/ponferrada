export declare enum ToastVariant {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info",
}
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly message?: string;
  readonly variant?: ToastVariant;
}
export declare const Toast: ({ open, onClose, message, variant }: Props) => JSX.Element;
export {};
