import TestUtils from 'react-dom/test-utils';

export const findRenderedDOMComponentWithId = (
  tree: React.Component<any>, // eslint-disable-line
  id: string
): Element => {
  const elementsWithId = TestUtils.findAllInRenderedTree(
    tree,
    (inst: React.ReactInstance) => {
      return TestUtils.isDOMComponent(inst) && inst.id === id;
    }
  );

  if (!elementsWithId || elementsWithId.length === 0) {
    throw new Error(`Element with id "${id}" not found`);
  }

  if (elementsWithId.length > 1) {
    throw new Error(
      `Too many elements with id "${id}" was found (${elementsWithId.length})`
    );
  }

  return elementsWithId[0] as Element;
};
