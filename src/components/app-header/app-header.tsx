import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSliceSelectors } from '../../services/slice/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(userSliceSelectors.selectUser)?.name ?? '';
  return <AppHeaderUI userName={userName} />;
};
