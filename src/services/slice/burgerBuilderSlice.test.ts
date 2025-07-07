import {
  burgerConstructorSliceReducer,
  burgerConstructorSliceActions
} from './burgerBuilderSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const bunIngredient: TIngredient = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mainIngredient: TIngredient = {
  _id: 'main1',
  name: 'Начинка',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerBuilderSlice', () => {
  it('добавляет булку', () => {
    const state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(bunIngredient)
    );
    expect(state.bun?._id).toBe('bun1');
    expect(state.ingredients.length).toBe(0);
  });

  it('добавляет начинку', () => {
    const state = burgerConstructorSliceReducer(
      undefined,
      burgerConstructorSliceActions.addIngredient(mainIngredient)
    );
    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]._id).toBe('main1');
  });

  it('удаляет ингредиент по id', () => {
    const initialState = {
      bun: null,
      ingredients: [{ ...mainIngredient, id: 'unique-id' }]
    };
    const state = burgerConstructorSliceReducer(
      initialState,
      burgerConstructorSliceActions.removeIngredient('unique-id')
    );
    expect(state.ingredients.length).toBe(0);
  });

  it('перемещает ингредиент вверх', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'id1' },
        { ...mainIngredient, id: 'id2' }
      ]
    };
    const state = burgerConstructorSliceReducer(
      initialState,
      burgerConstructorSliceActions.moveIngredientUp(1)
    );
    expect(state.ingredients[0].id).toBe('id2');
    expect(state.ingredients[1].id).toBe('id1');
  });

  it('перемещает ингредиент вниз', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'id1' },
        { ...mainIngredient, id: 'id2' }
      ]
    };
    const state = burgerConstructorSliceReducer(
      initialState,
      burgerConstructorSliceActions.moveIngredientDown(0)
    );
    expect(state.ingredients[0].id).toBe('id2');
    expect(state.ingredients[1].id).toBe('id1');
  });
});
