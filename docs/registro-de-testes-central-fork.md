# Registro de testes - Central Fork

Ambiente: produção | Navegador: Chrome | Testador: Pedro  
Autorização: confirmada por mensagem com o criador do site (18/11/2026)  
Data dos testes: 18/11/2026

## Resumo

| ID | Tipo | Área | Título | Gravidade | Status |
|---|---|---|---|---|---|
| OBS-001 | Observação | Login e redirecionamento | returnTo com /app repetido (verificado, sem problema) | - | Encerrado, sem bug |
| BUG-001 | Bug | Reuniões | Marcar reunião recusa link do Meet com /meet/ e ?pli=1 (suspeita) | Média | Em investigação |
| BUG-002 | Bug | Chamados, prazos e reuniões | Mensagem de erro genérica, sem indicar o campo nem o formato | Média | Aberto |
| OBS-002 | Melhoria | Pedidos a outros setores e Chamados | Limite de 4000 caracteres, inclusive no título | Baixa | A confirmar com o criador |
| OBS-003 | Observação | Prazos (confirmar a tela) | Ano 2028 recusado no prazo; regra não é explicada | Baixa | A confirmar |
| OBS-004 | Observação | Tarefas | Tarefa pode ser criada com data já vencida | Baixa | A confirmar |

## Detalhes

### OBS-001 - returnTo com /app repetido (verificado, sem problema)

- Data: 18/11/2026
- Suspeita: Ao abrir /app sem login, o site redireciona para a tela de login com returnTo=%2Fapp%2Fapp (equivale a /app/app), o que parecia duplicar o prefixo.
- Passos:
  1. Abrir uma aba anônima (sem login).
  2. Acessar /app.
  3. Cair na tela de login (/entrar?returnTo=...).
  4. Fazer login e concluir a autenticação em duas etapas.
- Esperado: Após o login, abrir a página inicial normalmente.
- Obtido: Abriu /app normal, sem erro e sem URL estranha. Digitar /app/app manualmente (já logado) mostra "página não encontrada", o que é esperado para uma rota que não existe.
- Resultado: Sem bug. A suspeita foi descartada.
- Evidência: Teste automatizado acesso.cy.js (2 testes passando) e prints do fluxo manual.

### BUG-001 - Marcar reunião recusa link do Meet com /meet/ e ?pli=1 (suspeita)

- Data: 18/11/2026
- Área: Reuniões > Marcar reunião
- Dados usados: Setor: LinkedIn. Título e descrição de teste. Data 19/11/2026, hora 16:00, duração 60 min. Link: https://meet.google.com/meet/xxx-xxxx-xxx?pli=1 (código ocultado neste texto).
- Passos:
  1. Abrir o formulário "Marcar reunião".
  2. Preencher todos os campos com dados válidos, usando o link acima.
  3. Clicar em "Marcar".
- Esperado (a confirmar): A reunião é criada.
- Obtido: Aparece "Algum campo não está no formato aceito." e a reunião não é marcada. Com um link de reunião criado pelo testador, a reunião foi marcada com sucesso.
- Hipótese (não confirmada): O campo do link pode estar recusando URLs com "/meet/" no caminho e/ou com o parâmetro "?pli=1". Os demais campos estavam válidos.
- Como isolar:
  1. Repetir com o mesmo link, sem "?pli=1".
  2. Repetir com https://meet.google.com/xxx-xxxx-xxx (sem "/meet/").
  3. Repetir com o link original e anotar qual variação é aceita.
- Impacto: Links copiados da barra de endereço do navegador podem trazer parâmetros extras. Usuários reais podem esbarrar nisso sem saber o motivo (ver BUG-002).
- Gravidade: Média
- Evidência: Print do formulário com o erro (evidencias/prints/BUG-001-reuniao-erro.png).

### BUG-002 - Mensagem de erro genérica, sem indicar o campo nem o formato

- Data: 18/11/2026
- Áreas: Chamados, campo de prazo (confirmar em qual tela) e Marcar reunião.
- Passos:
  1. Em Chamados, preencher com 4001 caracteres e salvar.
  2. No campo de prazo, informar uma data com ano 2028 e salvar.
  3. Em "Marcar reunião", usar o cenário do BUG-001.
- Esperado: Mensagem que indique qual campo está errado e qual é a regra (por exemplo, "O texto pode ter no máximo 4000 caracteres").
- Obtido: Nos três casos aparece apenas "Algum campo não está no formato aceito.", sem dizer o campo nem o formato correto.
- Impacto: O usuário não consegue corrigir sozinho e precisa adivinhar o problema.
- Sugestão: Destacar o campo com erro, mostrar a regra na mensagem e exibir contador de caracteres nos campos de texto.
- Gravidade: Média
- Evidência: Print do BUG-001 (mesma mensagem). Prints de Chamados (4001) e do prazo (2028): a tirar.

### OBS-002 - Limite de 4000 caracteres, inclusive no título

- Data: 18/11/2026
- Observado: Título e corpo aceitam até 4000 caracteres, sem um limite curto. Em Chamados, 4001 caracteres é rejeitado. Nos pedidos, 4000 foi aceito (confirmar o comportamento com 4001).
- Opinião do testador: 4000 caracteres é grande demais, principalmente para o título.
- Esperado (a confirmar): Título curto (por exemplo, 100 a 150 caracteres) e limite de corpo coerente com o uso.
- Risco: Um título muito longo pode quebrar listas, cartões e notificações.
- Próximo teste: Criar um item com título de cerca de 500 caracteres (prefixo [TESTE-QA]), ver como aparece nas listas e telas e depois apagar.
- Gravidade: Baixa (melhoria)
- Evidência: A tirar: print da lista ou tela com o título longo.

### OBS-003 - Ano 2028 recusado no prazo; regra não é explicada

- Data: 18/11/2026
- Observado: No campo de prazo, 2026 e 2027 são aceitos e 2028 gera a mensagem genérica de formato. Parece haver uma data máxima, mas a regra não aparece na tela.
- Esperado (a confirmar): Regra visível (texto de ajuda ou limite no seletor de data) ou mensagem específica.
- Próximo teste: Testar 31/12/2027, 01/01/2028 e 18/11/2028 para descobrir a data exata do limite.
- Gravidade: Baixa
- Evidência: A tirar: print do erro com o ano 2028.

### OBS-004 - Tarefa pode ser criada com data já vencida

- Data: 18/11/2026
- Observado: É possível criar uma tarefa com prazo em 2025. O sistema a mostra como atrasada.
- Pergunta ao criador: Criar tarefa já vencida é permitido de propósito (por exemplo, para registrar algo que ficou para trás)?
- Sugestão: Se não for intencional, bloquear datas passadas ou pedir confirmação.
- Gravidade: Baixa
- Evidência: A tirar: print da tarefa marcada como atrasada.

## Próximos passos

- Isolar o BUG-001 com as três variações do link e anotar qual é aceita.
- Descobrir a data máxima do prazo (OBS-003) com os testes de limite.
- Testar um título longo (OBS-002) e ver como ele aparece nas telas.
- Levar OBS-002, OBS-003 e OBS-004 ao criador do site, para saber se são regras intencionais.
- Salvar os prints em evidencias/prints/ com o ID no nome do arquivo.

## Limpeza dos dados de teste

Itens criados nos testes em produção que devem ser removidos: chamados e pedidos com 4000 caracteres, a tarefa com prazo de 2025 e a reunião marcada com sucesso. Confira se algum setor recebeu notificação e avise o criador, se necessário.
