/* ================================================================
   EXPlORADOR MUNDIAL v2 · game.js

   © 2026 Otávio Neto — Todos os direitos reservados
   Licença: MIT — uso educativo livre

   GitHub    : https://github.com/OtavioNetoDev
   Instagram : https://instagram.com/euotavioneto_
   LinkedIn  : https://www.linkedin.com/in/otavionetodev/
================================================================ */

/* ================================================================
   EXPlORADOR MUNDIAL v2 · game.js
   - Countdown de 5s antes do quiz (jogador vê o mapa)
   - Quiz no painel lateral (não cobre o mapa)
   - Painel do professor com hover mostrando região/coords
   - localStorage para pontos do professor
   - Banco interno com 100+ perguntas por região estrita
================================================================ */
'use strict';

/* ----------------------------------------------------------------
   CALIBRAÇÃO DO MAPA (imagem 1656 × 950 px)
   Área útil (sem as bordas com labels):
     esquerda=55  direita=1636  topo=15  base=930
---------------------------------------------------------------- */
const MC = { W:1656, H:950, E:55, D:1636, T:15, B:930 };
MC.mW = MC.D - MC.E;  // 1581 px
MC.mH = MC.B - MC.T;  // 915 px

/** lat/lon → porcentagem do contêiner da imagem */
function paraPorcentagem(lat, lon) {
  return {
    x: ((MC.E + (lon + 180) * (MC.mW / 360)) / MC.W) * 100,
    y: ((MC.T + (90 - lat)  * (MC.mH / 180)) / MC.H) * 100,
  };
}

/** Clique no elemento → lat/lon */
function cliquePara(e, el) {
  const r = el.getBoundingClientRect();
  const px = ((e.clientX - r.left) / r.width)  * MC.W;
  const py = ((e.clientY - r.top)  / r.height) * MC.H;
  return {
    lat: Math.round(limitar(90  - ((py - MC.T) / MC.mH) * 180, -88, 88)),
    lon: Math.round(limitar(((px - MC.E) / MC.mW) * 360 - 180, -178, 178)),
  };
}

/* ----------------------------------------------------------------
   REGIÕES GEOGRÁFICAS ESTRITAS
   Ordem: mais específica primeiro → genérica depois
---------------------------------------------------------------- */
const REGIOES = [
  // América do Sul
  {id:'brasil',      label:'Brasil',             latMin:-34,latMax:5,  lonMin:-74,lonMax:-34},
  {id:'argentina',   label:'Argentina',           latMin:-56,latMax:-22,lonMin:-74,lonMax:-52},
  {id:'chile',       label:'Chile',               latMin:-56,latMax:-17,lonMin:-76,lonMax:-66},
  {id:'peru',        label:'Peru',                latMin:-18,latMax:0,  lonMin:-82,lonMax:-68},
  {id:'bolivia',     label:'Bolívia',             latMin:-23,latMax:-9, lonMin:-70,lonMax:-57},
  {id:'colombia',    label:'Colômbia',            latMin:-4, latMax:13, lonMin:-78,lonMax:-65},
  {id:'venezuela',   label:'Venezuela',           latMin:0,  latMax:13, lonMin:-74,lonMax:-59},
  {id:'am_sul',      label:'América do Sul',      latMin:-56,latMax:13, lonMin:-82,lonMax:-34},
  // América do Norte
  {id:'mexico',      label:'México',              latMin:14, latMax:32, lonMin:-120,lonMax:-86},
  {id:'eua',         label:'Estados Unidos',      latMin:25, latMax:50, lonMin:-125,lonMax:-65},
  {id:'canada',      label:'Canadá',              latMin:49, latMax:72, lonMin:-142,lonMax:-52},
  {id:'am_norte',    label:'América do Norte',    latMin:14, latMax:72, lonMin:-170,lonMax:-52},
  // Europa
  {id:'portugal',    label:'Portugal',            latMin:37, latMax:42, lonMin:-10,lonMax:-6},
  {id:'espanha',     label:'Espanha',             latMin:36, latMax:44, lonMin:-9, lonMax:4},
  {id:'franca',      label:'França',              latMin:42, latMax:51, lonMin:-5, lonMax:9},
  {id:'italia',      label:'Itália',              latMin:37, latMax:47, lonMin:7,  lonMax:18},
  {id:'alemanha',    label:'Alemanha',            latMin:47, latMax:55, lonMin:6,  lonMax:15},
  {id:'grecia',      label:'Grécia',              latMin:35, latMax:42, lonMin:20, lonMax:28},
  {id:'uk',          label:'Reino Unido',         latMin:50, latMax:61, lonMin:-8, lonMax:2},
  {id:'escandinavia',label:'Escandinávia',        latMin:55, latMax:72, lonMin:4,  lonMax:32},
  {id:'russia_eur',  label:'Rússia (Europa)',     latMin:50, latMax:70, lonMin:28, lonMax:60},
  {id:'europa',      label:'Europa',              latMin:35, latMax:72, lonMin:-12,lonMax:45},
  // África
  {id:'egito',       label:'Egito',               latMin:22, latMax:32, lonMin:24, lonMax:37},
  {id:'africa_norte',label:'Norte da África',     latMin:15, latMax:38, lonMin:-6, lonMax:37},
  {id:'africa_sul',  label:'África do Sul',       latMin:-36,latMax:-22,lonMin:16, lonMax:36},
  {id:'africa_leste',label:'Leste da África',     latMin:-12,latMax:15, lonMin:30, lonMax:52},
  {id:'africa_oeste',label:'África Ocidental',    latMin:4,  latMax:20, lonMin:-18,lonMax:15},
  {id:'africa',      label:'África',              latMin:-36,latMax:38, lonMin:-18,lonMax:52},
  // Oriente Médio e Ásia
  {id:'arabia',      label:'Arábia Saudita',      latMin:15, latMax:32, lonMin:36, lonMax:56},
  {id:'or_medio',    label:'Oriente Médio',       latMin:12, latMax:42, lonMin:34, lonMax:62},
  {id:'india',       label:'Índia',               latMin:6,  latMax:36, lonMin:66, lonMax:92},
  {id:'china',       label:'China',               latMin:18, latMax:55, lonMin:98, lonMax:135},
  {id:'japao',       label:'Japão',               latMin:30, latMax:46, lonMin:129,lonMax:146},
  {id:'russia_asia', label:'Rússia / Sibéria',    latMin:50, latMax:78, lonMin:60, lonMax:180},
  {id:'asia_se',     label:'Sudeste Asiático',    latMin:-10,latMax:22, lonMin:94, lonMax:142},
  {id:'asia',        label:'Ásia',                latMin:-10,latMax:78, lonMin:26, lonMax:180},
  // Oceania
  {id:'australia',   label:'Austrália',           latMin:-44,latMax:-10,lonMin:112,lonMax:154},
  {id:'oceania',     label:'Oceania',             latMin:-50,latMax:-10,lonMin:110,lonMax:180},
  // Polares
  {id:'artico',      label:'Ártico',              latMin:66, latMax:90, lonMin:-180,lonMax:180},
  {id:'antartica',   label:'Antártida',           latMin:-90,latMax:-60,lonMin:-180,lonMax:180},
  // Oceanos
  {id:'oceano',      label:'Oceano',              latMin:-90,latMax:90, lonMin:-180,lonMax:180},
];

function detectarRegiao(lat, lon) {
  for (const r of REGIOES) {
    if (lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax)
      return r;
  }
  return { id:'oceano', label:'Oceano' };
}

