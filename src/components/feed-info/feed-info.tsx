import { FC, useMemo } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { feedsSelectors } from '../../services/slice/feedsSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter(({ status: orderStatus }) => orderStatus === status)
    .map(({ number }) => number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useSelector(feedsSelectors.selectFeeds);
  const orders = feed.orders;

  // Мемоизируем вычисления, чтобы не пересчитывать при каждом рендере
  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
