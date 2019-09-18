import { SelectFieldItem } from "./index";
interface ListItemProps {
  readonly action: (value: SelectFieldItem) => () => void;
  readonly selectedItem?: string;
  readonly items: readonly SelectFieldItem[];
}
declare const ListItems: ({ action, items, selectedItem }: ListItemProps) => JSX.Element;
export default ListItems;
