import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slice/ingredientsSlice';
import { getUser, userSliceActions } from '../../services/slice/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем параметры номера заказа из URL (для модальных окон и страниц)
  const profileOrderNumber =
    useMatch('/profile/orders/:number')?.params.number ?? '';
  const feedOrderNumber = useMatch('/feed/:number')?.params.number ?? '';

  useEffect(() => {
    dispatch(getIngredients());

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      dispatch(getUser())
        .unwrap()
        .catch(() => {
          localStorage.removeItem('refreshToken');
          document.cookie =
            'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        })
        .finally(() => {
          dispatch(userSliceActions.authCheck());
        });
    } else {
      dispatch(userSliceActions.authCheck());
    }
  }, [dispatch]);

  const closeModal = () => navigate(-1);

  // Если есть состояние background — показываем модальные окна поверх основной страницы
  const backgroundLocation = location.state?.background;

  // Форматирование номера заказа с ведущими нулями
  const formatOrderNumber = (num: string) => num.padStart(6, '0');

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              #{feedOrderNumber && formatOrderNumber(feedOrderNumber)}
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                #{profileOrderNumber && formatOrderNumber(profileOrderNumber)}
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${profileOrderNumber && formatOrderNumber(profileOrderNumber)}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${feedOrderNumber && formatOrderNumber(feedOrderNumber)}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
