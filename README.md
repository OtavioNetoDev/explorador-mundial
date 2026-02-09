# 🌍 Explorador Mundial - Versão Simples (HTML + CSS + JS)

**Jogo Educativo de Geografia e História** - Sem necessidade de Node.js ou instalações!

![Versão](https://img.shields.io/badge/versão-1.0-blue.svg)
![HTML](https://img.shields.io/badge/HTML-5-orange.svg)
![CSS](https://img.shields.io/badge/CSS-3-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

---

## 🎯 Sobre o Projeto

Um jogo educativo onde estudantes viajam pelo mundo respondendo perguntas sobre geografia e história. **Agora com sistema inteligente de viagem:** os jogadores se movem para locais próximos e respondem perguntas relacionadas à região onde estão!

### ✨ Características:
- 🎮 **Multiplayer**: 1 a 20 jogadores
- 🗺️ **Mapa Interativo**: Veja todos os jogadores no mapa-múndi
- 🧭 **Viagem Geográfica Realista**: Mova-se para locais próximos da sua posição atual
- 📍 **Perguntas Contextuais**: Responda sobre o local onde você está
- 📚 **Educativo**: Aprenda enquanto joga
- 👨‍🏫 **Modo Professor**: Adicione perguntas personalizadas
- 🏆 **Sistema de Pontos**: 100 pontos por resposta correta
- 🎨 **Design Bonito**: Interface moderna e colorida
- 🛤️ **Visualização de Rota**: Veja o caminho da sua última viagem

---

## 🚀 Como Usar (SUPER FÁCIL!)

### ⚡ Método 1: Abrir Direto (Mais Rápido)

1. **Baixe todos os arquivos** desta pasta
2. **Coloque todos juntos** em uma pasta no seu computador
3. **Clique duas vezes** no arquivo `index.html`
4. **Pronto!** O jogo abre no navegador! 🎉

### 📁 Arquivos Necessários:

```
pasta-do-jogo/
├── index.html        ← Arquivo principal (clique neste!)
├── style.css         ← Estilos do jogo
├── script.js         ← Lógica do jogo
└── worldmap.png      ← Imagem do mapa
```

**IMPORTANTE:** Todos os 4 arquivos devem estar na mesma pasta!

---

## 🎮 Como Jogar

### 1️⃣ Menu Principal
- Escolha quantos jogadores (1-20)
- Clique em **"Iniciar Aventura"**

### 2️⃣ Durante o Jogo
- Veja todos os jogadores no mapa
- O jogador atual está destacado
- Clique em **"Viajar"** para ir a um local próximo
- 🧭 **NOVO:** O jogo busca locais próximos (dentro de um raio) da sua posição atual
- Se estiver na Europa, você viajará para outro país europeu próximo
- Se estiver na Ásia, irá para outro local asiático próximo

### 3️⃣ Respondendo Perguntas
- Leia a pergunta sobre o local
- Escolha uma das 4 opções
- Clique em **"Confirmar Resposta"**
- Aprenda um fato histórico!

### 4️⃣ Pontuação
- ✅ Acertou = +100 pontos
- ❌ Errou = 0 pontos
- Veja o placar no topo

---

## 👨‍🏫 Modo Professor

### Como Adicionar Perguntas:

1. No menu, clique em **"Modo Professor"**
2. Preencha o formulário:
   - **Região**: Escolha o continente
   - **Local/Cidade**: Ex: "Paris, França"
   - **País**: Ex: "França"
   - **Posição X**: 0 a 100 (esquerda para direita)
   - **Posição Y**: 0 a 100 (cima para baixo)
   - **Pergunta**: Sua pergunta educativa
   - **4 Opções**: As alternativas
   - **Marque a correta**: Selecione a resposta certa
   - **Fato**: Curiosidade sobre o local

3. Clique em **"Adicionar Pergunta"**

### 📍 Dicas de Coordenadas:

| Local | X | Y |
|-------|---|---|
| Brasil | 38 | 72 |
| Estados Unidos | 25 | 35 |
| França | 50 | 30 |
| Japão | 80 | 42 |
| Austrália | 85 | 80 |
| Egito | 54 | 48 |

**Dica:** Use o Paint ou similar para encontrar coordenadas exatas no mapa!

---

## 📚 Perguntas Incluídas

O jogo já vem com **27 perguntas** sobre locais famosos ao redor do mundo!

### 🌎 América do Norte (5 perguntas):
- Pearl Harbor (ataque de 1941)
- Estátua da Liberdade
- Casa Branca (Washington D.C.)
- Teotihuacan (México)
- Revolução Cubana

### 🌎 América do Sul (4 perguntas):
- Machu Picchu (civilização Inca)
- Independência do Brasil (1822)
- Buenos Aires (Argentina)
- Ilhas Galápagos (Darwin)

### 🌍 Europa (6 perguntas):
- Revolução Francesa (1789)
- Queda do Muro de Berlim (1989)
- Big Ben (Londres)
- Coliseu (Roma)
- Partenon (Atenas)
- Praça Vermelha (Moscou)

### 🌍 África (3 perguntas):
- Pirâmides do Egito
- Nelson Mandela (África do Sul)
- Marrocos

### 🌏 Ásia (6 perguntas):
- Hiroshima (bomba atômica)
- Grande Muralha da China
- Pequim (capital da China)
- Taj Mahal (Índia)
- Angkor Wat (Camboja)
- Jerusalém (cidade sagrada)

### 🌏 Oceania (3 perguntas):
- Aborígenes da Austrália
- Maoris (Nova Zelândia)
- Moais (Ilha de Páscoa)

---

## 🔧 Personalizações

### Mudar Cores dos Jogadores:

Edite o arquivo `script.js`, linha 103:

```javascript
const PLAYER_COLORS = [
    '#FF6B6B', // Vermelho
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    // Adicione mais cores aqui!
];
```

### Mudar Pontuação:

No arquivo `script.js`, linha 481:

```javascript
player.score += isCorrect ? 100 : 0;
// Mude 100 para o valor que quiser
```

### Adicionar Mais Perguntas:

Use o **Modo Professor** no menu do jogo!

---

## 💻 Tecnologias Usadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e animações
- **JavaScript (ES6)**: Lógica do jogo
- **Google Fonts**: Fonte Poppins

**Nenhuma biblioteca externa!** Funciona 100% offline!

---

## 🌐 Navegadores Suportados

✅ Chrome (recomendado)  
✅ Firefox  
✅ Edge  
✅ Safari  
✅ Opera  

---

## 📱 Funciona no Celular?

**Sim!** O jogo é responsivo e funciona em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Computadores
- 🖥️ Smart TVs com navegador

---

## 🎓 Uso em Sala de Aula

### Ideias para Professores:

1. **Projetor**: Jogue com a turma toda
2. **Equipes**: Divida em grupos de 3-4 alunos
3. **Torneios**: Faça campeonatos mensais
4. **Revisão**: Use antes de provas
5. **Alunos Criadores**: Peça para criarem perguntas

### Benefícios Educativos:

- ✅ Aprende geografia de forma divertida
- ✅ Memoriza fatos históricos
- ✅ Desenvolve raciocínio lógico
- ✅ Trabalha em equipe
- ✅ Aumenta engajamento

---

## 🆘 Problemas Comuns

### O mapa não aparece
**Solução:** Verifique se `worldmap.png` está na mesma pasta dos outros arquivos.

### As perguntas não aparecem
**Solução:** Certifique-se de que abriu o `index.html` (não o CSS ou JS).

### Não consigo adicionar perguntas
**Solução:** Preencha todos os campos obrigatórios no Modo Professor.

### O jogo não funciona no celular
**Solução:** Use um navegador moderno (Chrome, Safari, etc).

---

## 📦 Para Usar no Pendrive

1. Copie a pasta completa para o pendrive
2. Conecte em qualquer computador
3. Abra o arquivo `index.html`
4. Funciona sem internet!

---

## 🚀 Para Hospedar Online (GitHub Pages)

1. Crie uma conta no [GitHub](https://github.com)
2. Crie um novo repositório
3. Faça upload de todos os arquivos
4. Vá em Settings → Pages
5. Selecione a branch `main`
6. Seu jogo estará online!

**URL será:** `seu-usuario.github.io/nome-do-repositorio`

---

## 🤝 Contribuindo

Quer melhorar o jogo? Ideias:

- 📝 Adicionar mais perguntas
- 🎨 Criar novos temas visuais
- 🏆 Adicionar conquistas
- 🔊 Incluir sons
- 💾 Salvar progresso
- 🌐 Traduzir para outros idiomas

---

## 📄 Licença

Este projeto é de **código aberto**. Você pode:
- ✅ Usar em sala de aula
- ✅ Modificar como quiser
- ✅ Compartilhar com outros professores
- ✅ Postar no GitHub

---

## 📧 Suporte

Dúvidas? Sugestões?
- Abra uma **issue** no GitHub
- Envie um **pull request**
- Compartilhe suas melhorias!

---

## 🌟 Gostou?

Se este projeto ajudou você:
- ⭐ Dê uma estrela no GitHub
- 📢 Compartilhe com outros professores
- 💬 Deixe seu feedback

---

**Desenvolvido com ❤️ para educação**

🎓 Professores ensinando, tecnologia ajudando!

---

## 📊 Estatísticas

- 🎮 **Versão:** 2.0
- 📝 **Perguntas Incluídas:** 27
- 🌍 **Regiões:** 6 continentes
- 👥 **Jogadores:** 1-20
- 📦 **Tamanho:** ~600KB total
- 🚀 **Velocidade:** Instantânea!
- 🧭 **Sistema de Viagem:** Geográfico Inteligente

---

**Divirta-se aprendendo! 🌍📚🎮**
