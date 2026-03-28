# Relatório Técnico: OrderFlow - Sistema de Gestão de Pedidos em Nuvem

## 1. Visão Geral do Sistema (Pitch)
**O OrderFlow é uma plataforma de e-commerce moderna e veloz que transforma visitantes em clientes fiéis através de um processo de compra fluido e sem fricções.** 

Ele resolve o problema de sistemas de vendas lentos e confusos. Com um catálogo inteligente e um carrinho que persiste na nuvem, o usuário escolhe seus produtos, revisa seus itens e acompanha o status (Criado, Pago, Enviado, Entregue) em tempo real, enquanto o administrador gerencia tudo por trás das cortinas de forma eficiente. O sistema foi desenhado para ser escalável desde o primeiro dia, suportando desde dezenas até milhares de pedidos por dia.

---

## 2. Arquitetura em Nuvem

O OrderFlow não vive em um único computador; ele foi construído pensando em nuvem (Cloud-native). Nossa arquitetura cliente-servidor se divide em três grandes pilares, utilizando serviços de mercado grátis/acessíveis para garantir que a loja nunca saia do ar:

- **Frontend (A Vitrine):** É a cara da nossa loja, onde os clientes interagem. Construído em **React** com Vite, ele é leve e dinâmico. A implantação ideal (Deploy) para essa camada é no **Vercel** ou **Netlify**, que distribuem o site por servidores globais (CDN) para carregar rápido em qualquer lugar.
- **Backend (O Cérebro):** Toda a regra de negócio vive aqui. Essa API RESTful em **Node.js + Express** processa as compras, valida estoques e checa permissões. Para rodar isso, nós "empacotamos" o código em um container **Docker**. Esse container facilita o deploy em serviços de nuvem modernos como **Render**, **Railway** ou **AWS App Runner**.
- **Banco de Dados (A Memória):** Precisamos lembrar dos clientes mesmo que o servidor reinicie. Ao invés de instalar o banco no mesmo lugar do código, usamos o **MongoDB Atlas**, um Banco de Dados como Serviço (DBaaS) que salva os produtos, carrinhos e pedidos na nuvem da AWS de forma segura e com backups automáticos.

---

## 3. Tecnologias e Serviços Utilizados

- **Frontend:** React.js, Vite, React Router DOM (para navegação sem recarregar a página), CSS Vanilla com variáveis.
- **Backend:** Node.js, Express (para rotas rápidas), Mongoose (para falar com o MongoDB), JWT + bcrypt (para gerar "crachás" virtuais e proteger senhas).
- **Banco de Dados:** MongoDB via MongoDB Atlas (gerenciado).
- **Testes & Qualidade:** Jest e Supertest para garantir que a API não quebre com novas mudanças. Exemplo de teste front-end sugerido: React Testing Library + Vitest.
- **DevOps & Automação:** Docker (containerização) e GitHub Actions (Pipeline de CI/CD).
- **Organização & Colaboração:** GitHub (Versionamento), Kanban (via GitHub Projects) e Commits baseados no padrão convencional.

---

## 4. Estratégia de Deploy e DevOps (CI/CD)

Uma filosofia central do projeto foi: *“nenhum código vai para o ar sem passar nos testes”*. 

Nós utilizamos uma **Pipeline de Integração e Entrega Contínuas (CI/CD)** via **GitHub Actions**. O arquivo de configuração `main.yml` automatiza o trabalho árduo toda vez que um de nós enfia um código novo no repositório (`git push`):

1. **Build:** O GitHub levanta uma máquina virtual, instala todas as dependências (`npm install`) e checa se o código está livre de erros de compilação.
2. **Testes Automatizados:** O pipeline então roda nossos testes em Jest. Ele liga a API de forma isolada, faz requisições e verifica se as respostas estão corretas. Se algum teste falhar (por exemplo, um preço negativo aceito equivocadamente), o código é barrado de seguir em frente.
3. **Containerização & Deploy:** Uma vez que o código passou na "auditoria" dos testes, a imagem Docker seria construída e enviada automaticamente para o nosso provedor de hospedagem em nuvem (como o Render). O back-end é executado de forma isolada a partir de um `Dockerfile`. Isso atualiza a loja em produção de forma "invisível" para o cliente, sem tempo de inatividade.

---

## 5. Segurança, Logs e Boas Práticas

Para garantir que a loja seja 100% segura e confiável, tomamos algumas precauções cruciais:

