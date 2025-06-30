import { ingredientsSliceReducer, getIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('should set loading true on pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSliceReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set ingredients and loading false on fulfilled', () => {
    const ingredients = [
      {
        _id: '1',
        name: 'Test',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsSliceReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
  });

  it('should set error and loading false on rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Error' }
    };
    const state = ingredientsSliceReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Error');
  });
});