/* ----------------------------------------------------------------
   BANCO DE PERGUNTAS INTERNO
   Cada banco indexado pelo id da região.
   REGRA ESTRITA: perguntas só sobre aquela região.
---------------------------------------------------------------- */
const BANCO = {
  brasil:[
    {q:'Qual é a capital do Brasil?',opts:['São Paulo','Rio de Janeiro','Brasília','Manaus'],ok:'C',fat:'Brasília foi inaugurada em 1960 e tem forma de avião vista do alto.'},
    {q:'Em que ano o Brasil se tornou independente de Portugal?',opts:['1808','1815','1822','1889'],ok:'C',fat:'D. Pedro I proclamou a independência às margens do Rio Ipiranga em 7 de setembro de 1822.'},
    {q:'Qual é o maior bioma do Brasil?',opts:['Cerrado','Mata Atlântica','Caatinga','Amazônia'],ok:'D',fat:'A Amazônia cobre mais de 4 milhões de km² e abriga 10% de todas as espécies do planeta.'},
    {q:'Em que ano foi proclamada a República no Brasil?',opts:['1888','1889','1891','1894'],ok:'B',fat:'A Proclamação da República ocorreu em 15 de novembro de 1889, liderada pelo Marechal Deodoro.'},
    {q:'Qual tratado de 1494 dividiu as posses entre Portugal e Espanha?',opts:['Alcáçovas','Tordesilhas','Madrid','Utrecht'],ok:'B',fat:'A linha de Tordesilhas foi traçada a 370 léguas a oeste das Ilhas de Cabo Verde.'},
    {q:'Qual rio tem o maior volume de água do mundo e cruza o Brasil?',opts:['Paraná','São Francisco','Tocantins','Amazonas'],ok:'D',fat:'O Amazonas despeja cerca de 20% de toda a água doce que vai ao oceano no mundo.'},
    {q:'Qual ciclo econômico foi o primeiro grande ciclo colonial do Brasil?',opts:['Ouro','Borracha','Cana-de-açúcar','Café'],ok:'C',fat:'O ciclo do açúcar durou do século XVI ao XVII e dependeu do trabalho escravo africano.'},
    {q:'Qual é o ponto mais alto do Brasil?',opts:['Pico do Itambé','Agulhas Negras','Pico da Neblina','Monte Roraima'],ok:'C',fat:'O Pico da Neblina tem 2.994 m e fica na Amazônia, na fronteira com a Venezuela.'},
    {q:'Qual cidade foi capital do Brasil antes de Brasília?',opts:['Salvador','São Paulo','Ouro Preto','Rio de Janeiro'],ok:'D',fat:'O Rio de Janeiro foi capital por 197 anos, de 1763 a 1960.'},
  ],
  argentina:[
    {q:'Qual é a capital da Argentina?',opts:['Córdoba','Rosário','Mendoza','Buenos Aires'],ok:'D',fat:'Buenos Aires significa "bons ventos" e foi fundada definitivamente em 1580.'},
    {q:'Qual guerra ocorreu entre Argentina e Reino Unido em 1982?',opts:['Guerra do Chaco','Guerra do Paraguai','Guerra das Malvinas','Guerra do Prata'],ok:'C',fat:'A Guerra das Malvinas durou 74 dias e terminou com a vitória britânica.'},
    {q:'Qual é o ponto mais alto das Américas, localizado nos Andes argentinos?',opts:['Monte Roraima','Ojos del Salado','Aconcágua','Fitz Roy'],ok:'C',fat:'O Aconcágua tem 6.961m e é o pico mais alto fora da Ásia.'},
  ],
  chile:[
    {q:'Qual é o deserto mais seco do mundo, no Chile e Peru?',opts:['Gobi','Namibe','Patagônia','Atacama'],ok:'D',fat:'Em partes do Atacama, não há registro de chuva nos últimos 400 anos.'},
    {q:'Qual é a capital do Chile?',opts:['Valparaíso','Concepción','Antofagasta','Santiago'],ok:'D',fat:'Santiago fica encravada entre os Andes e a Cordilheira da Costa, a 520m de altitude.'},
  ],
  peru:[
    {q:'Qual civilização construiu Machu Picchu?',opts:['Maia','Asteca','Olmeca','Inca'],ok:'D',fat:'Machu Picchu foi construída no século XV e nunca foi encontrada pelos conquistadores espanhóis.'},
    {q:'Qual é o lago mais alto e navegável do mundo?',opts:['Lago Poopó','Lago Maracaibo','Lago Titicaca','Lagoa dos Patos'],ok:'C',fat:'O Lago Titicaca está a 3.812m de altitude, na fronteira entre Peru e Bolívia.'},
  ],
  bolivia:[
    {q:'Por que a Bolívia é geograficamente única na América do Sul?',opts:['É um país insular','É o país mais populoso','Tem dois fusos horários','Não tem saída para o mar'],ok:'D',fat:'A Bolívia perdeu o acesso ao mar para o Chile na Guerra do Pacífico (1879–1884).'},
    {q:'Qual é a capital administrativa da Bolívia?',opts:['Santa Cruz','Cochabamba','La Paz','Sucre'],ok:'C',fat:'La Paz é a capital administrativa e Sucre é a capital constitucional da Bolívia.'},
  ],
  colombia:[
    {q:'Quem foi Simón Bolívar?',opts:['Conquistador espanhol','Imperador do Brasil','Rei da Colômbia','Libertador da América do Sul'],ok:'D',fat:'Bolívar libertou Venezuela, Colômbia, Equador, Peru e Bolívia, que leva seu nome.'},
    {q:'Qual produto agrícola tornou a Colômbia mundialmente famosa?',opts:['Cacau','Cana-de-açúcar','Café','Banana'],ok:'C',fat:'A Colômbia é o terceiro maior produtor de café do mundo, atrás de Brasil e Vietnã.'},
  ],
  venezuela:[
    {q:'Qual é a maior queda d\'água do mundo, na Venezuela?',opts:['Cataratas do Iguaçu','Salto do Anjo','Cataratas Victoria','Salto Yumbilla'],ok:'B',fat:'O Salto do Anjo tem 979m de altura e foi descoberto pelo aviador Jimmy Angel em 1933.'},
    {q:'Qual é a capital da Venezuela?',opts:['Maracaibo','Barquisimeto','Valencia','Caracas'],ok:'D',fat:'Caracas está numa montanha a 900m de altitude, muito próxima do Mar do Caribe.'},
  ],
  am_sul:[
    {q:'Qual é a cordilheira mais longa do mundo?',opts:['Himalaia','Alpes','Rocky Mountains','Andes'],ok:'D',fat:'Os Andes têm 7.200km de comprimento e mais de 100 vulcões ativos.'},
    {q:'Qual guerra envolveu Argentina, Brasil, Uruguai e Paraguai (1864–1870)?',opts:['Guerra do Chaco','Guerra da Cisplatina','Guerra do Pacífico','Guerra do Paraguai'],ok:'D',fat:'O Paraguai perdeu mais de metade de sua população nesta guerra.'},
  ],
  mexico:[
    {q:'Qual civilização foi conquistada pelos espanhóis no México em 1521?',opts:['Inca','Maia','Olmeca','Asteca'],ok:'D',fat:'Hernán Cortés destruiu Tenochtitlán, capital asteca, onde hoje está a Cidade do México.'},
    {q:'Qual é a capital do México?',opts:['Guadalajara','Monterrey','Tijuana','Cidade do México'],ok:'D',fat:'A Cidade do México foi construída sobre as ruínas da antiga Tenochtitlán asteca.'},
    {q:'Qual rio forma a fronteira entre México e EUA?',opts:['Rio Colorado','Rio Conchos','Rio Pecos','Rio Grande'],ok:'D',fat:'O Rio Grande / Rio Bravo tem 3.000km e separa os dois países por mais de 2.000km.'},
  ],
  eua:[
    {q:'Em que ano os EUA declararam independência da Inglaterra?',opts:['1763','1775','1776','1783'],ok:'C',fat:'A Declaração de Independência foi redigida principalmente por Thomas Jefferson.'},
    {q:'Qual evento levou os EUA a entrar na Segunda Guerra Mundial?',opts:['Invasão da Polônia','Queda da França','Batalha da Grã-Bretanha','Ataque a Pearl Harbor'],ok:'D',fat:'O ataque japonês a Pearl Harbor em 7 de dezembro de 1941 destruiu 188 aeronaves americanas.'},
    {q:'Qual presidente aboliu a escravidão nos EUA?',opts:['George Washington','Thomas Jefferson','Abraham Lincoln','Ulysses Grant'],ok:'C',fat:'A Proclamação de Emancipação de Lincoln em 1863 libertou os escravizados nos estados do Sul.'},
    {q:'Qual é o maior estado dos EUA em extensão?',opts:['Texas','Califórnia','Montana','Alasca'],ok:'D',fat:'O Alasca foi comprado da Rússia em 1867 por apenas 7,2 milhões de dólares.'},
  ],
  canada:[
    {q:'Qual é a capital do Canadá?',opts:['Toronto','Vancouver','Montréal','Ottawa'],ok:'D',fat:'Ottawa foi escolhida capital em 1857 pela Rainha Vitória para mediar a rivalidade entre cidades.'},
    {q:'Qual é o maior país das Américas em extensão?',opts:['EUA','Brasil','México','Canadá'],ok:'D',fat:'O Canadá é o segundo maior país do mundo, com 9,98 milhões de km².'},
  ],
  am_norte:[
    {q:'Qual é o pico mais alto da América do Norte?',opts:['Monte Logan','Monte Whitney','Monte Rainier','Denali'],ok:'D',fat:'O Denali, no Alasca, tem 6.190m e é o ponto mais alto da América do Norte.'},
  ],
  portugal:[
    {q:'Qual explorador português chegou à Índia pelo mar em 1498?',opts:['Pedro Álvares Cabral','Bartolomeu Dias','Fernão de Magalhães','Vasco da Gama'],ok:'D',fat:'Vasco da Gama abriu a rota marítima para as Índias, dobrando o Cabo da Boa Esperança.'},
    {q:'Que catástrofe devastou Lisboa em 1755?',opts:['Erupção vulcânica','Epidemia de peste','Terremoto e maremoto','Incêndio e guerra'],ok:'C',fat:'O terremoto de 1755 matou entre 30.000 e 40.000 pessoas e destruiu 85% dos edifícios de Lisboa.'},
    {q:'Qual é a capital de Portugal?',opts:['Porto','Coimbra','Braga','Lisboa'],ok:'D',fat:'Lisboa é uma das cidades mais antigas da Europa, fundada há mais de 3.000 anos.'},
  ],
  espanha:[
    {q:'Quem financiou a viagem de Colombo em 1492?',opts:['Portugal','França','Inglaterra','Espanha'],ok:'D',fat:'Os Reis Católicos Fernando e Isabel financiaram a viagem de Colombo ao que chamou de "Índias".'},
    {q:'Qual é a capital da Espanha?',opts:['Barcelona','Sevilha','Valência','Madri'],ok:'D',fat:'Madri é capital há mais de 450 anos e abriga o famoso Museu do Prado.'},
  ],
  franca:[
    {q:'O que foi a Revolução Francesa de 1789?',opts:['Golpe militar','Revolução industrial','Invasão estrangeira','Revolução popular contra a monarquia'],ok:'D',fat:'A Revolução Francesa aboliu o feudalismo e inspirou movimentos democráticos no mundo.'},
    {q:'Quem foi Napoleão Bonaparte?',opts:['Rei da França','Presidente da República','Imperador da França','General estrangeiro'],ok:'C',fat:'Napoleão reformou o sistema jurídico criando o Código Napoleônico, base de muitos sistemas legais.'},
    {q:'Qual é a capital da França?',opts:['Lyon','Marselha','Bordeaux','Paris'],ok:'D',fat:'Paris é conhecida como a "Cidade Luz" e recebe mais de 30 milhões de turistas por ano.'},
  ],
  italia:[
    {q:'Qual é a capital da Itália?',opts:['Milão','Florença','Nápoles','Roma'],ok:'D',fat:'Roma é chamada de "Cidade Eterna" e foi o centro do maior império da Antiguidade ocidental.'},
    {q:'O que foi o Renascimento italiano?',opts:['Reforma religiosa','Revolução industrial','Invasão romana','Movimento de renovação artística e científica'],ok:'D',fat:'O Renascimento (séc. XIV–XVII) produziu Leonardo da Vinci, Michelangelo e Galileu Galilei.'},
  ],
  alemanha:[
    {q:'Em que ano caiu o Muro de Berlim?',opts:['1985','1987','1989','1991'],ok:'C',fat:'O Muro foi construído em 1961 e durante 28 anos dividiu famílias e a cidade de Berlim.'},
    {q:'Qual evento iniciou a Primeira Guerra Mundial em 1914?',opts:['Invasão da Bélgica','Crise do Marrocos','Queda do Império Otomano','Assassinato do Arquiduque Franz Ferdinand'],ok:'D',fat:'O assassinato em Sarajevo em 28 de junho de 1914 desencadeou um conflito com 20 milhões de mortos.'},
    {q:'Qual é a capital da Alemanha?',opts:['Munique','Hamburgo','Frankfurt','Berlim'],ok:'D',fat:'Berlim é a maior cidade da Alemanha e voltou a ser capital após a reunificação em 1990.'},
  ],
  grecia:[
    {q:'Qual filósofo ateniense foi condenado à morte com veneno de cicuta?',opts:['Platão','Aristóteles','Tales','Sócrates'],ok:'D',fat:'Sócrates nunca escreveu nada — seu pensamento é conhecido pelos diálogos de seu discípulo Platão.'},
    {q:'Onde ocorreram os primeiros Jogos Olímpicos da Antiguidade?',opts:['Atenas','Esparta','Corinto','Olímpia'],ok:'D',fat:'Os Jogos Olímpicos da Antiguidade ocorriam em Olímpia desde 776 a.C., em honra ao deus Zeus.'},
    {q:'O que foi a Democracia Ateniense?',opts:['Governo de um rei absoluto','Governo de generais militares','Governo de religiosos','Sistema participativo de governo na Grécia antiga'],ok:'D',fat:'Atenas foi a primeira cidade a desenvolver a democracia, embora apenas homens livres pudessem votar.'},
    {q:'Qual guerra ocorreu entre gregos e persas no século V a.C.?',opts:['Guerra do Peloponeso','Guerra de Tróia','Guerra da Macedônia','Guerras Médicas'],ok:'D',fat:'Na Batalha de Salamina (480 a.C.) a frota grega derrotou a poderosa armada persa de Xerxes.'},
  ],
  uk:[
    {q:'Qual é a capital do Reino Unido?',opts:['Edimburgo','Manchester','Birmingham','Londres'],ok:'D',fat:'Londres foi fundada pelos romanos como "Londinium" e é capital há mais de 1.000 anos.'},
    {q:'Qual era o nome do maior império colonial da história?',opts:['Império Espanhol','Império Francês','Império Britânico','Império Português'],ok:'C',fat:'O Império Britânico chegou a cobrir 24% da superfície terrestre e governar 23% da população mundial.'},
  ],
  escandinavia:[
    {q:'Quem foram os Vikings?',opts:['Guerreiros romanos do norte','Tribos celtas','Comerciantes bizantinos','Navegadores e guerreiros escandinavos medievais'],ok:'D',fat:'Os Vikings chegaram à América do Norte cerca de 500 anos antes de Colombo.'},
    {q:'Qual país escandinavo foi o primeiro a conceder voto às mulheres?',opts:['Suécia','Dinamarca','Finlândia','Noruega'],ok:'D',fat:'A Noruega concedeu voto às mulheres em 1913, sendo um dos primeiros países do mundo.'},
  ],
  russia_eur:[
    {q:'O que foi a Revolução Russa de 1917?',opts:['Golpe militar conservador','Invasão alemã','Reforma agrária pacífica','Revolução que derrubou o Czar e instaurou o comunismo'],ok:'D',fat:'A Revolução de Outubro de 1917 levou Lenin e os bolcheviques ao poder, criando a URSS.'},
    {q:'Qual é a capital da Rússia?',opts:['São Petersburgo','Kiev','Novosibirsk','Moscou'],ok:'D',fat:'Moscou abriga o Kremlin e a Praça Vermelha, símbolos históricos do poder russo.'},
  ],
  europa:[
    {q:'Qual é o menor país do mundo, localizado na Europa?',opts:['Monaco','San Marino','Liechtenstein','Vaticano'],ok:'D',fat:'O Vaticano tem apenas 0,44 km² e é a sede da Igreja Católica Romana.'},
    {q:'Em que ano terminou a Segunda Guerra Mundial na Europa?',opts:['1943','1944','1945','1946'],ok:'C',fat:'A rendição da Alemanha foi assinada em 8 de maio de 1945 — o Dia da Vitória na Europa.'},
    {q:'Qual organização integra economicamente a maioria dos países europeus?',opts:['OTAN','OCDE','Conselho Europeu','União Europeia'],ok:'D',fat:'A União Europeia foi criada pelo Tratado de Maastricht em 1993 e tem 27 países membros.'},
  ],
  egito:[
    {q:'Qual civilização construiu as pirâmides de Gizé?',opts:['Suméria','Fenícia','Núbia','Egípcia'],ok:'D',fat:'A Grande Pirâmide de Gizé foi o edifício mais alto do mundo por 3.800 anos.'},
    {q:'Qual é o rio mais longo do mundo, que fertilizou o Egito Antigo?',opts:['Amazonas','Congo','Niger','Nilo'],ok:'D',fat:'O Nilo tem 6.650km e foi a base da civilização egípcia por mais de 5.000 anos.'},
    {q:'Qual é a capital do Egito?',opts:['Alexandria','Luxor','Assuã','Cairo'],ok:'D',fat:'O Cairo é a maior cidade da África, com mais de 20 milhões de habitantes.'},
  ],
  africa_norte:[
    {q:'Qual é o maior deserto do mundo?',opts:['Gobi','Kalahari','Namibe','Saara'],ok:'D',fat:'O Saara tem 9,2 milhões de km², aproximadamente o tamanho dos EUA.'},
    {q:'Qual é o maior país da África em extensão?',opts:['Nigéria','Sudão','Congo','Argélia'],ok:'D',fat:'A Argélia tem 2,38 milhões de km² e é o maior país do continente africano.'},
  ],
  africa_sul:[
    {q:'Quem liderou a luta contra o apartheid na África do Sul?',opts:['Desmond Tutu','Steve Biko','Thabo Mbeki','Nelson Mandela'],ok:'D',fat:'Mandela ficou 27 anos preso e tornou-se o primeiro presidente negro da África do Sul em 1994.'},
    {q:'O que foi o apartheid?',opts:['Guerra civil','Ditadura militar','Movimento de independência','Sistema de segregação racial'],ok:'D',fat:'O apartheid vigorou de 1948 a 1994 e dividia a sociedade sul-africana por raça.'},
    {q:'Qual é o monte mais alto da África?',opts:['Monte Quênia','Rwenzori','Ras Dejen','Kilimanjaro'],ok:'D',fat:'O Kilimanjaro tem 5.895m e é um vulcão inativo na Tanzânia.'},
  ],
  africa_leste:[
    {q:'Qual é o maior lago da África?',opts:['Tanganica','Malawi','Chade','Vitória'],ok:'D',fat:'O Lago Vitória é o segundo maior lago de água doce do mundo em superfície.'},
    {q:'Qual país é considerado o berço da humanidade, com fósseis de 3 milhões de anos?',opts:['Egito','Tanzânia','Quênia','Etiópia'],ok:'D',fat:'A Etiópia abriga o fóssil "Lucy" (Australopithecus afarensis), com 3,2 milhões de anos.'},
  ],
  africa_oeste:[
    {q:'Qual império medieval controlava o comércio de ouro e sal na África Ocidental?',opts:['Império Zulu','Império Otomano','Reino do Congo','Império Mali'],ok:'D',fat:'O Império Mali (séc. XIII–XVI) foi um dos maiores impérios da história africana.'},
  ],
  africa:[
    {q:'Quem colonizou Angola, Moçambique e Cabo Verde?',opts:['Inglaterra','França','Bélgica','Portugal'],ok:'D',fat:'Portugal manteve seu império colonial africano por mais de 500 anos, até 1975.'},
    {q:'Quantos países existem na África?',opts:['44','48','54','62'],ok:'C',fat:'A África tem 54 países reconhecidos, mais do que qualquer outro continente.'},
  ],
  arabia:[
    {q:'Qual é a capital da Arábia Saudita?',opts:['Meca','Medina','Jidá','Riade'],ok:'D',fat:'Riade significa "jardins" em árabe e é a maior cidade da Península Arábica.'},
    {q:'Qual recurso natural torna o Oriente Médio estratégico?',opts:['Ouro','Diamantes','Fosfato','Petróleo'],ok:'D',fat:'O Oriente Médio detém cerca de 48% das reservas mundiais de petróleo.'},
  ],
  or_medio:[
    {q:'Qual cidade é sagrada para cristãos, judeus e muçulmanos?',opts:['Meca','Medina','Bagdá','Jerusalém'],ok:'D',fat:'Jerusalém é a única cidade do mundo considerada sagrada pelas três religiões abraâmicas.'},
    {q:'O que foi a Mesopotâmia?',opts:['Região entre o Nilo e o Mar Vermelho','Região entre os rios Tigre e Eufrates','Antiga Pérsia','Região da Anatólia'],ok:'B',fat:'A Mesopotâmia (atual Iraque) é o berço da civilização, com escrita surgindo há 5.000 anos.'},
    {q:'Qual império islâmico dominou o Oriente Médio entre os séc. XIV e XX?',opts:['Mongol','Persa','Abássida','Otomano'],ok:'D',fat:'O Império Otomano durou 623 anos (1299–1922) e chegou a ter 32 províncias.'},
  ],
  india:[
    {q:'Quem foi Mahatma Gandhi?',opts:['Rei da Índia','General britânico','Filósofo budista','Líder da independência indiana pela não-violência'],ok:'D',fat:'Gandhi foi assassinado em 30 de janeiro de 1948, apenas 5 meses após a independência da Índia.'},
    {q:'Em que ano a Índia se tornou independente do domínio britânico?',opts:['1945','1947','1950','1952'],ok:'B',fat:'A independência em 15 de agosto de 1947 foi seguida pela partição e criação do Paquistão.'},
    {q:'Qual civilização antiga floresceu no Vale do Indo?',opts:['Vedica','Drávida','Ariana','Civilização do Vale do Indo'],ok:'D',fat:'A Civilização do Vale do Indo (3300–1300 a.C.) tinha cidades planejadas com sistemas de esgoto.'},
  ],
  china:[
    {q:'Qual é a capital da China?',opts:['Xangai','Hong Kong','Nanquim','Pequim'],ok:'D',fat:'A Cidade Proibida em Pequim tem 9.999 cômodos — os construtores evitavam 10.000, número divino.'},
    {q:'Em que ano a República Popular da China foi fundada?',opts:['1945','1947','1949','1952'],ok:'C',fat:'Mao Tsé-Tung proclamou a República Popular da China em 1º de outubro de 1949.'},
    {q:'Para que servia a Grande Muralha da China?',opts:['Controle de inundações','Fronteira comercial','Divisão de províncias','Proteção contra invasões nômades'],ok:'D',fat:'A Muralha tem mais de 21.000km e levou séculos para ser construída por várias dinastias.'},
  ],
  japao:[
    {q:'Qual evento marcou o fim da participação do Japão na Segunda Guerra?',opts:['Invasão aliada de Tóquio','Rendição da Alemanha','Queda de Berlim','Bombardeio atômico de Hiroshima e Nagasaki'],ok:'D',fat:'As bombas foram lançadas em 6 e 9 de agosto de 1945, matando entre 130.000 e 226.000 pessoas.'},
    {q:'Qual é a capital do Japão?',opts:['Osaka','Quioto','Hiroshima','Tóquio'],ok:'D',fat:'Tóquio é a maior área metropolitana do mundo, com mais de 37 milhões de pessoas.'},
  ],
  russia_asia:[
    {q:'Qual é o lago mais profundo do mundo, na Sibéria?',opts:['Lago Ladoga','Lago Cáspio','Mar de Aral','Lago Baikal'],ok:'D',fat:'O Baikal tem 1.642m de profundidade e contém 20% de toda a água doce superficial do mundo.'},
    {q:'Qual ferrovia cruza a Sibéria conectando Moscou ao Pacífico?',opts:['Ferrovia Pan-Americana','Ferrovia Transanadina','Ferrovia Oriental','Ferrovia Transiberiana'],ok:'D',fat:'A Ferrovia Transiberiana tem 9.288km e cruza 8 fusos horários.'},
  ],
  asia_se:[
    {q:'Qual templo do século XII é o maior edifício religioso do mundo?',opts:['Templo de Bagan','Templo de Borobudur','Templo de Pagan','Angkor Wat'],ok:'D',fat:'Angkor Wat, no Camboja, foi construído no século XII e cobre 162 hectares.'},
    {q:'Qual país do Sudeste Asiático tem o maior número de ilhas do mundo?',opts:['Filipinas','Malásia','Tailândia','Indonésia'],ok:'D',fat:'A Indonésia tem mais de 17.000 ilhas e é o maior arquipélago do mundo.'},
  ],
  asia:[
    {q:'Qual é o monte mais alto do mundo?',opts:['K2','Kangchenjunga','Monte Branco','Everest'],ok:'D',fat:'O Monte Everest tem 8.849m e cresce cerca de 4mm por ano pela tectônica de placas.'},
  ],
  australia:[
    {q:'Qual é a capital da Austrália?',opts:['Sydney','Melbourne','Brisbane','Canberra'],ok:'D',fat:'Canberra foi projetada pelo arquiteto americano Walter Burley Griffin após concurso em 1911.'},
    {q:'Quem foram os primeiros habitantes da Austrália?',opts:['Polinésios','Maoris','Melanésios','Aborígenes'],ok:'D',fat:'Os aborígenes australianos têm a cultura contínua mais antiga do mundo, há pelo menos 65.000 anos.'},
    {q:'Qual é o maior recife de corais do mundo?',opts:['Recife de Belize','Recife Ningaloo','Recife das Maldivas','Grande Barreira de Corais'],ok:'D',fat:'A Grande Barreira de Corais tem 2.300km e abriga mais de 1.500 espécies de peixes.'},
  ],
  oceania:[
    {q:'Qual explorador mapeou a Oceania no século XVIII?',opts:['Vasco da Gama','Fernão de Magalhães','Francis Drake','James Cook'],ok:'D',fat:'James Cook fez três grandes viagens, mapeando Austrália, Nova Zelândia e ilhas do Pacífico.'},
    {q:'Qual país da Oceania foi o primeiro a conceder voto às mulheres, em 1893?',opts:['Austrália','Samoa','Fiji','Nova Zelândia'],ok:'D',fat:'A Nova Zelândia foi o primeiro país autônomo do mundo a dar direito de voto às mulheres.'},
  ],
  artico:[
    {q:'Qual é o oceano que banha o Polo Norte?',opts:['Atlântico','Índico','Pacífico','Ártico'],ok:'D',fat:'O Oceano Ártico está perdendo gelo rapidamente — aquece 3× mais rápido que o restante do planeta.'},
  ],
  antartica:[
    {q:'Qual é o continente mais frio e ventoso da Terra?',opts:['Ártico','Groenlândia','Islândia','Antártida'],ok:'D',fat:'A Antártida tem a temperatura mais baixa já registrada: -89,2°C, na estação soviética Vostok em 1983.'},
  ],
  oceano:[
    {q:'Qual foi o primeiro europeu a cruzar o Oceano Pacífico?',opts:['Colombo','Vasco da Gama','João Dias','Fernão de Magalhães'],ok:'D',fat:'Magalhães morreu nas Filipinas em 1521. Apenas 18 dos 270 homens que partiram completaram a viagem.'},
    {q:'Qual é o oceano mais extenso do mundo?',opts:['Atlântico','Índico','Ártico','Pacífico'],ok:'D',fat:'O Pacífico tem área maior que todos os continentes juntos.'},
    {q:'Qual é o ponto mais profundo dos oceanos?',opts:['Fossa de Porto Rico','Fossa de Tonga','Fossa de Java','Fossa das Marianas'],ok:'D',fat:'A Fossa das Marianas atinge 11.034m de profundidade no Oceano Pacífico.'},
    {q:'O que foram as Grandes Navegações?',opts:['Guerras navais medievais','Rotas comerciais romanas','Invasões vikings','Expansão marítima europeia dos séc. XV–XVI'],ok:'D',fat:'Portugal e Espanha lideraram as Grandes Navegações, conectando pela primeira vez todos os continentes.'},
  ],
};

