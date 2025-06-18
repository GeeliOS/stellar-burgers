import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import {
  getOrders,
  ordersSliceSelectors
} from '../../services/slice/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(ordersSliceSelectors.selectOrders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
