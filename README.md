# MyPhone — Premium Showcase

Protótipo de vitrine digital para a MyPhone (Campina Grande/PB), construído em **React + Vite + Bootstrap 5**.

## Conceito

- Clean premium, com bastante respiro visual
- Interatividade sem poluição
- Hero com parallax/3D
- Vitrine com hover 3D
- Modal de produto com capacidade + CTA para WhatsApp
- Seções responsivas e animações por scroll
- Informações da loja e acesso rápido a Instagram, WhatsApp e mapa

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Catálogo

Os produtos ficam em:

`src/data/products.js`

A vitrine foi montada como **demonstração**. Preços e disponibilidade não são inventados: o CTA consulta diretamente a loja.

As imagens de aparelhos apontam para assets públicos oficiais da Apple (CDN da Apple) para evitar mockups genéricos e manter os modelos visualmente fiéis. Por isso, as imagens exigem conexão com a internet.

## Experiência 360°

A seção após o hero usa um modelo real de iPhone 15 Pro Max em GLB (aprox. 569 KB), carregado somente quando a seção se aproxima da tela. O arquivo foi disponibilizado pelo projeto [Pane](https://github.com/ibuhs/Pane) e é de [MajdyModels](https://sketchfab.com/3d-models/iphone-15-pro-max-5b7b35513a154ac69619dc2b2fe15686), sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). A atribuição completa está em `public/assets/iphone-15-pro-max-LICENSE.txt` e junto da visualização no site.

O visor utiliza versões otimizadas dos papéis de parede do iPhone 15 Pro obtidas na [coleção AppleWalls](https://www.applewalls.com/en/wallpapers/iphone/iphone-15-pro-wallpapers). O controle permite arrastar, usar as setas do teclado e escolher um acabamento sem perder o ângulo. Sem WebGL, aparece uma imagem de produto com acesso à vitrine.

## Identidade

O favicon/mark em `public/assets/brand/myphone-mark.svg` é um **mark provisório criado para o protótipo**, não a reprodução da marca oficial. Ao receber o logo oficial em SVG/PNG, basta substituí-lo e ajustar as variáveis de identidade em `src/styles.css`.

## Contato configurado no protótipo

- Instagram: `@myphone.cg`
- WhatsApp: `(83) 99112-4238`
- Endereço: `R. Tavares Cavalcante, 160 - Centro, Campina Grande/PB`
- Horário exibido: Seg–Sex 09h–20h; Sáb 09h–12h

Revise esses dados com a loja antes da publicação final.
