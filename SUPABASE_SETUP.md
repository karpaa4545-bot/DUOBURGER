# 🚀 Como Configurar o Supabase para Imagens

Para que suas imagens funcionem em qualquer lugar (não apenas no seu computador), você precisa configurar o Supabase. Siga estes passos simples:

## 1. Criar Conta e Projeto
1. Acesse [supabase.com](https://supabase.com/) e faça login (pode usar sua conta do GitHub).
2. Clique em **"New Project"**.
3. Escolha um nome (ex: `Meu Delivery`) e uma senha para o banco de dados.
4. Clique em **"Create new project"** e aguarde alguns minutos enquanto o projeto é preparado.

## 2. Pegar as Chaves de API
1. No menu lateral esquerdo, clique na engrenagem **"Project Settings"**.
2. Clique em **"API"**.
3. Você precisará de dois valores:
   - **Project URL**: (ex: `https://xyz.supabase.co`)
   - **anon (public)** key: (uma sequência longa de letras e números)

## 3. Criar o Bucket de Armazenamento
1. No menu lateral esquerdo, clique no ícone de cubo **"Storage"**.
2. Clique em **"New bucket"**.
3. Dê o nome exatamente como: `images`
4. **IMPORTANTE**: Marque a opção **"Public bucket"** (para que as imagens possam ser visualizadas por todos).
5. Clique em **"Save"**.

## 4. Configurar as Permissões (Policies)
Para que o sistema consiga subir fotos, precisamos dar permissão:
1. Dentro do bucket `images`, clique em **"Configuration"** ou **"Policies"**.
2. Clique em **"New Policy"** -> **"For full customization"**.
3. Dê um nome (ex: `Permitir Upload Público`).
4. Em **Allowed operations**, marque: `SELECT`, `INSERT`, `UPDATE`.
5. Em **Target roles**, deixe `anon`.
6. Clique em **"Review"** e depois **"Save"**.

## 5. Salvar no seu Projeto
Abra o arquivo `.env.local` na pasta do seu projeto e cole as chaves assim:

```env
NEXT_PUBLIC_SUPABASE_URL=COLE_AQUI_A_SUA_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=COLE_AQUI_A_SUA_CHAVE_ANON
```

---
> [!TIP]
> **Dica**: Se estiver usando a **Vercel**, você também deve adicionar essas duas variáveis nas configurações de Environment Variables do painel da Vercel.
