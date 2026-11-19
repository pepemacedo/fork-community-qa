describe("Tela de login", () => {
  beforeEach(() => {
    cy.visit("/entrar");
  });

  it("mostra os elementos principais", () => {
    cy.contains("Entrar").should("be.visible");
    cy.contains("Área da equipe da Fork Community").should("be.visible");
    cy.contains("E-mail").should("be.visible");
    cy.contains("Senha").should("be.visible");
    cy.contains("button", "Continuar").should("be.visible");
    cy.contains("Esqueci a senha").should("be.visible");
  });

  it("continua utilizável em telas diferentes", () => {
    [
      ["celular", 375, 667],
      ["tablet", 768, 1024],
      ["desktop", 1920, 1080],
    ].forEach(([nome, largura, altura]) => {
      cy.viewport(largura, altura);
      cy.contains("button", "Continuar").should("be.visible");
      cy.screenshot(`login-${nome}`);
    });
  });
});