/* ----------------------------------------------------------------
   LOCALSTORAGE — PONTOS DO PROFESSOR
---------------------------------------------------------------- */
const CHAVE_LS = 'geohistoria_v5';
let PONTOS = (() => { try { return JSON.parse(localStorage.getItem(CHAVE_LS)) || []; } catch { return []; } })();
function salvarLS() { localStorage.satItem(CHAVE_LS, JSON.stringify(PONTOS)); }

/* ----------------------------------------------------------------
   ESTADO DO JOGO
---------------------------------------------------------------- */
let J = {
  jogadores:[], idx:0, rodada:1, totalRodadas:10,
  fase:'aguardando', lat:null, lon:null, regiao:null,
  questaoAtual:null, usadas:{}, ativo:false,
  filaPontos:[], histOverride:null, profLat:null, profLon:null,
  timerCountdown:null,
};

/* ----------------------------------------------------------------
   SETUP — NOMES DOS JOGADORES
---------------------------------------------------------------- */
document.getElementById('cfg-jogadores').addEventListener('input', construirNomes);
construirNomes();

function construirNomes() {
  const n = limitar(parseInt(document.getElementById('cfg-jogadores').value) || 2, 1, 20);
  const g = document.getElementById('grade-nomes');
  g.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    g.innerHTML += `<div class="pname-row"><span class="pid-tag">P${i}</span><input id="pn${i}" placeholder="Jogador ${i}" maxlength="18"></div>`;
  }
}

