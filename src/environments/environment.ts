export const environment = {
  production: true,
  keycloak: {
    base: "https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu",
    issuer:
      "https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/realms/test-realm2",
    realm: "test-realm2",
    clientId: "test-realm2",
    managerRoleID: "d3163241-3ed4-45f3-90f6-d5bf157baff6",
    adminRoleID: "77d46ef9-a872-4a90-a596-467e1f7e7361",
    clientForRoleID: "462ccaf8-320e-49c5-8790-8e1c6e741207",
    managerRole: "view-users",
    adminRole: "manage-users",
    superAdminRole: "realm-admin",
  },
  getTokenAPI:
    "https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/realms/test-realm2/protocol/openid-connect/token",
  baseUrl:
    "https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/admin/realms/test-realm2",
  pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
  cors: "http://localhost:8080",
};
