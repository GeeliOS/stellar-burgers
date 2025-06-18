import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { feedsSelectors, getFeeds } from '../../services/slice/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем объект feeds из стора, затем извлекаем orders
  const feeds = useSelector(feedsSelectors.selectFeeds);
  const orders: TOrder[] = feeds.orders;

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  // Обернем callback в useCallback для оптимизации (опционально)
  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
