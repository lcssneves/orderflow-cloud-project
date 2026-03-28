# 🛍️ OrderFlow: O E-commerce Descomplicado

**"A maneira mais rápida e fácil de transformar visitantes em clientes, sem dores de cabeça com infraestrutura."**

Bem-vindo ao **OrderFlow**! Este não é apenas um trabalho acadêmico; é um protótipo robusto de loja virtual projetado para o mundo real. Nós o construímos do zero focando no que realmente importa: uma experiência de compra sem engasgos para os clientes e uma fundação sólida e escalável para quem for gerenciar os pedidos.

---

## 🎯 Por que o OrderFlow é Diferente?

Se você já tentou montar um e-commerce do zero, sabe que as coisas podem ficar confusas rapidamente. O OrderFlow resolve isso oferecendo uma plataforma **“Cloud-Native”** direto da caixa. O que isso significa? 
Significa que nós já configuramos toda a dor de cabeça arquitetônica. Desde autenticação segura usando "crachás virtuais" (JWT) até um **Carrinho que nunca esquece seus produtos** (mesmo se a luz acabar e você reiniciar o navegador).

Basta fazer login, explorar o catálogo, montar seu carrinho e acompanhar passo a passo se seu pagamento já foi confirmado ou se o pedido está a caminho!

---

## ☁️ Arquitetura e Hospedagem (Onde nós moramos?)

O projeto é dividido em camadas distintas que conversam entre si, hospedadas em serviços gratuitos e incrivelmente potentes da nuvem moderna:

* **🖼️ A Vitrine (Frontend | React + Vite):** Interface responsiva, rápida e elegante. Nós a implantamos (Deploy process) em plataformas de hospedagem globais como a **Vercel**. Toda vez que alguém entra no site, o Vercel entrega a página de forma instantânea.
* **🧠 O Cérebro (Backend | Node.js + Express):** O gerente por trás do balcão. Ele confere estoque, recusa requisições suspeitas e calcula totais de forma implacável. Nós empacotamos ele dento de uma "caixa" (**Docker**) para que ele rode exatamente da mesma forma em qualquer servidor — preferencialmente na nuvem do **Render** ou *Railway*.
* **💾 O Caderninho Invisível (Banco de Dados | MongoDB Atlas):** Ninguém quer perder dados se um cabo desconectar. Usamos a nuvem oficial do MongoDB com backups automáticos e replicação garantida (DbaaS) espalhados pel mundo via a "Amazon Web Services (AWS)".

---

## 🚀 Como testar localmente? 

Se você for desenvolver, é super simples ver o pacote completo funcionando aí mesmo no seu computador. Abra dois Terminais e prepare os comandos NodeJS:

### 1. Ligando o Gerente (Backend)
```bash
cd backend
npm install
npm run dev
```
*(Não esqueça de configurar suas chaves secretas no arquivo `.env`. Veja o exemplo no diretório. A porta será http://localhost:3000)*

### 2. Ligando a Vitrine (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*(Seu site já pode ser acessado em http://localhost:5173 - Comece a comprar!)*

---

## 🧪 Segurança, DevOps e Confiabilidade Máximas

O OrderFlow não é feito de vidro que quebra na primeira falha; nossa engrenagem é feita de aço escovado e rotinas estritas em Cloud Software e Práticas de Engenharia!

1. **A Máquina Que Verifica (CI/CD Github Actions):** A parte incrível de Trabalhar em Time? Nós usamos *Integração e Deploy Contínuo*. Escondido em uma pasta chamada `.github`, colocamos robôs! Sempre que alguém faz um "commit" empurrando o código novo no GitHub, esses robôs sobem o projeto, instalam tudo sozinhos, e rodam Nossos **Testes Automatizados API (Jest)**. Apenas códigos que gabaritam são enviados à Nuvem de Produção.
2. **Camadas De Defesa (Segurança):** 
   - **Variáveis de Ambiente (`.env`):** Nossas senhas são seladas e separadas entre desenvolvedores ("dev") e o público lá fora da nuvem ("prod").
   - **Rotas Trancadas:** Usuários espertinhos tentaram adivinhar links como "`/products/edit`"? O sistema é implacável: bloqueia e alerta o uso ilegal via status 403 HTTP Error *Forbidden*.
   - **Logs Infalíveis:** Graças ao rastreador (Middleware Morgan), todos os acessos bons (e os suspeitos) vão parar anotados no nosso caderninho permanente em `/logs`.  
   
---

## 🤝 Colaboração e A Organização da Equipe!

Aqui não existiu bagunça, mas sim muita disciplina usando metodologias de mercado Agile.
Mantivemos o projeto organizado via um Sistema Ágil visual por **"Kanban" (Github Projects)**, quebramos os papéis em fatias e criamos *branches específicas* quando alguém entrava de cabeça na codificação! Nada de entupimento — só Códigos Limpos usando "Commits Semânticos" (Ex: `fix: conserta login de clientes não registrados`).

*(Quer saber até os mínimos detalhes técnicos e como solucionamos problemas complicados? Não deixe de ler nosso documento no link: [Relatório Técnico em PDF/Markdown](docs/relatorio_tecnico.md)!)*

> Sistema 100% desenvolvido para A Atividade Prática Final – "Desenvolvimento de Software em Nuvem".
