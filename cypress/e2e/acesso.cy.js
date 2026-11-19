describe("Acesso sem login", () => {
  it("redireciona para a tela de login", () => {
    cy.visit("/app");
    cy.url().should("include", "/entrar");
  });

  it("mostra a tela de login", () => {
    cy.visit("/entrar");
    cy.get("body").should("be.visible");
    cy.screenshot("tela-login");
  });
});