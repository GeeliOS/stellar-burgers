import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSliceActions,
  burgerConstructorSliceSelectors
} from '../../services/slice/burgerBuilderSlice';
import { userSliceSelectors } from '../../services/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  orderBurger,
  orderSliceActions,
  orderSliceSelectors
} from '../../services/slice/orderDetailsSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    burgerConstructorSliceSelectors.selectBurgerConstructorState
  );

  const orderRequest = useSelector(orderSliceSelectors.selectNewOrderIsLoading);
  const orderModalData = useSelector(orderSliceSelectors.selectNewOrder);
  const user = useSelector(userSliceSelectors.selectUser);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const burgerIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(orderBurger(burgerIngredients));
  };

  const closeOrderModal = () => {
    dispatch(orderSliceActions.resetOrder());
    dispatch(burgerConstructorSliceActions.resetConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
