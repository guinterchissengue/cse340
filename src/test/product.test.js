import { setLocalStorage, getLocalStorage } from '../js/utils.mjs';
import ProductData from '../js/ProductData.mjs';

describe('utils.mjs localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('setLocalStorage stores JSON that getLocalStorage can read back', () => {
    const cart = [{ Id: '880RR', Name: 'Marmot Ajax Tent' }];

    setLocalStorage('so-cart', cart);

    expect(getLocalStorage('so-cart')).toEqual(cart);
  });

  test('getLocalStorage returns null when the key does not exist', () => {
    expect(getLocalStorage('does-not-exist')).toBeNull();
  });
});

describe('ProductData.findProductById', () => {
  const fakeProducts = [
    { Id: '880RR', Name: 'Marmot Ajax Tent' },
    { Id: '344YJ', Name: 'Cedar Ridge Rimrock Tent' },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeProducts),
      }),
    );
  });

  test('returns the matching product for a valid id', async () => {
    const dataSource = new ProductData('tents');

    const product = await dataSource.findProductById('344YJ');

    expect(product).toEqual(fakeProducts[1]);
  });

  test('returns undefined for an id that does not exist', async () => {
    const dataSource = new ProductData('tents');

    const product = await dataSource.findProductById('does-not-exist');

    expect(product).toBeUndefined();
  });
});
