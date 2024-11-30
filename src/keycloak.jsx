import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8081', // Keycloak server URL
  realm: 'Elite-Gear',                 // Replace with your realm
  clientId: 'Elite-Gear',            // Replace with your client ID
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
