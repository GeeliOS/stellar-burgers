import {
  burgerConstructorSliceReducer,
  burgerConstructorSliceActions,
  burgerConstructorSliceSelectors
} from './burgerBuilderSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: '1',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient: TIngredient = {
  _id: '2',
  name: 'Ingredient',
  type: 'main',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 20,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerConstructorSlice', () => {
  it('should handle addIngredient with bun', () => {
    const state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(bun)
    );
    expect(state.bun?._id).toBe('1');
    expect(state.ingredients.length).toBe(0);
  });

  it('should handle addIngredient with main ingredient', () => {
    const state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(ingredient)
    );
    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]._id).toBe('2');
  });

  it('should handle removeIngredient', () => {
    let state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(ingredient)
    );
    const idToRemove = state.ingredients[0].id;
    state = burgerConstructorSliceReducer(
      state,
      burgerConstructorSliceActions.removeIngredient(idToRemove)
    );
    expect(state.ingredients.length).toBe(0);
  });

  it('should handle moveIngredientUp and moveIngredientDown', () => {
    let state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(ingredient)
    );
    // Добавим второй ингредиент
    const ingredient2 = { ...ingredient, _id: '3', id: 'testid2' };
    state = {
      ...state,
      ingredients: [...state.ingredients, ingredient2]
    };

    // переместим вниз (index 0)
    state = burgerConstructorSliceReducer(
      state,
      burgerConstructorSliceActions.moveIngredientDown(0)
    );
    expect(state.ingredients[0]._id).toBe('3');
    expect(state.ingredients[1]._id).toBe('2');

    // переместим вверх (index 1)
    state = burgerConstructorSliceReducer(
      state,
      burgerConstructorSliceActions.moveIngredientUp(1)
    );
    expect(state.ingredients[0]._id).toBe('2');
    expect(state.ingredients[1]._id).toBe('3');
  });
});
