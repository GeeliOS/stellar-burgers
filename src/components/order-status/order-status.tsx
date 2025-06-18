import React, { FC, useMemo } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const STATUS_TEXT: Record<string, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const text = STATUS_TEXT[status] ?? 'Неизвестно';
  const textStyle = STATUS_COLOR[status] ?? '#F2F2F3';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
