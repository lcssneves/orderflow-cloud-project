# 🚀 Guia Rápido: OrderFlow Cloud

Este guia foi gerado para salvar os comandos e explicações mais importantes do nosso chat sobre o deploy em nuvem do E-commerce OrderFlow.

## 🔗 Links Importantes do Seu Projeto
- **GitHub:** Repositório online onde o código mora.
- **Render (Backend):** Onde a nossa API Node.js e o banco de dados estão rodando através do Docker.
- **Vercel (Frontend):** Onde a vitrine (React/Vite) está hospedada para os clientes acessarem.

---

## 💻 O "Dia a Dia" do Desenvolvedor (Atualizar o site)
Sempre que você alterar um código no seu computador e quiser que essa alteração vá para a internet (Vercel/Render), o fluxo é sempre este:

1. Salve o arquivo no seu editor (Ctrl + S).
2. Abra o terminal e digite os 3 comandos "mágicos" do Git na ordem:
   ```bash
   git add .
   git commit -m "mensagem curta explicando o que você mudou"
   git push
   ```
3. Pronto! O GitHub recebe o código, avisa a Vercel e a Render, e o deploy acontece automaticamente sem você precisar apertar nenhum botão.

---

## 🤝 Como Trabalhar em Equipe (Colaboradores)
Para seus colegas também poderem enviar código:

**Você (Dono do Projeto):**
1. Vá no seu repositório no **GitHub.com** > aba **Settings**.
2. Clique em **Collaborators** > **Add people**.
3. Convide seus colegas pelo nome de usuário ou e-mail.

**Seu Colega (Após aceitar o convite):**
1. Ele abre o terminal no PC dele e baixa o projeto:
   ```bash
   git clone https://github.com/SeuUsuario/orderflow-cloud-project.git
   ```
2. Após programar, ele também usa o trio: `git add .`, `git commit` e `git push`.

---

## 🛡️ Dica de Ouro: O .gitignore
Lembra do problema que quebrou a Vercel? A pesada pasta `node_modules` tinha subido para o GitHub. 
Nós configuramos o arquivo `.gitignore` invisível no seu projeto. Ele blinda e impede que você envie acidentalmente arquivos pesados, senhas (`.env`) e o seu `relatorio_tecnico.md` para o código público.

Guarde este arquivo e boa sorte na avaliação final acadêmica! A arquitetura escalável e profissional do OrderFlow está digna de nota máxima! 🥇