- **🔐 Variáveis de Ambiente:** Nenhuma senha ou chave de conexão do banco de dados está visível no código-fonte do GitHub. Usamos um arquivo `.env` localmente (via ambiente isolado) ou variáveis ocultas diretamente no Dashboard do Render/Vercel (em Produção).  Estratégia esta de separação de ambientes de Dev/Prod!
- **🛡️ Proteção de Rotas e Autenticação:** A aplicação emite um **token JWT** quando o cliente faz login. É como uma pulseira VIP; sem ela, o sistema bloqueia tentativas de ver pedidos ou alterar as configurações. Se um cliente "comum" tentar deletar um produto no painel sem ter perfil de administrador, a API nega a solicitação imediatamente devolvendo erro 403 (Forbidden).
- **🛑 Tratamento de Erros:** Nossa API tem uma "rede de segurança" central. Se o banco cair ou alguém enviar um carrinho de compras corrompido, o backend não trava e não expõe códigos confusos para todo mundo ver; ele trata a falha graciosamente e retorna um aviso gentil em JSON limpo e enxuto para a interface visual.
- **📝 Logs de Acesso:** Adicionamos rastreadores. O pacote *Morgan* mantém um diário de arquivos físicos do que acontece no servidor. Todo acesso às rotas ou compras malsucedidas é anotado no diretório temporário `logs/access.log`.

---

## 6. Papéis, Organização e Colaboração

O projeto seguiu práticas de metodologias ágeis simplificadas para coordenar a equipe sem criar burocracia desnecessária.

- **Estruturação do Repositório:** O código foi mantido de forma limpa em um único repositório (*Monorepo*), separado claramente por pastas `/frontend` e `/backend`.
- **Trabalho Colaborativo (GitHub Projects Kanban):** Usamos o método *Kanban board*. Dividida em "A Fazer", "Em Progresso" e "Concluído", a rotina flui. A regra principal: Cada desenvolvedor cria uma ramificação *(Branch)* específica baseada na página `main` para implementar uma nova `feature`, enviando para o repositório (`git push`) via um "Pull Request" e padronizando as mensagens de seus envios com Commits Semânticos como `feat: rota do carrinho`, `fix: erro de CORS da tela de login`.

### Distribuição Recomendada para a Equipe
*(Uma sugestão de divisão baseada nas habilidades de 4 integrantes)*
1. **Arquiteto(a) de Software em Nuvem:** Desenha a estrutura da AWS/MongoDB Atlas, coordena os fluxos do banco de dados, cria as validações Mongoose.
2. **Engenheiro(a) DevOps:** Configura o ambiente *Docker*, garante a eficácia do arquivo `main.yml`, gerencia os pipelines do Github Actions CI/CD e define as variáveis de ambiente base.
3. **Desenvolvedor(a) Back-end e Qualidade de Testes:** Constrói as rotas seguras com Express, checa senhas dos compradores usando JWT/BcryptJS, escreve arquivos extensos em Jest `(__tests__)` e garante *Code Reviews*.
4. **Desenvolvedor(a) Front-end:** Dá cor, usabilidade, acessibilidade e interatividade a tudo que o usuário vê na tela de e-commerce, integrando Requisições da API via bibliotecas assíncronas (Axios).

---

## 7. Dificuldades Encontradas e Soluções Adotadas

Durante a implementação do MVP do nosso E-commerce "OrderFlow", nossa equipe deparou-se com algumas barreiras técnicas superadas com excelência:

1. **Testes versus Servidores Presos:**
   - **Problema:** Ao rodar os Testes em Jest Integrados da API, o servidor principal levantava a porta 3000 e ela se prendia em conflito com o Github Actions fazendo do Pipeline CI cair no Time-out.
   - **Solução:** Adaptamos o arquivo mestre (`app.js`) isolando o inicializador TCP/IP `app.listen()` sob a verificação restrita de variável global se (`NODE_ENV !== 'test'`). Assim os testes fluíam leves validando requisições assíncronas com o Pacote NPM "Supertest" sem alugar processos extras.
2. **Persistência do Carrinho Pós Reloading:**
   - **Problema:** Quando um visitante incluía produtos no carrinho e tentava criar login noutra aba; todos os itens sumiam da página original frustrando a conversão de vendas instantaneamente.
   - **Solução:** Implementamos lógica local via Cache usando nativamente `localStorage` fundido ao gerenciador dinâmico de estados `CartContext.jsx` do React. Mantivemos os acessos rápidos sem consumir ou queimar cotas de banco de dados por carrinhos de compra abandonados, e só empurrando para MongoDB, quando efetivadamente um check-out real ocorreu (`POST /orders`).
3. **Conexões de Rede Simuladas Restritas por IP:**
   - **Problema:** Durante o desenvolvimento da máquina local o banco não localizava registros DNS devido às políticas de Provedores em certas redes sem fio Wi-fi. Erros silenciosos como `ECONNREFUSED`.
   - **Solução:** Implementou-se um "Patch Tático" de resolução livre para os servidores públicos `(Cloudflare e Google)` no arquivo master: `dns.setServers(['8.8.8.8', '1.1.1.1']);`.
