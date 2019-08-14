import { singleton } from "./singleton";

describe("singleton", () => {
  const container = {
    heavyInitializer: () => 5,
  };

  it("returns a function", () => {
    const getLuckyNumber = singleton<typeof container.heavyInitializer>(container.heavyInitializer);
    expect(typeof getLuckyNumber).toEqual("function");
  });

  it("returns the initializer's return value when called", () => {
    const getLuckyNumber = singleton<typeof container.heavyInitializer>(container.heavyInitializer);
    expect(getLuckyNumber()).toEqual(5);
  });

  it("calls initializer only once", async () => {
    const heavyInitializerSpy = jest.spyOn(container, "heavyInitializer");
    const getLuckyNumber = singleton<typeof container.heavyInitializer>(container.heavyInitializer);
    expect(heavyInitializerSpy).toHaveBeenCalledTimes(0);
    expect(getLuckyNumber()).toEqual(5);
    expect(getLuckyNumber()).toEqual(5);
    expect(getLuckyNumber()).toEqual(5);
    expect(heavyInitializerSpy).toHaveBeenCalledTimes(1);
  });
});
