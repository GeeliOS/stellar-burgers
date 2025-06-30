/// <reference types="cypress" />

describe('Constructor Page', () => {
  beforeEach(() => {
    // Перехват запроса ингредиентов
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Перехват запроса пользователя
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Перехват создания заказа
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    // Устанавливаем токены в localStorage
    window.localStorage.setItem('accessToken', 'Bearer testAccessToken');
    window.localStorage.setItem('refreshToken', 'testRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should add bun and ingredient to constructor', () => {
    // Добавляем булку
    cy.get('[data-cy=ingredient-bun]').first().trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    // Добавляем начинку
    cy.get('[data-cy=ingredient-main]').first().trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    // Проверяем, что булка и начинка отображаются в конструкторе
    cy.get('[data-cy=constructor-bun]').should('have.length', 2); // верх и низ булки
    cy.get('[data-cy=constructor-ingredient]').should('have.length', 1);
  });

  it('should open and close ingredient modal', () => {
    cy.get('[data-cy=ingredient-bun]').first().click();

    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-title]').should(
      'contain.text',
      'Детали ингредиента'
    );

    // Закрываем по кресту
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Открываем снова
    cy.get('[data-cy=ingredient-bun]').first().click();

    // Закрываем по оверлею
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('should create order and show order modal', () => {
    // Добавляем булку и начинку
    cy.get('[data-cy=ingredient-bun]').first().trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');
    cy.get('[data-cy=ingredient-main]').first().trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    // Нажимаем кнопку оформить заказ
    cy.get('[data-cy=order-button]').click();

    // Ждем запрос создания заказа
    cy.wait('@postOrder');

    // Проверяем модальное окно с номером заказа
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain.text', '123456');

    // Закрываем модал
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get('[data-cy=constructor-ingredient]').should('have.length', 0);
    cy.get('[data-cy=constructor-bun]').should('have.length', 0);
  });
});
