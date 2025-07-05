/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехват запроса ингредиентов и возврат моковых данных
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехват запросов авторизации и заказа
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          number: 123456
        }
      }
    }).as('postOrder');

    // Мок данных пользователя
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    // Залогинить пользователя (можно замокать локалсторадж токены)
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');
    window.localStorage.setItem('accessToken', 'mockAccessToken');

    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  it('Добавляет булку и начинку в конструктор', () => {
    // Добавить булку (булка должна быть первой в списке)
    cy.get('li')
      .contains('Булка классическая')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    // Добавить начинку
    cy.get('li')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    // Проверить, что в конструкторе появилась булка (верхняя)
    cy.get('section').contains('Булка классическая (верх)').should('exist');

    // Проверить, что в конструкторе появилась начинка
    cy.get('section')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .should('exist');

    // Проверить, что кнопка оформить заказ активна
    cy.get('button').contains('Оформить заказ').should('not.be.disabled');
  });

  it('Открывает и закрывает модальное окно ингредиента', () => {
    // Клик по ингредиенту для открытия модального окна
    cy.get('li').contains('Соус Spicy-X').click();

    // Проверить, что модальное окно открылось
    cy.get('h3').contains('Детали ингредиента').should('be.visible');

    // Закрыть модальное окно по кресту
    cy.get('button').find('svg').click();

    // Проверить, что модальное окно закрылось
    cy.get('h3').contains('Детали ингредиента').should('not.exist');

    // Открыть модальное окно снова
    cy.get('li').contains('Соус Spicy-X').click();

    // Закрыть по клику на оверлей
    cy.get('.overlay').click();

    cy.get('h3').contains('Детали ингредиента').should('not.exist');
  });

  it('Создаёт заказ и закрывает модальное окно с номером заказа', () => {
    // Добавляем булку и начинку
    cy.get('li')
      .contains('Булка классическая')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });
    cy.get('li')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    // Клик по кнопке оформить заказ
    cy.get('button').contains('Оформить заказ').click();

    // Ожидаем запрос создания заказа
    cy.wait('@postOrder');

    // Проверяем, что открылось модальное окно с номером заказа
    cy.get('h2').contains('123456').should('be.visible');

    // Закрываем модальное окно
    cy.get('button').find('svg').click();

    // Проверяем, что модалка закрылась
    cy.get('h2').contains('123456').should('not.exist');

    // Проверяем, что конструктор пуст (нет булок и начинок)
    cy.get('section').contains('Выберите булки').should('exist');
    cy.get('section').contains('Выберите начинку').should('exist');
  });
});
