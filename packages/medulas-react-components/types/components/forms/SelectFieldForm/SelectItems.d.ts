import { Item } from "./index";
interface ListItemProps {
  readonly action: (value: Item) => () => void;
  readonly selectedItem: string | undefined;
  readonly items: readonly Item[];
}
declare const ListItems: ({ action, items, selectedItem }: ListItemProps) => JSX.Element;
export default ListItems;
