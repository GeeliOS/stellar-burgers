import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: '' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
  });
});
