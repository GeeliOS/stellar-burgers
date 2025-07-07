import { ingredientsSliceReducer, getIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('устанавливает isLoading в true при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSliceReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('устанавливает данные и isLoading в false при getIngredients.fulfilled', () => {
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
    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('устанавливает ошибку и isLoading в false при getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Error' }
    };
    const state = ingredientsSliceReducer(initialState, action);
    expect(state.error).toBe('Error');
    expect(state.isLoading).toBe(false);
  });
});
