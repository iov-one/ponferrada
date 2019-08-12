export interface DownloadButtonProps {
  readonly onDownload: () => void;
  readonly children?: string;
}
declare const DownloadCSV: ({ onDownload, children }: DownloadButtonProps) => JSX.Element;
export default DownloadCSV;
