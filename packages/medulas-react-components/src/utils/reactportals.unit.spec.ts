import { showPhone } from './reactportals';

describe('Utils -> ReactPortas', () => {
  it('Should return true if on phone, hook is present and component in open state', () => {
    const divElement = document.createElement('div');
    expect(showPhone(true, divElement, true)).toBe(true);
  });

  it('Should return false if not on phone, hook is present and component in open state', () => {
    const divElement = document.createElement('div');
    expect(showPhone(false, divElement, true)).toBe(false);
  });

  it('Should return false if on phone, hook is not present and component in open state', () => {
    expect(showPhone(true, null, true)).toBe(false);
  });

  it('Should return true if on phone, hook is present but component in not in open state', () => {
    const divElement = document.createElement('div');
    expect(showPhone(true, divElement, false)).toBe(false);
  });
});
