# Fork Community QA

Projeto de estudo de **Cypress**: testes automatizados da tela de login e do fluxo de acesso da central interna da comunidade Fork, feitos com autorização do responsável pelo site.

> A URL do site não está neste repositório de propósito. Para rodar localmente, troque `https://URL-DO-SITE` em `cypress.config.js` pelo endereço real, sem commitar essa alteração.

## 🎯 Objetivo

Aprender automação E2E testando um sistema real, e documentar o aprendizado: configuração, leitura do log, limites encontrados (anti-robô e 2FA) e próximos passos.

## 🧰 Ferramentas

Cypress · JavaScript · Node.js · VS Code

## 📁 Estrutura

```
fork-community-qa/
├── README.md
├── package.json
├── cypress.config.js
├── cypress/
│   ├── e2e/
│   │   ├── acesso.cy.js      # /app sem login redireciona para /entrar
│   │   └── login.cy.js       # elementos da tela e responsividade
│   └── support/
└── docs/
    └── estudo-cypress.md     # passo a passo, log, limites e próximos passos
```

## ✅ O que os testes cobrem

| Arquivo | Verificação |
|---|---|
| `acesso.cy.js` | acesso a `/app` sem login redireciona para `/entrar`; a tela de login carrega |
| `login.cy.js` | elementos principais da tela; botão "Continuar" visível em celular, tablet e desktop |

Os testes só cobrem a parte pública do site e não usam credenciais. O login automatizado não é feito: a tela tem desafio anti-robô e a conta usa autenticação em duas etapas. Detalhes em [docs/estudo-cypress.md](docs/estudo-cypress.md).

## ▶️ Como rodar

```bash
npm install
npm run abrir   # modo interativo
npm test        # modo headless
```

## 🗺️ Próximos passos

Acessibilidade com `cypress-axe`, relatório com `mochawesome`, teste de teclado e CI com GitHub Actions.

## 👤 Autor

Pedro Macedo · [LinkedIn](https://www.linkedin.com/in/pedromacedo0)
