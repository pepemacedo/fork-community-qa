# Testes com Cypress na central da comunidade Fork

Projeto de estudo: aprender Cypress testando a tela de login e o fluxo de acesso da central interna de uma comunidade, com autorização por escrito do responsável pelo site.

> A URL do site não está neste arquivo de propósito. Onde aparecer `https://URL-DO-SITE`, use o endereço real somente na sua máquina. Não publique a URL nem os achados sem a autorização do dono do site.

## 1. Ambiente

- Windows, PowerShell e VS Code
- Node.js instalado
- Cypress instalado como dependência de desenvolvimento

## 2. Criando o projeto

```powershell
mkdir central-testes
cd central-testes
npm init -y
npm install cypress --save-dev
npx cypress open
```

Na janela do Cypress: **E2E Testing**, **Continue**, escolher o navegador, **Start E2E Testing**. O Cypress cria `cypress/` (com `fixtures` e `support`) e `cypress.config.js`. A pasta `cypress/e2e` não é criada sozinha: foi criada à mão no VS Code.

## 3. Configuração (`cypress.config.js`)

O arquivo gerado não traz `baseUrl`. Ele foi adicionado dentro de `e2e`:

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://URL-DO-SITE",
    viewportWidth: 1920,
    viewportHeight: 720,
    screenshotOnRunFailure: true,
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

Pontos de atenção:

- `baseUrl` só com o domínio, com `https://` e sem barra no final
- salvar com `Ctrl + S` (bolinha branca na aba = arquivo não salvo)
- depois de mudar a configuração, fechar e reabrir o Cypress

## 4. Primeiro teste: `cypress/e2e/acesso.cy.js`

```javascript
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
```

A primeira versão só conferia se a URL continha o domínio do site, o que sempre passa. Trocar por `"/entrar"` fez a verificação poder falhar de verdade.

Resultado: `Passed: 2`.

## 5. Lendo o log do Cypress

| Linha do log | Significado |
| --- | --- |
| `visit /app -> 303: .../entrar?returnTo=%2Fapp...` | O site redirecionou quem não estava logado para o login |
| `assert expected ... to include ...` | A verificação do endereço (verde = passou) |
| `(xhr)` / `(fetch)` com `cloudflare` | Requisições da proteção anti-robô |
| `GET 401` no meio delas | Faz parte desse mecanismo, não é bug do site |

- `303` é um redirecionamento.
- `returnTo` guarda para onde voltar depois do login (`%2F` = `/`).
- Hipótese verificada: logado em aba anônima, o `/app` abriu normal, sem URL estranha. Não é bug.

## 6. Login automatizado: limite encontrado

A tela de login tem desafio anti-robô da Cloudflare e a conta usa autenticação em duas etapas. Isso impede automatizar o login, de propósito. Não se tenta burlar. O caminho correto é pedir ao responsável:

- ambiente de teste, ou regra que libere a conta ou o IP de teste
- conta de teste
- para a 2FA, conta de teste cujo código possa ser gerado por script

Enquanto isso, as áreas logadas continuam em teste manual. Credenciais nunca vão no arquivo de teste: ficam em `cypress.env.json` (no `.gitignore`) e são lidas com `Cypress.env("usuario")`.

## 7. Testes da tela de login

### `cypress/e2e/login.cy.js`

```javascript
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
```

### `cypress/e2e/login-qualidade.cy.js`

```javascript
describe("Tela de login - qualidade", () => {
  it("não deixa enviar com os campos vazios", () => {
    cy.visit("/entrar");
    cy.contains("button", "Continuar").click();
    cy.url().should("include", "/entrar");
    cy.screenshot("login-campos-vazios");
  });

  it("não gera erros no console", () => {
    cy.visit("/entrar", {
      onBeforeLoad(win) {
        cy.spy(win.console, "error").as("erroConsole");
      },
    });
    cy.get("@erroConsole").should("not.have.been.called");
  });
});
```

O teste de console pode falhar por scripts de terceiros (Cloudflare). É preciso abrir o erro e ver a origem antes de decidir se é do site.

## 8. Próximos passos planejados

- **Acessibilidade:** `npm install --save-dev cypress-axe axe-core`, `import "cypress-axe";` em `cypress/support/e2e.js`, e no teste `cy.injectAxe(); cy.checkA11y(null, { includedImpacts: ["critical", "serious"] });`
- **Organização:** scripts `test` e `abrir` no `package.json`, `.gitignore` com `node_modules`, `cypress/videos`, `cypress/screenshots` e `cypress.env.json`, e um `README.md` sem a URL interna
- **Extras:** relatório com `mochawesome`, teste de teclado com `cypress-real-events`, e GitHub Actions (a Cloudflare pode bloquear os servidores do GitHub)

## 9. Comandos usados

| Comando | Para quê |
| --- | --- |
| `npm init -y` | Criar o `package.json` |
| `npm install cypress --save-dev` | Instalar o Cypress |
| `npx cypress open` | Abrir o Cypress com janela |
| `npx cypress run` | Rodar sem janela, gerando prints em `cypress/screenshots` e vídeos em `cypress/videos` |
| `npm install --save-dev cypress-axe axe-core` | Instalar as bibliotecas de acessibilidade |
