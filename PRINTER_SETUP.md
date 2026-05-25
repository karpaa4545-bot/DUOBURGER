# 🖨️ Como Usar sua Mini Impressora Bluetooth

Para imprimir os pedidos na sua mini impressora térmica, siga estes passos:

## 1. Parear a Impressora
1. Ligue sua impressora Bluetooth.
2. No seu Computador, vá em **Configurações de Bluetooth** e conecte na sua impressora.

## 2. Adicionar como Impressora no Windows (O passo que falta!)
No Windows, estar conectado no Bluetooth não é o suficiente. Você precisa dizer ao Windows que ela é uma impressora:

1. Clique no botão de Iniciar e digite **"Painel de Controle"** e abra-o.
2. Vá em **Exibir dispositivos e impressoras**.
3. Clique em **Adicionar uma impressora** (no topo).
4. Clique na frase azul: **"A impressora que eu quero não está na lista"**.
5. Escolha a última opção: **"Adicionar uma impressora local ou de rede com configurações manuais"** e clique em Avançar.
6. Em **"Usar uma porta existente"**, procure por alguma porta chamada **COM** (ex: `COM3`, `COM4`). Geralmente as Bluetooth usam uma dessas.
7. Na lista de drivers, escolha:
   - Fabricante: **Generic**
   - Impressora: **Generic / Text Only**
8. Avance até o final. 

---

## 3. Configurar no Navegador (Importante!)
Agora que ela aparecerá na lista (como "Generic / Text Only"):
1. No Painel Admin, clique no botão **"Imprimir"** em qualquer pedido.
2. Na tela de impressão que abrir:
   - **Destino**: Selecione a sua impressora Bluetooth.
   - **Páginas**: Tudo.
   - **Layout**: Retrato.
   - **Margens**: Selecione **"Nenhuma"** ou **"Mínima"**.
   - **Escala**: Se o texto parecer cortado, ajuste a escala para **90%** ou **Ajustar à área de impressão**.
   - **Cabeçalhos e Rodapés**: **DESMARQUE** esta opção (para não sair o link do site no papel).

## 3. Dicas de Ouro
- **Tamanho do Papel**: Já configurei o sistema para **58mm**, que é o padrão da maioria dessas impressoras.
- **Chrome/Edge**: Se estiver no celular, o Chrome funciona muito bem com essas impressoras após parear o Bluetooth.
- **Impressão Direta**: Quando você clicar em imprimir e selecionar a impressora uma vez, o navegador geralmente lembrará da sua escolha para a próxima vez!

---

## 🆘 Problema: Aparece "Driver Indisponível"?
Se você vir essa mensagem no Windows, **não se preocupe**. Isso é normal com essas mini impressoras chinesas porque o Windows não reconhece o chip delas automaticamente.

**Como resolver:**
1. Ignore a mensagem de erro nas configurações de Bluetooth.
2. Siga **exatamente** o **Capítulo 2** (Adicionar manualmente pelo Painel de Controle).
3. Quando você usa o driver **"Generic / Text Only"**, o Windows passa a tratar ela como uma impressora de texto, e o erro de "Driver Indisponível" desaparece.

### Não aparece porta COM?
Se no Passo 6 do Capítulo 2 você não souber qual porta COM escolher:
1. Vá nas configurações de Bluetooth.
2. Clique em **Mais configurações de Bluetooth** (ou Mais opções).
3. Vá na aba **Portas COM**.
4. Veja qual porta está associada à sua impressora (ex: `COM4 Saída`). Use essa porta no Passo 6!
