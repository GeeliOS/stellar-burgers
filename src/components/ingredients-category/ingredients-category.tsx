import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { burgerConstructorSliceSelectors } from '../../services/slice/burgerBuilderSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(
    burgerConstructorSliceSelectors.selectBurgerConstructorState
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: selectedIngredients } = burgerConstructor;
    const counters: Record<string, number> = {};

    selectedIngredients.forEach(({ _id }) => {
      counters[_id] = (counters[_id] ?? 0) + 1;
    });

    if (bun?._id) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
