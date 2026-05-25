# 📦 Manual de Instalação no Cliente (Passo a Passo)

Este guia explica como instalar o sistema **Delivery Pro System** no computador de um cliente, garantindo que ele funcione com todas as funcionalidades (Impressão, Backup Offline e Sincronização em Nuvem).

---

## 🛠️ 1. Pré-requisitos (Instalar no PC do Cliente)
Antes de tudo, baixe e instale os programas abaixo:

1.  **Node.js (Versão LTS):** [Baixar aqui](https://nodejs.org/en)
    *   Durante a instalação, apenas clique em "Next" até finalizar.
2.  **Git (Opcional, mas recomendado):** [Baixar aqui](https://git-scm.com/download/win)
    *   Facilita baixar atualizações futuras.
3.  **Visual Studio Code (Para suporte):** [Baixar aqui](https://code.visualstudio.com/)
    *   Útil se você precisar editar algo rápido no cliente.

---

## 📥 2. Baixar o Sistema no Computador
Você pode baixar o arquivo `.zip` do projeto ou usar o Git.

**Opção A (Mais Simples - Zip):**
1.  No seu computador (onde o projeto está pronto), compacte a pasta do projeto (exceto a pasta `node_modules` e `.next`).
2.  Envie esse arquivo `.zip` para o computador do cliente (Pen drive, Google Drive, etc).
3.  Descompacte em uma pasta segura, ex: `C:\SistemaDelivery`.

**Opção B (Git - Profissional):**
1.  Abra o terminal na pasta onde quer instalar.
2.  Digite: `git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git`

---

## ⚙️ 3. Configurar o Ambiente (Importante!)
Para que o **Backup Offline** e a **Sincronização Nuvem** funcionem, você precisa configurar as chaves.

1.  Dentro da pasta do projeto (`C:\SistemaDelivery`), crie um arquivo chamado `.env.local` (se não existir).
2.  Abra esse arquivo com o Bloco de Notas.
3.  Cole o seguinte conteúdo (Use os SEUS dados do Gist):

```env
# Configuração de Nuvem e Backup
GIST_ID="seu_id_do_gist_aqui"
GITHUB_TOKEN="seu_token_github_aqui"

# (Opcional) Supabase se estiver usando
NEXT_PUBLIC_SUPABASE_URL="sua_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave"
```

> **Nota:** Se o computador ficar sem internet, o sistema usará automaticamente o arquivo local `data.json` que será criado na pasta.

---

## 🚀 4. Instalar e Rodar
1.  Abra a pasta do sistema (`C:\SistemaDelivery`).
2.  Clique com o botão direito em um espaço vazio > "Abrir no Terminal" (ou CMD).
3.  Digite o comando para instalar as dependências (apenas na primeira vez):
    ```bash
    npm install
    ```
    *(Isso pode demorar uns minutos e vai criar a pasta node_modules)*.

4.  Para **iniciar o sistema**, digite:
    ```bash
    npm run dev
    ```
    *(Ou `npm run start` se você tiver feito o build antes com `npm run build`)*.

5.  O sistema estará rodando em: `http://localhost:3000`

---

## 🖨️ 5. Configurar a Impressora
Siga o guia específico de impressora que já criamos (`PRINTER_SETUP.md` na pasta do projeto).
Resumindo:
1.  Instale a impressora USB/Bluetooth.
2.  Compartilhe ela ou instale o driver "Generic / Text Only" no Windows.
3.  No sistema, ao clicar em imprimir, selecione essa impressora e ajuste as margens para "Nenhuma".

---

## 💡 Dica de Ouro: Criar um Atalho Fácil
Para o cliente não precisar abrir terminal toda vez:

1.  Crie um arquivo novo na Área de Trabalho chamado `Iniciar Sistema.bat`.
2.  Clique com botão direito > Editar.
3.  Cole o seguinte código (ajustando o caminho):

```batch
@echo off
cd "C:\SistemaDelivery"
start http://localhost:3000
npm run dev
```

Pronto! Agora o cliente só precisa clicar duas vezes nesse ícone e o sistema abre automaticamente.