/* ----------------------------------------------------------------
   NAVEGAÇÃO ENTRE TELAS
---------------------------------------------------------------- */
function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
  if (id === 'tela-professor') renderizarPainel();
  if (id === 'tela-backup')    renderizarInfoBackup();
}

function confirmarVoltar() {
  if (J.ativo) document.getElementById('modal-confirmar').classList.add('ativo');
  else mostrarTela('tela-menu');
}

function fecharModal() { document.getElementById('modal-confirmar').classList.remove('ativo'); }

function confirmarMenu() {
  fecharModal();
  J.ativo = false;
  if (J.timerCountdown) clearInterval(J.timerCountdown);
  mostrarTela('tela-menu');
}

/* ----------------------------------------------------------------
   PAINEL DO PROFESSOR — HOVER E CLIQUE NO MAPA
---------------------------------------------------------------- */
function mapaHover(e) {
  const img = document.getElementById('prof-mapa-img');
  const { lat, lon } = cliquePara(e, img);
  const regiao = detectarRegiao(lat, lon);
  const fLat = formatLat(lat);
  const fLon = formatLon(lon);
  document.getElementById('hover-regiao').textContent = regiao.label;
  document.getElementById('hover-coords').textContent = `Lat: ${fLat}  ·  Lon: ${fLon}`;
}

