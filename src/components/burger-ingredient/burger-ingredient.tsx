import React, { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorSliceActions } from '../../services/slice/burgerBuilderSlice';

const BurgerIngredientComponent: FC<TBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(burgerConstructorSliceActions.addIngredient(ingredient));
  }, [dispatch, ingredient]);

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
};

export const BurgerIngredient = memo(BurgerIngredientComponent);
