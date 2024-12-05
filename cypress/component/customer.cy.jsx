import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from '@cypress/react';
import Customers from '../../src/pages/Customers'; // Adjust the path as per your project structure

describe('Customers Component', () => {
  const mockCustomers = [
    {
      customerID: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Elm Street',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      customerID: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '098-765-4321',
      address: '456 Oak Avenue',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  const mockOrderCounts = {
    '1': 5,
    '2': 3,
  };

  const mockTotalAmounts = {
    '1': 150.25,
    '2': 75.0,
  };

  const mountWithRouter = () => {
    mount(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', 'http://localhost:8080/api/customers', mockCustomers).as('getCustomers');
    cy.intercept('GET', 'http://localhost:8080/api/orders/customer/*', (req) => {
      const customerId = req.url.split('/').pop();
      return mockOrderCounts[customerId] || 0;
    }).as('getOrderCounts');
    cy.intercept('GET', 'http://localhost:8080/api/orders/totalAmount/*', (req) => {
      const customerId = req.url.split('/').pop();
      return mockTotalAmounts[customerId] || 0;
    }).as('getTotalAmounts');
  });

  it('renders the customers table correctly', () => {
    mountWithRouter();

    // Wait for API calls
    cy.wait('@getCustomers');
    cy.wait('@getOrderCounts');
    cy.wait('@getTotalAmounts');

    // Check table headings
    cy.get('thead').within(() => {
      cy.contains('Customer').should('exist');
      cy.contains('Contact').should('exist');
      cy.contains('Orders').should('exist');
      cy.contains('Total Spent').should('exist');
    });

    // Check that all customer rows are rendered
    cy.get('tbody tr').should('have.length', mockCustomers.length);

    // Verify customer details
    cy.get('tbody tr').each((row, index) => {
      const customer = mockCustomers[index];
      cy.wrap(row).within(() => {
        cy.contains(customer.name).should('exist');
        cy.contains(customer.email).should('exist');
        cy.contains(customer.phoneNumber).should('exist');
        cy.contains(mockOrderCounts[customer.customerID].toString()).should('exist');
        cy.contains(`$${mockTotalAmounts[customer.customerID].toFixed(2)}`).should('exist');
      });
    });
  });

  it('shows loading state', () => {
    cy.intercept('GET', 'http://localhost:8080/api/customers', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000); // Delay response
      });
    });

    mountWithRouter();

    // Check for loading state
    cy.contains('Loading...').should('exist');
  });

  it('handles error state', () => {
    cy.intercept('GET', 'http://localhost:8080/api/customers', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    });

    mountWithRouter();

    // Check for error message
    cy.contains('Error:').should('exist');
  });

  it('displays default values when API data is missing', () => {
    const incompleteCustomers = [
      {
        customerID: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        address: '123 Elm Street',
      },
    ];
    cy.intercept('GET', 'http://localhost:8080/api/customers', incompleteCustomers).as('getCustomers');
    cy.intercept('GET', 'http://localhost:8080/api/orders/customer/*', []).as('getOrderCounts');
    cy.intercept('GET', 'http://localhost:8080/api/orders/totalAmount/*', 0).as('getTotalAmounts');

    mountWithRouter();

    cy.wait('@getCustomers');

    // Check that missing values are handled correctly
    cy.get('tbody tr').first().within(() => {
      cy.contains('$0.00').should('exist');
      cy.contains('0').should('exist');
    });
  });
});