function mapaSair() {
  document.getElementById('hover-regiao').textContent = '–';
  document.getElementById('hover-coords').textContent = 'Passe o mouse pelo mapa';
}

function mapaClicar(e) {
  const img = document.getElementById('prof-mapa-img');
  const { lat, lon } = cliquePara(e, img);
  J.profLat = lat;
  J.profLon = lon;

  const regiao = detectarRegiao(lat, lon);
  const fLat = formatLat(lat);
  const fLon = formatLon(lon);

  // Posiciona marcador de edição
  const { x, y } = paraPorcentagem(lat, lon);
  const mk = document.getElementById('marcador-edicao');
  mk.style.left = `${x}%`;
  mk.style.top  = `${y}%`;
  mk.classList.add('visivel');
  document.getElementById('marcador-texto').textContent = `${fLat}, ${fLon}`;

  // Atualiza preview
  document.getElementById('prev-lat').textContent    = fLat;
  document.getElementById('prev-lon').textContent    = fLon;
  document.getElementById('prev-regiao').textContent = regiao.label;

  // Preenche nome se vazio
  const fNome = document.getElementById('f-nome');
  if (!fNome.value) fNome.value = regiao.label;

  // Auto-preenche pergunta geográfica se vazia
  const geoQ = document.getElementById('f-geo-q');
  if (!geoQ.value) {
    geoQ.value = `Em qual região / país está este ponto marcado no mapa?`;
    document.getElementById('f-geo-a').value = regiao.label;
    document.getElementById('f-geo-b').value = regiaoAlternativa(regiao.label, 1);
    document.getElementById('f-geo-c').value = regiaoAlternativa(regiao.label, 2);
    document.getElementById('f-geo-d').value = regiaoAlternativa(regiao.label, 3);
  }

  mensagemForm('', '');
}

function regiaoAlternativa(excluir, n) {
  const opcoes = ['Brasil','Argentina','França','Egito','China','Índia','Austrália','México','Rússia','Japão','Espanha','Grécia','África do Sul','Canadá','Itália','Peru','Alemanha'];
  return opcoes.filter(o => o !== excluir)[n - 1] || opcoes[0];
}

