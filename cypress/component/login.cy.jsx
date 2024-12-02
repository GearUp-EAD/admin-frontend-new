import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from '@cypress/react';
import Login from '../../src/pages/Login';

describe('Login Component', () => {
  const ADMIN_EMAIL = 'admin@elitegear.com';
  const ADMIN_PASSWORD = 'admin123';

  const mountWithRouter = () => {
    mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  it('renders the login form correctly', () => {
    mountWithRouter();
    cy.get('h1').should('contain', 'EliteGear');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('displays an error when invalid credentials are submitted', () => {
    mountWithRouter();
    cy.get('input[name="email"]').type('wrong@elitegear.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('.bg-red-50') // Error message container
      .should('contain', 'Invalid email or password');
  });

  it('navigates to the dashboard on successful login', () => {
    const mockNavigate = cy.stub();
    cy.stub(localStorage, 'setItem'); // Mock localStorage

    cy.wrap(mockNavigate).as('navigate');
    mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    cy.get('input[name="email"]').type(ADMIN_EMAIL);
    cy.get('input[name="password"]').type(ADMIN_PASSWORD);
    cy.get('button[type="submit"]').click();

    // Ensure localStorage is updated and navigation happens
    cy.wrap(localStorage.setItem).should('be.calledWith', 'isAuthenticated', 'true');
    cy.get('@navigate').should('be.calledWith', '/');
  });

  it('clears the error message when typing in the input fields', () => {
    mountWithRouter();
    cy.get('input[name="email"]').type('wrong@elitegear.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Error message should appear
    cy.get('.bg-red-50').should('contain', 'Invalid email or password');

    // Start typing to clear the error
    cy.get('input[name="email"]').clear().type('another@elitegear.com');
    cy.get('.bg-red-50').should('not.exist');
  });
});
