import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('должен правильно инициализироваться', () => {
    const initialState = rootReducer(undefined, { type: '' });
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');
  });
});