function aplicarCoord() {
  const lat = parseFloat(document.getElementById('f-lat').value);
  const lon = parseFloat(document.getElementById('f-lon').value);
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    mensagemForm('Coordenadas inválidas. Latitude: -90 a 90, Longitude: -180 a 180.', 'err');
    return;
  }
  J.profLat = Math.round(lat);
  J.profLon = Math.round(lon);

  const regiao = detectarRegiao(J.profLat, J.profLon);
  const fLat = formatLat(J.profLat);
  const fLon = formatLon(J.profLon);

  const { x, y } = paraPorcentagem(J.profLat, J.profLon);
  const mk = document.getElementById('marcador-edicao');
  mk.style.left = `${x}%`;
  mk.style.top  = `${y}%`;
  mk.classList.add('visivel');
  document.getElementById('marcador-texto').textContent = `${fLat}, ${fLon}`;
  document.getElementById('prev-lat').textContent    = fLat;
  document.getElementById('prev-lon').textContent    = fLon;
  document.getElementById('prev-regiao').textContent = regiao.label;
  if (!document.getElementById('f-nome').value) document.getElementById('f-nome').value = regiao.label;
  mensagemForm('Coordenadas aplicadas!', 'ok');
}

function lerRadio(name) {
  const sel = document.querySelector(`input[name="${name}"]:checked`);
  return sel ? sel.value : null; // 'a' | 'b' | 'c' | 'd' | null
}

function salvarPonto() {
  if (J.profLat === null) { mensagemForm('Clique no mapa ou aplique coordenadas primeiro.', 'err'); return; }

  const nome  = document.getElementById('f-nome').value.trim();
  const geoQ  = document.getElementById('f-geo-q').value.trim();
  const geoA  = document.getElementById('f-geo-a').value.trim();
  const geoB  = document.getElementById('f-geo-b').value.trim();
  const geoC  = document.getElementById('f-geo-c').value.trim();
  const geoD  = document.getElementById('f-geo-d').value.trim();
  const histQ = document.getElementById('f-hist-q').value.trim();
  const histA = document.getElementById('f-hist-a').value.trim();
  const histB = document.getElementById('f-hist-b').value.trim();
  const histC = document.getElementById('f-hist-c').value.trim();
  const histD = document.getElementById('f-hist-d').value.trim();
  const curio = document.getElementById('f-curiosidade').value.trim();

  // Lê qual radio está marcado (a/b/c/d)
  const geoCorretaLetra  = lerRadio('geo-correta');
  const histCorretaLetra = lerRadio('hist-correta');

  // Validações
  if (!nome)
    { mensagemForm('Preencha o nome do local.', 'err'); return; }
  if (!geoQ || !geoA || !geoB || !geoC || !geoD)
    { mensagemForm('Preencha a pergunta geográfica e as 4 opções.', 'err'); return; }
  if (!geoCorretaLetra)
    { mensagemForm('Marque ✅ qual é a resposta correta da pergunta geográfica.', 'err'); return; }
  if (!histQ || !histA || !histB || !histC || !histD)
    { mensagemForm('Preencha a pergunta histórica e as 4 opções.', 'err'); return; }
  if (!histCorretaLetra)
    { mensagemForm('Marque ✅ qual é a resposta correta da pergunta histórica.', 'err'); return; }

  // Monta arrays: a ordem A/B/C/D é EXATAMENTE como o professor digitou
  // A resposta correta é determinada pelo radio marcado
  const geoOpts  = [geoA, geoB, geoC, geoD];
  const histOpts = [histA, histB, histC, histD];

  const letraParaIdx = { a:0, b:1, c:2, d:3 };
  const geoOkTexto  = geoOpts[letraParaIdx[geoCorretaLetra]];
  const histOkTexto = histOpts[letraParaIdx[histCorretaLetra]];

  // Embaralha para o jogo, mantendo rastreamento de qual é correta
  const geoEmb  = embaralhar([...geoOpts]);
  const histEmb = embaralhar([...histOpts]);

  const ponto = {
    id:   Date.now(),
    lat:  J.profLat,
    lon:  J.profLon,
    nome,
    geo: {
      q:    geoQ,
      opts: geoEmb,
      ok:   ['A','B','C','D'][geoEmb.indexOf(geoOkTexto)],
      fat:  curio,
    },
    hist: {
      q:    histQ,
      opts: histEmb,
      ok:   ['A','B','C','D'][histEmb.indexOf(histOkTexto)],
      fat:  curio,
    },
  };

  PONTOS.push(ponto);
  salvarLS();
  renderizarPainel();
  limparFormulario();
  mensagemForm(`✅ "${nome}" salvo! Total: ${PONTOS.length} ponto(s).`, 'ok');
}

function limparFormulario() {
  ['f-nome','f-geo-q','f-geo-a','f-geo-b','f-geo-c','f-geo-d',
   'f-hist-q','f-hist-a','f-hist-b','f-hist-c','f-hist-d',
   'f-curiosidade','f-lat','f-lon'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  // Limpa radios
  document.querySelectorAll('input[name="geo-correta"], input[name="hist-correta"]')
    .forEach(r => r.checked = false);

  document.getElementById('prev-lat').textContent    = '–';
  document.getElementById('prev-lon').textContent    = '–';
  document.getElementById('prev-regiao').textContent = '–';
  document.getElementById('marcador-edicao').classList.remove('visivel');
  J.profLat = null;
  J.profLon = null;
}

function mensagemForm(txt, tipo) {
  const el = document.getElementById('form-mensagem');
  el.textContent = txt;
  el.className   = `form-mensagem ${tipo}`;
}

function deletarPonto(id) {
  PONTOS = PONTOS.filter(p => p.id !== id);
  salvarLS();
  renderizarPainel();
}

function limparTudo() {
  if (!PONTOS.length) { alert('Nenhum ponto para limpar.'); return; }
  if (confirm(`Apagar todos os ${PONTOS.length} pontos? Esta ação não pode ser desfeita.`)) {
    PONTOS = [];
    salvarLS();
    renderizarPainel();
  }
}

function carregarNoFormulario(p) {
  J.profLat = p.lat;
  J.profLon = p.lon;
  const regiao = detectarRegiao(p.lat, p.lon);
  document.getElementById('prev-lat').textContent    = formatLat(p.lat);
  document.getElementById('prev-lon').textContent    = formatLon(p.lon);
  document.getElementById('prev-regiao').textContent = regiao.label;
  document.getElementById('f-nome').value = p.nome;

  // Carrega opções geo — mantém a ordem salva (A/B/C/D do professor)
  const letras = ['A','B','C','D'];
  const geoFields  = ['f-geo-a','f-geo-b','f-geo-c','f-geo-d'];
  const histFields = ['f-hist-a','f-hist-b','f-hist-c','f-hist-d'];

  // Geo: descobre qual índice é o correto e restaura nessa posição
  p.geo.opts.forEach((opt, i) => { document.getElementById(geoFields[i]).value = opt; });
  const geoOkIdx  = letras.indexOf(p.geo.ok);
  const geoRadios = ['geo-ok-a','geo-ok-b','geo-ok-c','geo-ok-d'];
  document.getElementById(geoRadios[geoOkIdx]).checked = true;

  document.getElementById('f-geo-q').value = p.geo.q;

  // Hist
  p.hist.opts.forEach((opt, i) => { document.getElementById(histFields[i]).value = opt; });
  const histOkIdx  = letras.indexOf(p.hist.ok);
  const histRadios = ['hist-ok-a','hist-ok-b','hist-ok-c','hist-ok-d'];
  document.getElementById(histRadios[histOkIdx]).checked = true;

  document.getElementById('f-hist-q').value = p.hist.q;
  document.getElementById('f-curiosidade').value = p.geo.fat || '';

  const { x, y } = paraPorcentagem(p.lat, p.lon);
  const mk = document.getElementById('marcador-edicao');
  mk.style.left = `${x}%`;
  mk.style.top  = `${y}%`;
  mk.classList.add('visivel');
  document.getElementById('marcador-texto').textContent = p.nome;
  mensagemForm(`"${p.nome}" carregado. Edite e salve novamente para atualizar.`, 'ok');
}

function renderizarPainel() {
  document.getElementById('badge-contagem').textContent = `${PONTOS.length} ponto(s)`;

  // Pins no mapa
  const camada = document.getElementById('camada-pins');
  camada.innerHTML = '';
  PONTOS.forEach(p => {
    const { x, y } = paraPorcentagem(p.lat, p.lon);
    const pin = document.createElement('div');
    pin.className   = 'pin-salvo';
    pin.style.left  = `${x}%`;
    pin.style.top   = `${y}%`;
    pin.innerHTML   = `<div class="pin-ponto"></div><div class="pin-tooltip">${esc(p.nome)}</div>`;
    pin.onclick = e => { e.stopPropagation(); carregarNoFormulario(p); };
    camada.appendChild(pin);
  });

  // Lista
  const lista = document.getElementById('lista-pontos');
  if (!PONTOS.length) {
    lista.innerHTML = '<p class="msg-vazia">Nenhum ponto ainda. Clique no mapa para começar.</p>';
    return;
  }
  lista.innerHTML = PONTOS.map(p => `
    <div class="ponto-linha" onclick="carregarNoFormulario(${htmlAttr(p)})">
      <span class="ponto-coords">${formatLat(p.lat)}, ${formatLon(p.lon)}</span>
      <span class="ponto-nome">${esc(p.nome)}</span>
      <span class="ponto-del" onclick="event.stopPropagation();deletarPonto(${p.id})">✖</span>
    </div>`).join('');
}

/* ----------------------------------------------------------------
   BACKUP
---------------------------------------------------------------- */
function mostrarBackup() { mostrarTela('tela-backup'); }

function renderizarInfoBackup() {
  document.getElementById('backup-stats').textContent = PONTOS.length > 0
    ? `Você tem ${PONTOS.length} ponto(s) salvos prontos para backup.`
    : 'Você ainda não tem pontos salvos para fazer backup.';
}

function baixarBackup() {
  if (!PONTOS.length) { alert('Nenhum ponto para salvar. Crie pontos no Painel do Professor primeiro.'); return; }
  const blob = new Blob([JSON.stringify(PONTOS, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'geo-historia-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

function restaurarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const dados = JSON.parse(e.target.result);
      if (!Array.isArray(dados)) throw new Error('Formato inválido');
      const validos = dados.filter(d => d.lat !== undefined && d.geo && d.hist);
      PONTOS = [...PONTOS, ...validos];
      salvarLS();
      renderizarPainel();
      alert(`✅ ${validos.length} ponto(s) restaurados! Total agora: ${PONTOS.length}.`);
    } catch {
      alert('Erro ao restaurar: o arquivo selecionado não é um backup válido do Geo-História.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ----------------------------------------------------------------
   JOGO — INICIAR
---------------------------------------------------------------- */
function iniciarJogo() {
  const n = limitar(parseInt(document.getElementById('cfg-jogadores').value) || 2, 1, 20);
  J.totalRodadas = limitar(parseInt(document.getElementById('cfg-rodadas').value) || 10, 1, 20);

  J.jogadores = [];
  for (let i = 1; i <= n; i++) {
    const el = document.getElementById(`pn${i}`);
    J.jogadores.push({ id: `P${i}`, nome: el?.value.trim() || `Jogador ${i}`, pontos: 0 });
  }

  J.idx = 0; J.rodada = 1; J.fase = 'aguardando';
  J.usadas = {}; J.ativo = true;
  J.filaPontos = PONTOS.length > 0 ? embaralhar([...PONTOS]) : [];

  mostrarTela('tela-jogo');
  document.getElementById('tot-rodada').textContent = `/${J.totalRodadas}`;

  // Reseta painel do quiz
  quizAguardando();
  esconderMarcador();
  renderizarPlacar();
  renderizarPontos();
  atualizarBarra();

  setTimeout(iniciarTurno, 600);
}

function reiniciarJogo() { iniciarJogo(); }

/* ----------------------------------------------------------------
   TURNOS
---------------------------------------------------------------- */
function iniciarTurno() {
  if (J.rodada > J.totalRodadas) { fimDeJogo(); return; }

  setFase('geo');
  atualizarBarra();
  quizAguardando();

  let lat, lon, geoOverride = null, histOverride = null, regiaoOverride = null;

  if (J.filaPontos.length > 0) {
    const idx = ((J.rodada - 1) * J.jogadores.length + J.idx) % J.filaPontos.length;
    const p   = J.filaPontos[idx];
    lat = p.lat; lon = p.lon;
    regiaoOverride = { id: `prof_${p.id}`, label: p.nome };
    geoOverride    = { q: p.geo.q,  opts: p.geo.opts,  ok: p.geo.ok,  fat: p.geo.fat };
    histOverride   = { q: p.hist.q, opts: p.hist.opts, ok: p.hist.ok, fat: p.hist.fat };
  } else {
    const c = coordAleatoria();
    lat = c.lat;
    lon = c.lon;
  }

  J.lat    = lat;
  J.lon    = lon;
  J.regiao = regiaoOverride || detectarRegiao(lat, lon);
  J.histOverride = histOverride;

  posicionarMarcador(lat, lon);

  // ── COUNTDOWN: jogador observa o mapa antes do quiz ──
  iniciarCountdown(5, () => {
    const q = geoOverride || construirQuizGeo(lat, lon, J.regiao.label);
    J.questaoAtual = q;
    mostrarQuiz(q, 'geo', resultadoGeo);
  });
}

function iniciarCountdown(segundos, callback) {
  const aviso     = document.getElementById('aviso-observar');
  const countdown = document.getElementById('aviso-countdown');
  let restam      = segundos;

  aviso.classList.add('visivel');
  countdown.textContent = restam;

  if (J.timerCountdown) clearInterval(J.timerCountdown);
  J.timerCountdown = setInterval(() => {
    restam--;
    countdown.textContent = restam;
    if (restam <= 0) {
      clearInterval(J.timerCountdown);
      J.timerCountdown = null;
      aviso.classList.remove('visivel');
      callback();
    }
  }, 1000);
}

function resultadoGeo(correto) {
  const jp = J.jogadores[J.idx];
  if (correto) { jp.pontos += 50; renderizarPlacar(); }
  const resp = J.questaoAtual.opts[['A','B','C','D'].indexOf(J.questaoAtual.ok)];
  mostrarFeedback(correto, correto ? `+50 pts — ${jp.nome}` : 'Incorreto', correto ? `Total: ${jp.pontos} pts` : `Resposta: ${resp}`);
  setTimeout(perguntarHistorica, 2400);
}

function perguntarHistorica() {
  setFase('hist');
  const q = J.histOverride || sortearPergunta(J.regiao.id);
  J.histOverride = null;
  J.questaoAtual = q;
  mostrarQuiz(q, 'hist', resultadoHist);
}

function resultadoHist(correto) {
  const jp = J.jogadores[J.idx];
  if (correto) { jp.pontos += 50; renderizarPlacar(); }
  const resp = J.questaoAtual.opts[['A','B','C','D'].indexOf(J.questaoAtual.ok)];
  mostrarFeedback(correto, correto ? `+50 pts — ${jp.nome}` : 'Incorreto', correto ? `Total: ${jp.pontos} pts` : `Resposta: ${resp}`);
  J.questaoAtual = null;
  setTimeout(avancarTurno, 2400);
}

function avancarTurno() {
  J.idx++;
  if (J.idx >= J.jogadores.length) { J.idx = 0; J.rodada++; }
  if (J.rodada > J.totalRodadas)   { fimDeJogo(); return; }
  setFase('aguardando');
  atualizarBarra();
  quizAguardando();
  setTimeout(iniciarTurno, 500);
}

/* ----------------------------------------------------------------
   FIM DE JOGO
---------------------------------------------------------------- */
function fimDeJogo() {
  setFase('fim');
  J.ativo = false;
  const ordenados = [...J.jogadores].sort((a, b) => b.pontos - a.pontos);
  const medalhas  = ['🥇','🥈','🥉'];
  document.getElementById('ranking-final').innerHTML = ordenados.map((p, i) => `
    <div class="ranking-linha ${i === 0 ? 'ouro' : ''}">
      <span class="ranking-medalha">${medalhas[i] || ''}</span>
      <span class="ranking-pos">${i + 1}º</span>
      <span class="ranking-nome">${esc(p.id)} · ${esc(p.nome)}</span>
      <span class="ranking-pontos">${p.pontos} pts</span>
    </div>`).join('');
  setTimeout(() => mostrarTela('tela-fim'), 600);
}

/* ----------------------------------------------------------------
   QUIZ NO PAINEL LATERAL
---------------------------------------------------------------- */
function mostrarQuiz(q, tipo, callback) {
  // Oculta estado de espera
  document.getElementById('quiz-aguardando').style.display = 'none';

  // Badge de tipo
  const badge = document.getElementById('quiz-tipo-badge');
  badge.textContent  = tipo === 'geo' ? '📍 Quiz Geográfico' : '🏛 Quiz Histórico';
  badge.className    = `quiz-tipo-badge ${tipo}`;

  document.getElementById('quiz-jogador-nome').textContent = `Vez de ${J.jogadores[J.idx]?.nome || '–'}`;

  // Enunciado
  const enunciado = document.getElementById('quiz-enunciado');
  enunciado.innerHTML = esc(q.q).replace(/\n/g, '<br>');
  enunciado.style.display = 'block';

  // Opções
  const letras  = ['A','B','C','D'];
  const opcoeEl = document.getElementById('quiz-opcoes');
  opcoeEl.style.display = 'flex';
  opcoeEl.innerHTML = q.opts.map((opt, i) => `
    <button class="opcao-btn" data-letra="${letras[i]}" onclick="escolherOpcao('${letras[i]}',this)">
      <span class="opcao-letra">${letras[i]})</span>${esc(opt)}
    </button>`).join('');

  // Limpa resultado e curiosidade
  const res = document.getElementById('quiz-resultado');
  res.className = 'quiz-resultado';
  res.textContent = '';

  const curio = document.getElementById('quiz-curiosidade');
  curio.className = 'quiz-curiosidade';
  curio.textContent = '';

  window._qCb      = callback;
  window._qCorreta = q.ok;
  window._qFat     = q.fat || '';
  window._qFeito   = false;
}

function escolherOpcao(letra, btn) {
  if (window._qFeito) return;
  window._qFeito = true;

  const correta = window._qCorreta;
  const letras  = ['A','B','C','D'];

  document.querySelectorAll('.opcao-btn').forEach((b, i) => {
    b.classList.add('desabilitada');
    if (letras[i] === correta)    b.classList.add('correta');
    else if (b === btn)           b.classList.add('errada');
  });

  const acertou = letra === correta;

  // Resultado no painel
  const res = document.getElementById('quiz-resultado');
  res.textContent = acertou ? '✅ Correto! +50 pontos' : '❌ Resposta errada';
  res.className   = `quiz-resultado visivel ${acertou ? 'resultado-ok' : 'resultado-err'}`;

  // Curiosidade
  if (window._qFat) {
    const curio = document.getElementById('quiz-curiosidade');
    curio.textContent = `💡 ${window._qFat}`;
    curio.className   = 'quiz-curiosidade visivel';
  }

  setTimeout(() => {
    if (window._qCb) window._qCb(acertou);
  }, 1200);
}

function quizAguardando() {
  document.getElementById('quiz-aguardando').style.display = 'flex';
  document.getElementById('quiz-enunciado').style.display  = 'none';
  document.getElementById('quiz-opcoes').style.display     = 'none';
  document.getElementById('quiz-resultado').className      = 'quiz-resultado';
  document.getElementById('quiz-resultado').textContent    = '';
  document.getElementById('quiz-curiosidade').className    = 'quiz-curiosidade';
  document.getElementById('quiz-curiosidade').textContent  = '';
  document.getElementById('quiz-tipo-badge').textContent   = '📍 Quiz Geográfico';
  document.getElementById('quiz-tipo-badge').className     = 'quiz-tipo-badge geo';
  document.getElementById('quiz-jogador-nome').textContent = '';
}

/* ----------------------------------------------------------------
   FEEDBACK FLUTUANTE
---------------------------------------------------------------- */
function mostrarFeedback(acertou, titulo, corpo, ms = 2200) {
  const wrap  = document.getElementById('feedback-flutuante');
  const card  = document.getElementById('feedback-card');
  document.getElementById('feedback-icone').textContent = acertou ? '✅' : '❌';
  document.getElementById('feedback-titulo').textContent = titulo;
  document.getElementById('feedback-titulo').style.color = acertou ? 'var(--verde)' : 'var(--vermelho)';
  document.getElementById('feedback-corpo').textContent  = corpo;
  card.className = `feedback-card ${acertou ? 'acerto' : 'erro'}`;
  wrap.classList.add('visivel');
  setTimeout(() => wrap.classList.remove('visivel'), ms);
}

/* ----------------------------------------------------------------
   MARCADOR DO JOGO NO MAPA
---------------------------------------------------------------- */
function posicionarMarcador(lat, lon) {
  const { x, y } = paraPorcentagem(lat, lon);
  const m = document.getElementById('marcador-jogo');
  m.style.left = `${x}%`;
  m.style.top  = `${y}%`;
  m.classList.add('visivel');
  document.getElementById('marcador-etiqueta').textContent = J.jogadores[J.idx]?.id || '';
}

function esconderMarcador() {
  document.getElementById('marcador-jogo').classList.remove('visivel');
}

/* ----------------------------------------------------------------
   UI DO JOGO
---------------------------------------------------------------- */
function renderizarPlacar() {
  document.getElementById('placar-barra').innerHTML = J.jogadores.map((p, i) => `
    <div class="chip-jogador ${i === J.idx ? 'ativo' : ''}">
      <span class="chip-id">${p.id}</span>
      <span class="chip-nome">${esc(p.nome)}</span>
      <span class="chip-pontos">${p.pontos}</span>
    </div>`).join('');
}

function renderizarPontos() {
  document.getElementById('pontos-rodada').innerHTML = Array.from({ length: J.totalRodadas }, (_, i) => {
    const cls = i + 1 < J.rodada ? 'feito' : i + 1 === J.rodada ? 'atual' : '';
    return `<div class="ponto-rodada ${cls}"></div>`;
  }).join('');
}

function atualizarBarra() {
  document.getElementById('num-rodada').textContent  = J.rodada;
  document.getElementById('vez-jogador').textContent = J.jogadores[J.idx]?.nome || '–';
  renderizarPontos();
  renderizarPlacar();
}

function setFase(f) {
  J.fase = f;
  const el  = document.getElementById('badge-fase');
  const map = { aguardando:'AGUARDANDO', geo:'QUIZ GEO', hist:'QUIZ HIST.', fim:'FIM' };
  el.className   = `badge-fase ${f}`;
  el.textContent = map[f] || f;
}

/* ----------------------------------------------------------------
   BANCO DE PERGUNTAS
---------------------------------------------------------------- */
function sortearPergunta(idRegiao) {
  const pool = BANCO[idRegiao] || BANCO[idRegiao?.replace(/_[^_]+$/, '')] || BANCO.oceano;
  if (!J.usadas[idRegiao]) J.usadas[idRegiao] = new Set();
  const usadas = J.usadas[idRegiao];
  if (usadas.size >= pool.length) usadas.clear();
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); } while (usadas.has(idx));
  usadas.add(idx);
  const q = pool[idx];
  return { q: q.q, opts: q.opts, ok: q.ok, fat: q.fat };
}

function construirQuizGeo(lat, lon, labelRegiao) {
  const fL = formatLat, fO = formatLon;
  const certa = `Lat: ${fL(lat)}, Lon: ${fO(lon)}`;
  const erradas = [
    `Lat: ${fL(limitar(lat + 20, -80, 80))}, Lon: ${fO(limitar(lon + 30, -170, 170))}`,
    `Lat: ${fL(limitar(lat - 20, -80, 80))}, Lon: ${fO(limitar(lon - 30, -170, 170))}`,
    `Lat: ${fL(limitar(lat + 10, -80, 80))}, Lon: ${fO(limitar(lon - 20, -170, 170))}`,
  ];
  const opts = embaralhar([certa, ...erradas]);
  return {
    q:   `Qual é a Latitude e Longitude do marcador no mapa?\nRegião: ${labelRegiao}`,
    opts,
    ok:  ['A','B','C','D'][opts.indexOf(certa)],
    fat: `A posição é Lat ${fL(lat)}, Lon ${fO(lon)} — ${labelRegiao}.`,
  };
}

function coordAleatoria() {
  const lats = [-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
  return {
    lat: lats[Math.floor(Math.random() * lats.length)],
    lon: limitar(Math.round((Math.random() * 340 - 170) / 10) * 10, -170, 170),
  };
}

/* ----------------------------------------------------------------
   UTILITÁRIOS
---------------------------------------------------------------- */
function limitar(v, min, max) { return Math.max(min, Math.min(max, v)); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function embaralhar(a) { return [...a].sort(() => Math.random() - 0.5); }
function formatLat(v) { return `${Math.abs(v)}°${v >= 0 ? 'N' : 'S'}`; }
function formatLon(v) { return `${Math.abs(v)}°${v >= 0 ? 'L' : 'O'}`; }
function htmlAttr(obj) { return JSON.stringify(obj).replace(/"/g, '&quot;'); }

/* ----------------------------------------------------------------
   INIT
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  mostrarTela('tela-menu');
});
