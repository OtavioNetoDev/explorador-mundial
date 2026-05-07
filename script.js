/* ══════════════════════════════════════════════════
   GEO-HISTÓRIA v3 · game.js
   - Modo Professor: clique no mapa + formulário
   - Perguntas salvas em localStorage
   - Quiz de 4 opções geograficamente fiel
   - Banco interno com perguntas por coordenada estrita
══════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────────
   CALIBRAÇÃO DO MAPA (imagem 1656 × 950 px)
   Área útil (excluindo bordas de label):
     left=55  right=1636  top=15  bottom=930
───────────────────────────────────────────────── */
const MAP_CAL = { imgW:1656, imgH:950, left:55, right:1636, top:15, bottom:930 };
MAP_CAL.mW = MAP_CAL.right - MAP_CAL.left;   // 1581
MAP_CAL.mH = MAP_CAL.bottom - MAP_CAL.top;   // 915

/** Converte lat/lon para % do contêiner da imagem */
function toPercent(lat, lon) {
  const px = MAP_CAL.left + (lon + 180) * (MAP_CAL.mW / 360);
  const py = MAP_CAL.top  + (90 - lat)  * (MAP_CAL.mH / 180);
  return { x: (px / MAP_CAL.imgW) * 100, y: (py / MAP_CAL.imgH) * 100 };
}

/** Converte clique no elemento imagem para lat/lon */
function clickToCoord(event, imgEl) {
  const rect = imgEl.getBoundingClientRect();
  const relX = (event.clientX - rect.left) / rect.width;
  const relY = (event.clientY - rect.top)  / rect.height;
  // Inverte a fórmula de toPercent considerando bordas
  const pxImg = relX * MAP_CAL.imgW;
  const pyImg = relY * MAP_CAL.imgH;
  const lon = ((pxImg - MAP_CAL.left) / MAP_CAL.mW) * 360 - 180;
  const lat =  90 - ((pyImg - MAP_CAL.top)  / MAP_CAL.mH) * 180;
  return {
    lat: Math.round(clamp(lat, -88, 88) / 1) * 1,
    lon: Math.round(clamp(lon, -178, 178) / 1) * 1,
  };
}

/* ─────────────────────────────────────────────────
   DETECÇÃO DE REGIÃO GEOGRÁFICA ESTRITA
   Usa polígonos/retângulos aproximados por país/região
   Cada região tem seu próprio banco de perguntas
   → evita cruzamentos como Grécia/Noruega
───────────────────────────────────────────────── */
const REGIONS = [
  // América do Sul
  { id:'brasil',        label:'Brasil',               latMin:-34, latMax:5,   lonMin:-74, lonMax:-34 },
  { id:'argentina',     label:'Argentina / Chile',    latMin:-56, latMax:-22, lonMin:-74, lonMax:-52 },
  { id:'peru_bolivia',  label:'Peru / Bolívia',        latMin:-23, latMax:0,   lonMin:-82, lonMax:-65 },
  { id:'colombia',      label:'Colômbia / Venezuela',  latMin:0,   latMax:13,  lonMin:-76, lonMax:-60 },
  { id:'am_sul',        label:'América do Sul',        latMin:-56, latMax:13,  lonMin:-82, lonMax:-34 },

  // América do Norte
  { id:'mexico',        label:'México',                latMin:14,  latMax:32,  lonMin:-120,lonMax:-86 },
  { id:'eua',           label:'Estados Unidos',        latMin:25,  latMax:50,  lonMin:-125,lonMax:-65 },
  { id:'canada',        label:'Canadá',                latMin:49,  latMax:72,  lonMin:-142,lonMax:-52 },
  { id:'am_norte',      label:'América do Norte',      latMin:14,  latMax:72,  lonMin:-170,lonMax:-52 },

  // Europa (subdivisões)
  { id:'portugal',      label:'Portugal',              latMin:37,  latMax:42,  lonMin:-10, lonMax:-6  },
  { id:'espanha',       label:'Espanha',               latMin:36,  latMax:44,  lonMin:-9,  lonMax:4   },
  { id:'franca',        label:'França',                latMin:42,  latMax:51,  lonMin:-5,  lonMax:9   },
  { id:'italia',        label:'Itália',                latMin:37,  latMax:47,  lonMin:7,   lonMax:18  },
  { id:'alemanha',      label:'Alemanha / Áustria',    latMin:47,  latMax:55,  lonMin:6,   lonMax:18  },
  { id:'grecia',        label:'Grécia',                latMin:35,  latMax:42,  lonMin:20,  lonMax:28  },
  { id:'escandinavia',  label:'Escandinávia',          latMin:55,  latMax:72,  lonMin:4,   lonMax:32  },
  { id:'russia_europa', label:'Rússia (Europa)',        latMin:50,  latMax:70,  lonMin:28,  lonMax:60  },
  { id:'europa',        label:'Europa',                latMin:35,  latMax:72,  lonMin:-12, lonMax:45  },

  // África (subdivisões)
  { id:'africa_norte',  label:'Norte da África',       latMin:15,  latMax:38,  lonMin:-6,  lonMax:37  },
  { id:'africa_sul',    label:'África do Sul',         latMin:-36, latMax:-22, lonMin:16,  lonMax:36  },
  { id:'africa_leste',  label:'Leste da África',       latMin:-12, latMax:15,  lonMin:30,  lonMax:52  },
  { id:'africa_oeste',  label:'África Ocidental',      latMin:4,   latMax:20,  lonMin:-18, lonMax:15  },
  { id:'africa',        label:'África',                latMin:-36, latMax:38,  lonMin:-18, lonMax:52  },

  // Oriente Médio / Ásia
  { id:'or_medio',      label:'Oriente Médio',         latMin:12,  latMax:42,  lonMin:34,  lonMax:62  },
  { id:'india',         label:'Índia',                 latMin:6,   latMax:36,  lonMin:66,  lonMax:92  },
  { id:'china',         label:'China',                 latMin:18,  latMax:55,  lonMin:98,  lonMax:135 },
  { id:'japao',         label:'Japão',                 latMin:30,  latMax:46,  lonMin:129, lonMax:146 },
  { id:'russia_asia',   label:'Rússia / Sibéria',      latMin:50,  latMax:78,  lonMin:60,  lonMax:180 },
  { id:'asia_se',       label:'Sudeste Asiático',      latMin:-10, latMax:22,  lonMin:94,  lonMax:142 },
  { id:'asia',          label:'Ásia',                  latMin:-10, latMax:78,  lonMin:26,  lonMax:180 },

  // Oceania
  { id:'australia',     label:'Austrália',             latMin:-44, latMax:-10, lonMin:112, lonMax:154 },
  { id:'oceania',       label:'Oceania',               latMin:-50, latMax:-10, lonMin:110, lonMax:180 },

  // Polar
  { id:'artico',        label:'Ártico',                latMin:66,  latMax:90,  lonMin:-180,lonMax:180 },
  { id:'antartica',     label:'Antártida',             latMin:-90, latMax:-60, lonMin:-180,lonMax:180 },

  // Oceanos (fallback)
  { id:'oceano_atl',    label:'Oceano Atlântico',      latMin:-60, latMax:66,  lonMin:-60, lonMax:-20 },
  { id:'oceano_pac',    label:'Oceano Pacífico',       latMin:-60, latMax:66,  lonMin:140, lonMax:180 },
  { id:'oceano',        label:'Oceano',                latMin:-90, latMax:90,  lonMin:-180,lonMax:180 },
];

function detectRegion(lat, lon) {
  // Percorre do mais específico ao mais genérico
  for (const r of REGIONS) {
    if (lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax) {
      return r;
    }
  }
  return { id:'oceano', label:'Oceano' };
}

/* ─────────────────────────────────────────────────
   BANCO DE PERGUNTAS INTERNO
   Cada banco é indexado pelo id da região
   Formato: { q, options:[A,B,C,D], answer:"A"|"B"|"C"|"D", fact }
   IMPORTANTE: perguntas são geradas apenas para
   a região onde o jogador está — sem cruzamentos.
───────────────────────────────────────────────── */
const QB = {

  brasil: [
    { q:"Qual é a capital do Brasil?", options:["São Paulo","Rio de Janeiro","Brasília","Manaus"], answer:"C", fact:"Brasília foi inaugurada em 1960 e tem forma de avião vista do alto." },
    { q:"Em que ano o Brasil foi 'descoberto' pelos portugueses?", options:["1492","1500","1510","1488"], answer:"B", fact:"Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500." },
    { q:"Qual é o maior bioma do Brasil?", options:["Cerrado","Mata Atlântica","Caatinga","Amazônia"], answer:"D", fact:"A Amazônia cobre mais de 4 milhões de km² e abriga 10% de todas as espécies do planeta." },
    { q:"Em que ano o Brasil declarou independência de Portugal?", options:["1808","1815","1822","1889"], answer:"C", fact:"D. Pedro I proclamou a independência às margens do Rio Ipiranga em 7 de setembro de 1822." },
    { q:"Qual é o estado brasileiro de maior extensão?", options:["Pará","Mato Grosso","Minas Gerais","Amazonas"], answer:"D", fact:"O Amazonas tem 1,5 milhão de km² — maior que muitos países europeus juntos." },
    { q:"Qual ciclo econômico predominou no Brasil colonial?", options:["Ouro","Cana-de-açúcar","Café","Borracha"], answer:"B", fact:"O ciclo do açúcar foi o primeiro grande ciclo econômico do Brasil colonial, do séc. XVI ao XVII." },
    { q:"Qual tratado dividiu as possessões entre Portugal e Espanha em 1494?", options:["Tordesilhas","Alcáçovas","Madrid","Utrecht"], answer:"A", fact:"A linha de Tordesilhas foi traçada a 370 léguas a oeste das Ilhas de Cabo Verde." },
    { q:"Qual é o ponto mais alto do Brasil?", options:["Pico do Itambé","Agulhas Negras","Pico da Neblina","Serra da Canastra"], answer:"C", fact:"O Pico da Neblina tem 2.994 m e fica na Amazônia, na fronteira com a Venezuela." },
    { q:"Em que ano foi proclamada a República no Brasil?", options:["1888","1889","1891","1894"], answer:"B", fact:"A Proclamação da República ocorreu em 15 de novembro de 1889, liderada pelo Marechal Deodoro." },
    { q:"Qual cidade foi capital do Brasil antes de Brasília?", options:["Salvador","São Paulo","Ouro Preto","Rio de Janeiro"], answer:"D", fact:"O Rio de Janeiro foi capital por 197 anos, de 1763 a 1960." },
  ],

  argentina: [
    { q:"Qual é a capital da Argentina?", options:["Córdoba","Rosário","Mendoza","Buenos Aires"], answer:"D", fact:"Buenos Aires significa 'bons ventos' e foi fundada definitivamente em 1580." },
    { q:"Qual é o ponto mais alto das Américas, localizado na Argentina?", options:["Monte Roraima","Pico da Neblina","Aconcágua","Fitz Roy"], answer:"C", fact:"O Aconcágua tem 6.961m e é o pico mais alto fora da Ásia." },
    { q:"Qual guerra travou Argentina e Reino Unido em 1982?", options:["Guerra do Chaco","Guerra das Malvinas","Guerra do Paraguai","Guerra da Cisplatina"], answer:"B", fact:"A Guerra das Malvinas durou 74 dias e terminou com a vitória britânica." },
    { q:"Qual grande rio banha a região do Rio da Prata?", options:["Amazonas","Paraná","São Francisco","Orinoco"], answer:"B", fact:"O Paraná tem 4.880 km de extensão e é o segundo maior rio da América do Sul." },
  ],

  peru_bolivia: [
    { q:"Qual civilização construiu Machu Picchu?", options:["Maia","Asteca","Inca","Chavin"], answer:"C", fact:"Machu Picchu foi construída no século XV e nunca foi encontrada pelos conquistadores espanhóis." },
    { q:"Qual é o lago mais alto e navegável do mundo?", options:["Lago Poopó","Lago Titicaca","Lago Maracaibo","Lago Izabal"], answer:"B", fact:"O Lago Titicaca está a 3.812m de altitude, na fronteira entre Peru e Bolívia." },
    { q:"Qual é o deserto mais seco do mundo?", options:["Gobi","Saara","Atacama","Namibe"], answer:"C", fact:"Em partes do Atacama, não há chuva registrada nos últimos 400 anos." },
    { q:"Por que a Bolívia é especial geograficamente?", options:["É um país insular","É o país mais populoso","Não tem saída para o mar","Tem dois fusos horários"], answer:"C", fact:"A Bolívia perdeu o acesso ao mar para o Chile na Guerra do Pacífico (1879-1884)." },
  ],

  colombia: [
    { q:"Quem foi Simón Bolívar?", options:["Conquistador espanhol","Libertador da América do Sul","Imperador do Brasil","Rei da Colômbia"], answer:"B", fact:"Bolívar libertou Venezuela, Colômbia, Equador, Peru e Bolívia, que leva seu nome." },
    { q:"Qual é a capital da Colômbia?", options:["Medellín","Cali","Cartagena","Bogotá"], answer:"D", fact:"Bogotá está a 2.600m de altitude e é uma das capitais mais altas do mundo." },
    { q:"Qual produto agrícola tornou a Colômbia famosa mundialmente?", options:["Cacau","Açúcar","Café","Banana"], answer:"C", fact:"A Colômbia é o terceiro maior produtor de café do mundo, atrás de Brasil e Vietnã." },
  ],

  am_sul: [
    { q:"Qual é a guerra que envolveu Argentina, Brasil, Uruguai e Paraguai (1864–1870)?", options:["Guerra do Chaco","Guerra da Cisplatina","Guerra do Paraguai","Guerra do Pacífico"], answer:"C", fact:"O Paraguai perdeu mais de metade de sua população nesta guerra." },
    { q:"Qual é a cordilheira mais longa do mundo?", options:["Himalaia","Alpes","Andes","Rocky Mountains"], answer:"C", fact:"Os Andes têm 7.200 km de comprimento e mais de 100 vulcões ativos." },
    { q:"Qual é a capital mais alta do mundo?", options:["Quito","Bogotá","La Paz","Adis Abeba"], answer:"C", fact:"La Paz fica a 3.640m de altitude na Bolívia." },
  ],

  mexico: [
    { q:"Qual civilização foi conquistada pelos espanhóis no México em 1521?", options:["Inca","Maia","Olmeca","Asteca"], answer:"D", fact:"Hernán Cortés destruiu Tenochtitlán, capital asteca, onde hoje está a Cidade do México." },
    { q:"Qual é a capital do México?", options:["Guadalajara","Monterrey","Tijuana","Cidade do México"], answer:"D", fact:"A Cidade do México foi construída sobre as ruínas da antiga Tenochtitlán." },
    { q:"Qual rio forma grande parte da fronteira entre México e EUA?", options:["Rio Colorado","Rio Pecos","Rio Grande","Rio Conchos"], answer:"C", fact:"O Rio Grande / Rio Bravo tem 3.000 km de comprimento e separa os dois países por mais de 2.000 km." },
  ],

  eua: [
    { q:"Em que ano os EUA declararam independência?", options:["1763","1775","1776","1783"], answer:"C", fact:"A Declaração de Independência foi redigida principalmente por Thomas Jefferson." },
    { q:"Qual evento levou os EUA a entrar na Segunda Guerra Mundial?", options:["Invasão da Polônia","Queda da França","Ataque a Pearl Harbor","Batalha da Grã-Bretanha"], answer:"C", fact:"O ataque japonês a Pearl Harbor em 7 de dezembro de 1941 destruiu 188 aeronaves americanas." },
    { q:"Qual presidente aboliu a escravidão nos EUA?", options:["George Washington","Thomas Jefferson","Abraham Lincoln","Ulysses Grant"], answer:"C", fact:"A Proclamação de Emancipação de Lincoln em 1863 libertou os escravizados nos estados do Sul." },
    { q:"Qual é o maior estado dos EUA em extensão?", options:["Texas","Califórnia","Montana","Alasca"], answer:"D", fact:"O Alasca foi comprado da Rússia em 1867 por apenas 7,2 milhões de dólares." },
  ],

  canada: [
    { q:"Qual é a capital do Canadá?", options:["Toronto","Vancouver","Montréal","Ottawa"], answer:"D", fact:"Ottawa foi escolhida capital em 1857 pela Rainha Vitória, para mediar rivalidade entre cidades." },
    { q:"Qual característica geográfica torna o Canadá único?", options:["Maior população americana","Maior linha costeira do mundo","Maior floresta tropical","Maior delta fluvial"], answer:"B", fact:"O Canadá tem 202.080 km de linha costeira — a maior do mundo." },
    { q:"Qual foi o papel do Canadá na Segunda Guerra Mundial?", options:["Ficou neutro","Lutou ao lado dos Aliados","Apoiou o Eixo","Declarou guerra ao Japão apenas"], answer:"B", fact:"O Canadá foi fundamental no Dia D (junho de 1944) e enviou mais de 1 milhão de soldados." },
  ],

  am_norte: [
    { q:"Qual é o maior país das Américas em extensão?", options:["EUA","Brasil","México","Canadá"], answer:"D", fact:"O Canadá é o segundo maior país do mundo, com 9,98 milhões de km²." },
    { q:"Qual é o pico mais alto da América do Norte?", options:["Monte Logan","Monte Whitney","Denali","Monte Rainier"], answer:"C", fact:"O Denali, no Alasca, tem 6.190m e é o ponto mais alto da América do Norte." },
  ],

  portugal: [
    { q:"Qual é a capital de Portugal?", options:["Porto","Coimbra","Braga","Lisboa"], answer:"D", fact:"Lisboa é uma das cidades mais antigas da Europa, fundada há mais de 3.000 anos." },
    { q:"Qual explorador português chegou à Índia pelo mar em 1498?", options:["Pedro Álvares Cabral","Bartolomeu Dias","Vasco da Gama","Fernão de Magalhães"], answer:"C", fact:"Vasco da Gama abriu a rota marítima para as Índias, dobrando o Cabo da Boa Esperança." },
    { q:"Que evento devastou Lisboa em 1755?", options:["Erupção vulcânica","Terremoto e maremoto","Guerra civil","Epidemia de peste"], answer:"B", fact:"O terremoto de 1755 matou entre 30.000 e 40.000 pessoas e destruiu 85% dos edifícios de Lisboa." },
  ],

  espanha: [
    { q:"Qual é a capital da Espanha?", options:["Barcelona","Sevilha","Valência","Madri"], answer:"D", fact:"Madri é a capital há mais de 450 anos e abriga o famoso Museu do Prado." },
    { q:"Quem financiou a primeira viagem de Colombo em 1492?", options:["Portugal","França","Inglaterra","Espanha"], answer:"D", fact:"Os Reis Católicos Fernando e Isabel financiaram a viagem de Colombo ao que chamou de 'Índias'." },
    { q:"Que império espanhol foi o maior em extensão territorial?", options:["Napoleônico","Império Colonial Espanhol","Habsburgo","Romano"], answer:"B", fact:"O Império Colonial Espanhol chegou a ter 20 milhões de km², cobrindo grande parte das Américas." },
  ],

  franca: [
    { q:"O que foi a Revolução Francesa de 1789?", options:["Golpe militar","Revolução popular contra a monarquia","Revolução Industrial","Invasão estrangeira"], answer:"B", fact:"A Revolução Francesa aboliu o feudalismo e inspirou movimentos democráticos ao redor do mundo." },
    { q:"Quem foi Napoleão Bonaparte?", options:["Rei da França","Imperador da França","General da Revolução","Presidente da República"], answer:"B", fact:"Napoleão reformou o sistema jurídico, criando o Código Napoleônico, base de muitos sistemas legais atuais." },
    { q:"Qual é a capital da França?", options:["Lyon","Marselha","Bordeaux","Paris"], answer:"D", fact:"Paris é conhecida como a 'Cidade Luz' e recebe mais de 30 milhões de turistas por ano." },
  ],

  italia: [
    { q:"Qual é a capital da Itália?", options:["Milão","Florença","Nápoles","Roma"], answer:"D", fact:"Roma é chamada de 'Cidade Eterna' e foi o centro do maior império da Antiguidade." },
    { q:"Qual civilização dominava a Itália antes da era cristã?", options:["Grega","Fenícia","Romana","Etrusca"], answer:"C", fact:"Roma conquistou quase toda a Europa, Norte da África e Oriente Médio." },
    { q:"O que foi o Renascimento?", options:["Revolução industrial italiana","Movimento cultural de renovação artística e científica","Reforma religiosa","Unificação da Itália"], answer:"B", fact:"O Renascimento italiano (séc. XIV–XVII) produziu Leonardo da Vinci, Michelangelo e Galileu Galilei." },
  ],

  alemanha: [
    { q:"Em que ano caiu o Muro de Berlim?", options:["1985","1987","1989","1991"], answer:"C", fact:"O Muro foi construído em 1961 e durante 28 anos dividiu famílias e a cidade de Berlim." },
    { q:"Qual evento iniciou a Primeira Guerra Mundial em 1914?", options:["Invasão da Bélgica","Assassinato do Arquiduque Franz Ferdinand","Crise do Marrocos","Queda do Império Otomano"], answer:"B", fact:"O assassinato em Sarajevo em 28 de junho de 1914 desencadeou um conflito que matou 20 milhões de pessoas." },
    { q:"Qual é a capital da Alemanha?", options:["Munique","Hamburgo","Frankfurt","Berlim"], answer:"D", fact:"Berlim é a maior cidade da Alemanha e voltou a ser capital após a reunificação em 1990." },
  ],

  grecia: [
    { q:"Qual filósofo ateniense foi condenado à morte por envenenamento com cicuta?", options:["Platão","Aristóteles","Tales","Sócrates"], answer:"D", fact:"Sócrates nunca escreveu nada — seu pensamento é conhecido pelos diálogos de seu discípulo Platão." },
    { q:"Onde ocorreram os primeiros Jogos Olímpicos da história?", options:["Atenas","Esparta","Olímpia","Corinto"], answer:"C", fact:"Os Jogos Olímpicos da Antiguidade ocorriam em Olímpia desde 776 a.C. em honra a Zeus." },
    { q:"O que foi a Democracia Ateniense?", options:["Governo de um rei","Sistema de governo participativo na Grécia antiga","Governo de generais","República romana"], answer:"B", fact:"Atenas foi a primeira cidade a desenvolver a democracia, embora apenas homens livres pudessem votar." },
    { q:"Qual guerra ocorreu entre gregos e persas no século V a.C.?", options:["Guerra do Peloponeso","Guerras Médicas","Guerra de Tróia","Guerra da Macedônia"], answer:"B", fact:"Na Batalha de Salamina (480 a.C.), a frota grega derrotou a poderosa armada persa de Xerxes." },
  ],

  escandinavia: [
    { q:"Quem foram os Vikings?", options:["Guerreiros romanos do norte","Navegadores e guerreiros escandinavos medievais","Tribos celtas","Comerciantes bizantinos"], answer:"B", fact:"Os Vikings chegaram à América do Norte (Vinlândia) cerca de 500 anos antes de Colombo." },
    { q:"Qual país escandinavo foi o primeiro a conceder direito de voto às mulheres?", options:["Suécia","Dinamarca","Finlândia","Noruega"], answer:"D", fact:"A Noruega concedeu voto às mulheres em 1913, sendo um dos primeiros países do mundo." },
    { q:"O que é o Fiorde?", options:["Montanha vulcânica","Vale submerso pelo mar","Planície de gelo","Floresta boreal"], answer:"B", fact:"Os fiordes noruegueses foram esculpidos por geleiras durante a última era glacial." },
  ],

  russia_europa: [
    { q:"Qual é a capital da Rússia?", options:["São Petersburgo","Kiev","Moscou","Novosibirsk"], answer:"C", fact:"Moscou abriga o Kremlin e a Praça Vermelha, símbolos do poder russo." },
    { q:"O que foi a Revolução Russa de 1917?", options:["Golpe militar","Revolução que derrubou o Czar e instaurou o comunismo","Guerra civil","Invasão estrangeira"], answer:"B", fact:"A Revolução de Outubro de 1917 levou Lenin e os bolcheviques ao poder, criando a URSS." },
    { q:"Qual é o lago mais profundo do mundo, na Rússia?", options:["Lago Ladoga","Lago Cáspio","Lago Baikal","Lago Onega"], answer:"C", fact:"O Baikal tem 1.642m de profundidade e contém 20% de toda a água doce superficial do mundo." },
  ],

  europa: [
    { q:"Qual é o menor país do mundo, localizado na Europa?", options:["Monaco","San Marino","Liechtenstein","Vaticano"], answer:"D", fact:"O Vaticano tem apenas 0,44 km² e é a sede da Igreja Católica." },
    { q:"Qual país europeu liderou as Grandes Navegações no século XV?", options:["Espanha","Inglaterra","Holanda","Portugal"], answer:"D", fact:"Portugal criou a Escola de Sagres e foi pioneiro nas rotas marítimas para a África e Ásia." },
    { q:"Em que ano terminou a Segunda Guerra Mundial na Europa?", options:["1943","1944","1945","1946"], answer:"C", fact:"A rendição incondicional da Alemanha foi assinada em 8 de maio de 1945 — o Dia da Vitória na Europa." },
    { q:"Qual organização integra economicamente os países europeus?", options:["OTAN","OCDE","União Europeia","Conselho Europeu"], answer:"C", fact:"A União Europeia foi criada pelo Tratado de Maastricht em 1993 e tem 27 países membros." },
  ],

  africa_norte: [
    { q:"Qual é o maior deserto do mundo?", options:["Gobi","Kalahari","Namibe","Saara"], answer:"D", fact:"O Saara tem 9,2 milhões de km², aproximadamente o tamanho dos Estados Unidos." },
    { q:"Qual civilização construiu as pirâmides de Gizé?", options:["Suméria","Fenícia","Egípcia","Núbia"], answer:"C", fact:"A Grande Pirâmide de Gizé foi o edifício mais alto do mundo por 3.800 anos." },
    { q:"Qual é o rio mais longo do mundo?", options:["Amazonas","Congo","Niger","Nilo"], answer:"D", fact:"O Nilo tem 6.650 km e foi a base da civilização egípcia por mais de 5.000 anos." },
    { q:"Qual é a capital do Egito?", options:["Alexandria","Luxor","Assuã","Cairo"], answer:"D", fact:"O Cairo é a maior cidade da África e do mundo árabe, com mais de 20 milhões de habitantes." },
  ],

  africa_sul: [
    { q:"Quem liderou a luta contra o apartheid na África do Sul?", options:["Desmond Tutu","Steve Biko","Nelson Mandela","Thabo Mbeki"], answer:"C", fact:"Mandela ficou 27 anos preso e se tornou o primeiro presidente negro da África do Sul em 1994." },
    { q:"O que foi o apartheid?", options:["Guerra civil","Sistema de segregação racial","Ditadura militar","Movimento de independência"], answer:"B", fact:"O apartheid vigorou de 1948 a 1994 e dividia a sociedade sul-africana por raça." },
    { q:"Qual é o monte mais alto da África?", options:["Monte Quênia","Rwenzori","Kilimanjaro","Ras Dejen"], answer:"C", fact:"O Kilimanjaro tem 5.895m e é um vulcão inativo na Tanzânia. Suas geleiras estão desaparecendo." },
  ],

  africa_leste: [
    { q:"Qual é o maior lago da África?", options:["Tanganica","Malawi","Vitória","Chade"], answer:"C", fact:"O Lago Vitória é o segundo maior lago de água doce do mundo em superfície." },
    { q:"Qual país é considerado o 'berço da humanidade'?", options:["Egito","Etiópia","Tanzânia","Quênia"], answer:"B", fact:"A Etiópia abriga fósseis de hominídeos com mais de 3 milhões de anos, como 'Lucy' (Australopithecus)." },
  ],

  africa_oeste: [
    { q:"Qual empire medieval controlava o comércio de ouro e sal na África Ocidental?", options:["Império Zulu","Império Mali","Império Otomano","Reino do Congo"], answer:"B", fact:"O Império Mali (séc. XIII–XVI) foi um dos maiores impérios da história africana." },
    { q:"Qual é o maior país da África em extensão?", options:["Nigéria","Sudão","Congo","Argélia"], answer:"D", fact:"A Argélia tem 2,38 milhões de km² e é o maior país do continente africano." },
  ],

  africa: [
    { q:"Quem colonizou Angola, Moçambique e Cabo Verde?", options:["Inglaterra","França","Bélgica","Portugal"], answer:"D", fact:"Portugal manteve seu império colonial africano por mais de 500 anos, até 1975." },
    { q:"Quantos países existem na África?", options:["44","54","62","48"], answer:"B", fact:"A África tem 54 países reconhecidos, mais do que qualquer outro continente." },
  ],

  or_medio: [
    { q:"Qual é o principal recurso que torna o Oriente Médio estratégico?", options:["Ouro","Diamantes","Petróleo","Fosfato"], answer:"C", fact:"O Oriente Médio detém cerca de 48% das reservas mundiais de petróleo." },
    { q:"Qual é a cidade sagrada para cristãos, judeus e muçulmanos?", options:["Meca","Medina","Bagdá","Jerusalém"], answer:"D", fact:"Jerusalém é a única cidade do mundo considerada sagrada pelas três religiões abraâmicas." },
    { q:"O que foi a Mesopotâmia?", options:["Região entre o Nilo e o Mar Vermelho","Região entre os rios Tigre e Eufrates","Antiga Pérsia","Região da Anatólia"], answer:"B", fact:"A Mesopotâmia (atual Iraque) é considerada o berço da civilização, com escrita e leis surgindo há 5.000 anos." },
    { q:"Qual império islâmico dominou o Oriente Médio entre os séculos XIV e XX?", options:["Mongol","Persa","Otomano","Abássida"], answer:"C", fact:"O Império Otomano durou 623 anos (1299-1922) e chegou a ter 32 províncias e 5 mares." },
  ],

  india: [
    { q:"Quem foi Mahatma Gandhi?", options:["Rei da Índia","Líder da independência indiana pela não-violência","General britânico","Filósofo budista"], answer:"B", fact:"Gandhi foi assassinado em 30 de janeiro de 1948, apenas 5 meses após a independência da Índia." },
    { q:"Qual rio é o mais sagrado para os hinduístas?", options:["Indo","Brahmaputra","Yamuna","Ganges"], answer:"D", fact:"O Ganges tem 2.525 km e mais de 400 milhões de pessoas dependem de suas águas." },
    { q:"Qual civilização antiga floresceu no Vale do Indo?", options:["Vedica","Drávida","Civilização do Vale do Indo","Ariana"], answer:"C", fact:"A Civilização do Vale do Indo (3300–1300 a.C.) tinha cidades planejadas com esgoto — avançadas para a época." },
    { q:"Em que ano a Índia se tornou independente do domínio britânico?", options:["1945","1947","1950","1952"], answer:"B", fact:"A independência da Índia em 15 de agosto de 1947 foi seguida pela partição e criação do Paquistão." },
  ],

  china: [
    { q:"Qual é a capital da China?", options:["Xangai","Hong Kong","Nanquim","Pequim"], answer:"D", fact:"A Cidade Proibida em Pequim tem 9.999 cômodos — os construtores evitavam 10.000, número divino." },
    { q:"Em que ano a República Popular da China foi fundada?", options:["1945","1947","1949","1952"], answer:"C", fact:"Mao Tsé-Tung proclamou a República Popular da China em 1º de outubro de 1949." },
    { q:"Para que servia a Grande Muralha da China?", options:["Controle de inundações","Fronteira comercial","Proteção contra invasões nômades","Divisão de províncias"], answer:"C", fact:"A Muralha tem mais de 21.000 km e levou séculos para ser construída por várias dinastias." },
    { q:"Qual invenção chinesa transformou a comunicação no mundo?", options:["Bússola","Papel e impressão","Pólvora","Todas as anteriores"], answer:"D", fact:"A China inventou o papel, a impressão, a bússola e a pólvora — quatro das invenções mais impactantes." },
  ],

  japao: [
    { q:"Qual evento marcou o fim da participação do Japão na Segunda Guerra Mundial?", options:["Invasão aliada de Tóquio","Queda de Berlim","Bombardeio atômico de Hiroshima e Nagasaki","Rendição da Alemanha"], answer:"C", fact:"As bombas atômicas foram lançadas em 6 e 9 de agosto de 1945, matando entre 130.000 e 226.000 pessoas." },
    { q:"Qual é a capital do Japão?", options:["Osaka","Quioto","Tóquio","Hiroshima"], answer:"C", fact:"Tóquio é a maior área metropolitana do mundo, com mais de 37 milhões de pessoas." },
    { q:"O que foi o shogunato no Japão?", options:["Sistema de governo imperial","Governo militar liderado por um shogun","Sistema de castas","Governo religioso budista"], answer:"B", fact:"O shogunato durou de 1185 a 1868, quando o Imperador Meiji restaurou o poder imperial." },
  ],

  russia_asia: [
    { q:"Qual é o lago mais profundo do mundo?", options:["Lago Ladoga","Lago Cáspio","Lago Baikal","Mar de Aral"], answer:"C", fact:"O Lago Baikal tem 1.642m de profundidade e é considerado o lago mais antigo do mundo (25 milhões de anos)." },
    { q:"Qual é a ferrovia mais longa do mundo, que cruza a Sibéria?", options:["Ferrovia Pan-Americana","Ferrovia Transiberiana","Ferrovia Transanadina","Ferrovia Oriental"], answer:"B", fact:"A Ferrovia Transiberiana tem 9.288 km e conecta Moscou a Vladivostok, cruzando 8 fusos horários." },
  ],

  asia_se: [
    { q:"Qual templo angkoriano é o maior edifício religioso do mundo?", options:["Templo de Bagan","Templo de Borobudur","Angkor Wat","Templo de Pagan"], answer:"C", fact:"Angkor Wat, no Camboja, foi construído no século XII e cobre 162 hectares." },
    { q:"Qual país do Sudeste Asiático tem o maior número de ilhas do mundo?", options:["Filipinas","Malásia","Tailândia","Indonésia"], answer:"D", fact:"A Indonésia tem mais de 17.000 ilhas e é o maior arquipélago do mundo." },
  ],

  asia: [
    { q:"Qual é o monte mais alto do mundo?", options:["K2","Kangchenjunga","Monte Branco","Everest"], answer:"D", fact:"O Monte Everest tem 8.849m e cresce cerca de 4mm por ano pela tectônica de placas." },
    { q:"Qual é o país mais populoso do mundo?", options:["China","Índia","EUA","Indonésia"], answer:"B", fact:"A Índia ultrapassou a China em 2023 como o país mais populoso do mundo, com 1,4 bilhão de habitantes." },
  ],

  australia: [
    { q:"Qual é a capital da Austrália?", options:["Sydney","Melbourne","Brisbane","Canberra"], answer:"D", fact:"Canberra foi projetada pelo arquiteto americano Walter Burley Griffin após concurso internacional em 1911." },
    { q:"Quem foram os primeiros habitantes da Austrália?", options:["Polinésios","Maoris","Aborígenes","Melanésios"], answer:"C", fact:"Os aborígenes australianos têm a cultura contínua mais antiga do mundo, há pelo menos 65.000 anos." },
    { q:"Qual é o maior recife de corais do mundo?", options:["Recife de Belize","Recife Ningaloo","Grande Barreira de Corais","Recife das Maldivas"], answer:"C", fact:"A Grande Barreira de Corais tem 2.300 km e abriga mais de 1.500 espécies de peixes." },
  ],

  oceania: [
    { q:"Qual explorador europeu mapeou a Oceania no século XVIII?", options:["Vasco da Gama","Fernão de Magalhães","James Cook","Francis Drake"], answer:"C", fact:"James Cook fez três grandes viagens, mapeando a Austrália, Nova Zelândia e ilhas do Pacífico." },
    { q:"Qual país da Oceania foi o primeiro a conceder voto às mulheres (1893)?", options:["Austrália","Samoa","Nova Zelândia","Fiji"], answer:"C", fact:"A Nova Zelândia foi o primeiro país autônomo do mundo a dar direito de voto às mulheres." },
  ],

  artico: [
    { q:"Qual é o oceano que banha o Polo Norte?", options:["Atlântico","Índico","Pacífico","Ártico"], answer:"D", fact:"O Oceano Ártico está perdendo gelo rapidamente — o Ártico aquece 3x mais rápido que o restante do planeta." },
    { q:"Qual país tem reivindicações no Ártico além de Canadá, Rússia, EUA e Noruega?", options:["Islândia","Suécia","Finlândia","Dinamarca"], answer:"D", fact:"A Dinamarca reivindica parte do Ártico através da Groenlândia, território autônomo dinamarquês." },
  ],

  oceano: [
    { q:"Qual foi o primeiro europeu a cruzar o Oceano Pacífico?", options:["Colombo","Vasco da Gama","Fernão de Magalhães","João Dias"], answer:"C", fact:"Magalhães morreu nas Filipinas em 1521 — apenas 18 dos 270 homens que partiram completaram a viagem." },
    { q:"Qual é o oceano mais extenso do mundo?", options:["Atlântico","Índico","Ártico","Pacífico"], answer:"D", fact:"O Pacífico tem área maior que todos os continentes juntos." },
    { q:"Qual é o ponto mais profundo dos oceanos?", options:["Fossa de Porto Rico","Fossa de Tonga","Fossa de Java","Fossa das Marianas"], answer:"D", fact:"A Fossa das Marianas atinge 11.034m de profundidade no Oceano Pacífico." },
    { q:"O que são as Grandes Navegações?", options:["Guerras navais medievais","Expansão marítima europeia dos séc. XV-XVI","Rotas comerciais romanas","Invasões vikings"], answer:"B", fact:"Portugal e Espanha lideraram as Grandes Navegações, conectando pela primeira vez todos os continentes." },
  ],
};

/* Fallback: se banco da região não tem perguntas, usa geo_geral */
QB['oceano_atl'] = QB['oceano'];
QB['oceano_pac'] = QB['oceano'];
QB['antartica']  = QB['artico'];

/* ─────────────────────────────────────────────────
   LOCALSTORAGE — PONTOS DO PROFESSOR
───────────────────────────────────────────────── */
const LS_KEY = 'geohistoria_pontos_v3';

function loadPontos() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function savePontos(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

let PONTOS_PROF = loadPontos();  // Array de pontos do professor

/* ─────────────────────────────────────────────────
   ESTADO DO JOGO
───────────────────────────────────────────────── */
let G = {
  players:[], currentIdx:0, round:1, totalRounds:10,
  phase:'wait', lat:null, lon:null, region:null,
  currentQ:null, usedQ:{}, mode:'auto',
  pendingPos:null, gameActive:false,
  profPontosQueue:[],   // fila de pontos do professor para o jogo
  profLat:null, profLon:null,  // ponto temporário no painel
};

/* ─────────────────────────────────────────────────
   SETUP — BUILD NAME FIELDS
───────────────────────────────────────────────── */
document.getElementById('cfg-players').addEventListener('input', buildNames);
buildNames();

function buildNames() {
  const n = clamp(parseInt(document.getElementById('cfg-players').value)||2, 1, 20);
  const g = document.getElementById('names-grid');
  g.innerHTML = '';
  for (let i=1;i<=n;i++) {
    g.innerHTML += `<div class="pname-row"><span class="pid-tag">P${i}</span><input id="pname-${i}" placeholder="Jogador ${i}" maxlength="18"></div>`;
  }
}

function setMode(m) {
  G.mode = m;
  document.getElementById('btn-mode-auto').classList.toggle('active', m==='auto');
  document.getElementById('btn-mode-prof').classList.toggle('active', m==='prof');
}

/* ─────────────────────────────────────────────────
   NAVEGAÇÃO DE TELAS
───────────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-professor') renderProfPanel();
}

function confirmBack() {
  if (G.gameActive) document.getElementById('modal-bg').classList.add('visible');
  else showScreen('screen-menu');
}

function closeModal() { document.getElementById('modal-bg').classList.remove('visible'); }

function doGoMenu() {
  closeModal();
  G.gameActive = false;
  showScreen('screen-menu');
}

/* ─────────────────────────────────────────────────
   PAINEL DO PROFESSOR
───────────────────────────────────────────────── */

/** Clique no mapa do professor */
function handleMapClick(event) {
  const img = document.getElementById('prof-map-img');
  const { lat, lon } = clickToCoord(event, img);
  G.profLat = lat;
  G.profLon = lon;

  // Posiciona marcador temporário
  const { x, y } = toPercent(lat, lon);
  const marker = document.getElementById('prof-marker');
  marker.style.left = `${x}%`;
  marker.style.top  = `${y}%`;
  marker.classList.add('visible');

  const fLat = `${Math.abs(lat)}°${lat>=0?'N':'S'}`;
  const fLon = `${Math.abs(lon)}°${lon>=0?'L':'O'}`;
  document.getElementById('prof-marker-label').textContent = `${fLat}, ${fLon}`;

  // Preenche os campos de coordenada
  document.getElementById('f-lat').value = lat;
  document.getElementById('f-lon').value = lon;

  // Detecta região e preenche sugestão
  const region = detectRegion(lat, lon);
  if (!document.getElementById('f-region').value) {
    document.getElementById('f-region').value = region.label;
  }

  // Auto-preenche pergunta geográfica se vazio
  const geoQ = document.getElementById('f-geo-q');
  if (!geoQ.value) {
    geoQ.value = `Qual é a Latitude e a Longitude desta posição no mapa?`;
    document.getElementById('f-geo-a').value = `Lat: ${fLat}, Lon: ${fLon}`;
    document.getElementById('f-geo-b').value = `Lat: ${Math.abs(lat+20)}°${lat+20>=0?'N':'S'}, Lon: ${Math.abs(lon+30)}°${lon+30>=0?'L':'O'}`;
    document.getElementById('f-geo-c').value = `Lat: ${Math.abs(lat-20)}°${lat-20>=0?'N':'S'}, Lon: ${Math.abs(lon-30)}°${lon-30>=0?'L':'O'}`;
    document.getElementById('f-geo-d').value = `Lat: ${Math.abs(lat+10)}°${lat+10>=0?'N':'S'}, Lon: ${Math.abs(lon-20)}°${lon-20>=0?'L':'O'}`;
  }

  setFeedback('', '');
}

/** Aplicar coordenadas manuais */
function applyManualCoord() {
  const lat = parseFloat(document.getElementById('f-lat').value);
  const lon = parseFloat(document.getElementById('f-lon').value);
  if (isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180) {
    setFeedback('Coordenadas inválidas. Lat: -90 a 90, Lon: -180 a 180.', 'err');
    return;
  }
  G.profLat = Math.round(lat);
  G.profLon = Math.round(lon);
  document.getElementById('f-lat').value = G.profLat;
  document.getElementById('f-lon').value = G.profLon;

  // Simula clique para posicionar marcador
  const { x, y } = toPercent(G.profLat, G.profLon);
  const marker = document.getElementById('prof-marker');
  marker.style.left = `${x}%`;
  marker.style.top  = `${y}%`;
  marker.classList.add('visible');
  const fLat = `${Math.abs(G.profLat)}°${G.profLat>=0?'N':'S'}`;
  const fLon = `${Math.abs(G.profLon)}°${G.profLon>=0?'L':'O'}`;
  document.getElementById('prof-marker-label').textContent = `${fLat}, ${fLon}`;

  const region = detectRegion(G.profLat, G.profLon);
  if (!document.getElementById('f-region').value) {
    document.getElementById('f-region').value = region.label;
  }
  setFeedback('Coordenadas aplicadas. Preencha as perguntas e salve.', 'ok');
}

/** Salvar ponto */
function savePoint() {
  const lat    = parseFloat(document.getElementById('f-lat').value);
  const lon    = parseFloat(document.getElementById('f-lon').value);
  const region = document.getElementById('f-region').value.trim();
  const geoQ   = document.getElementById('f-geo-q').value.trim();
  const geoA   = document.getElementById('f-geo-a').value.trim();
  const geoB   = document.getElementById('f-geo-b').value.trim();
  const geoC   = document.getElementById('f-geo-c').value.trim();
  const geoD   = document.getElementById('f-geo-d').value.trim();
  const histQ  = document.getElementById('f-hist-q').value.trim();
  const histA  = document.getElementById('f-hist-a').value.trim();
  const histB  = document.getElementById('f-hist-b').value.trim();
  const histC  = document.getElementById('f-hist-c').value.trim();
  const histD  = document.getElementById('f-hist-d').value.trim();
  const fact   = document.getElementById('f-fact').value.trim();

  // Validações
  if (isNaN(lat)||isNaN(lon)) { setFeedback('Defina o ponto no mapa ou pelas coordenadas primeiro.', 'err'); return; }
  if (!region)  { setFeedback('Preencha o nome do lugar / região.', 'err'); return; }
  if (!geoQ || !geoA || !geoB || !geoC || !geoD) { setFeedback('Preencha a pergunta geográfica e todas as 4 opções.', 'err'); return; }
  if (!histQ || !histA || !histB || !histC || !histD) { setFeedback('Preencha a pergunta histórica e todas as 4 opções.', 'err'); return; }

  const ponto = {
    id: Date.now(),
    lat: Math.round(lat),
    lon: Math.round(lon),
    region,
    geo: { q:geoQ,  options:[geoA,geoB,geoC,geoD],  answer:'A', fact },
    hist:{ q:histQ, options:[histA,histB,histC,histD], answer:'A', fact },
  };

  PONTOS_PROF.push(ponto);
  savePontos(PONTOS_PROF);
  renderProfPanel();
  clearForm();
  setFeedback(`✅ Ponto "${region}" salvo com sucesso! Total: ${PONTOS_PROF.length} ponto(s).`, 'ok');
}

function clearForm() {
  ['f-lat','f-lon','f-region','f-geo-q','f-geo-a','f-geo-b','f-geo-c','f-geo-d',
   'f-hist-q','f-hist-a','f-hist-b','f-hist-c','f-hist-d','f-fact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  G.profLat = null;
  G.profLon = null;
  document.getElementById('prof-marker').classList.remove('visible');
  setFeedback('', '');
}

function deletePoint(id) {
  PONTOS_PROF = PONTOS_PROF.filter(p => p.id !== id);
  savePontos(PONTOS_PROF);
  renderProfPanel();
}

function clearAllPoints() {
  if (!confirm(`Apagar todos os ${PONTOS_PROF.length} pontos salvos?`)) return;
  PONTOS_PROF = [];
  savePontos(PONTOS_PROF);
  renderProfPanel();
}

function setFeedback(msg, type) {
  const el = document.getElementById('form-feedback');
  el.textContent = msg;
  el.className = `form-feedback ${type}`;
}

function renderProfPanel() {
  // Contagem
  document.getElementById('prof-point-count').textContent = `${PONTOS_PROF.length} ponto(s) salvo(s)`;

  // Pins no mapa
  const layer = document.getElementById('saved-pins-layer');
  layer.innerHTML = '';
  PONTOS_PROF.forEach(p => {
    const { x, y } = toPercent(p.lat, p.lon);
    const pin = document.createElement('div');
    pin.className = 'saved-pin';
    pin.style.left = `${x}%`;
    pin.style.top  = `${y}%`;
    pin.innerHTML = `<div class="saved-pin-dot"></div><div class="saved-pin-tooltip">${esc(p.region)}</div>`;
    pin.onclick = () => loadPointToForm(p);
    layer.appendChild(pin);
  });

  // Lista
  const list = document.getElementById('saved-points-list');
  if (!PONTOS_PROF.length) {
    list.innerHTML = '<div style="font-size:11px;color:var(--text-faint);padding:6px 0">Nenhum ponto salvo ainda.</div>';
    return;
  }
  list.innerHTML = PONTOS_PROF.map(p => `
    <div class="saved-point-row">
      <span class="pt-coords">${p.lat}°, ${p.lon}°</span>
      <span class="pt-name">${esc(p.region)}</span>
      <span class="pt-del" onclick="deletePoint(${p.id})">✖</span>
    </div>`).join('');
}

function loadPointToForm(p) {
  document.getElementById('f-lat').value    = p.lat;
  document.getElementById('f-lon').value    = p.lon;
  document.getElementById('f-region').value = p.region;
  document.getElementById('f-geo-q').value  = p.geo.q;
  document.getElementById('f-geo-a').value  = p.geo.options[0];
  document.getElementById('f-geo-b').value  = p.geo.options[1];
  document.getElementById('f-geo-c').value  = p.geo.options[2];
  document.getElementById('f-geo-d').value  = p.geo.options[3];
  document.getElementById('f-hist-q').value = p.hist.q;
  document.getElementById('f-hist-a').value = p.hist.options[0];
  document.getElementById('f-hist-b').value = p.hist.options[1];
  document.getElementById('f-hist-c').value = p.hist.options[2];
  document.getElementById('f-hist-d').value = p.hist.options[3];
  document.getElementById('f-fact').value   = p.geo.fact || '';
  G.profLat = p.lat;
  G.profLon = p.lon;
  applyManualCoord();
  setFeedback(`Ponto "${p.region}" carregado para edição. Após modificar, salve como novo ponto.`, 'ok');
}

function exportPoints() {
  const json = JSON.stringify(PONTOS_PROF, null, 2);
  const blob = new Blob([json], {type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'geo-historia-pontos.json'; a.click();
  URL.revokeObjectURL(url);
}

function importPoints(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Formato inválido');
      PONTOS_PROF = [...PONTOS_PROF, ...data];
      savePontos(PONTOS_PROF);
      renderProfPanel();
      setFeedback(`✅ ${data.length} ponto(s) importado(s) com sucesso!`, 'ok');
    } catch { setFeedback('Erro ao importar: arquivo JSON inválido.', 'err'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ─────────────────────────────────────────────────
   INICIAR JOGO
───────────────────────────────────────────────── */
function startGame() {
  const n = clamp(parseInt(document.getElementById('cfg-players').value)||2, 1, 20);
  G.totalRounds = clamp(parseInt(document.getElementById('cfg-rounds').value)||10, 1, 20);

  // Modo professor precisa de pontos salvos
  if (G.mode === 'prof') {
    if (PONTOS_PROF.length === 0) {
      alert('Modo Professor: nenhum ponto salvo! Acesse o Painel do Professor e crie pontos de jogo primeiro.');
      return;
    }
    // Embaralha e cria fila
    G.profPontosQueue = shuffle([...PONTOS_PROF]);
  }

  G.players = [];
  for (let i=1;i<=n;i++) {
    const el = document.getElementById(`pname-${i}`);
    G.players.push({ id:`P${i}`, name: el?.value.trim()||`Jogador ${i}`, score:0 });
  }
  G.currentIdx=0; G.round=1; G.phase='wait';
  G.usedQ={}; G.gameActive=true;

  showScreen('screen-game');
  document.getElementById('round-tot').textContent = `/${G.totalRounds}`;
  document.getElementById('gm-log').innerHTML = '';
  hideQuiz(); hideMarker();
  renderScoreboard(); renderDots(); updateTopbar();

  log(`🗺 Expedição iniciada! ${n} explorador(es) · ${G.totalRounds} rodadas · Modo ${G.mode==='auto'?'Automático':'Professor'}`, 'sys');
  log('💡 /pular pula a pergunta · /dica mostra dica · /status mostra placar', 'sys');

  setTimeout(beginTurn, 700);
}

function replayGame() { startGame(); }

/* ─────────────────────────────────────────────────
   TURNOS
───────────────────────────────────────────────── */
function beginTurn() {
  if (G.round > G.totalRounds) { endGame(); return; }
  setPhase('geo'); updateTopbar(); hideQuiz();

  let lat, lon, regionOverride=null, geoQOverride=null, histQOverride=null;

  if (G.mode==='prof' && G.profPontosQueue.length > 0) {
    // Usa ponto do professor (cíclico)
    const idx = ((G.round-1) * G.players.length + G.currentIdx) % G.profPontosQueue.length;
    const ponto = G.profPontosQueue[idx];
    lat = ponto.lat; lon = ponto.lon;
    regionOverride = { id:'prof_'+ponto.id, label: ponto.region };
    geoQOverride  = ponto.geo;
    histQOverride = ponto.hist;
  } else if (G.pendingPos) {
    lat = G.pendingPos.lat; lon = G.pendingPos.lon;
    G.pendingPos = null;
  } else {
    const c = randomCoord(); lat=c.lat; lon=c.lon;
  }

  G.lat=lat; G.lon=lon;
  G.region = regionOverride || detectRegion(lat, lon);
  G._histQOverride = histQOverride;

  placeMarker(lat, lon);

  const cp = G.players[G.currentIdx];
  log(`🗺 Rodada ${G.round}/${G.totalRounds} — Vez de ${cp.name}!\nObserve o marcador e responda o quiz geográfico.`);

  // Pergunta geográfica
  const geoQ = geoQOverride || buildGeoQuiz(lat, lon, G.region.label);
  G.currentQ = geoQ;

  setTimeout(() => showQuiz(geoQ, handleGeoResult), 350);
}

function handleGeoResult(correct) {
  const cp = G.players[G.currentIdx];
  if (correct) {
    cp.score += 50;
    renderScoreboard();
    showFeedback(true, '+50 Pontos!', `Posição correta! Região: ${G.region.label}.\n${cp.name} agora tem ${cp.score} pts.`, G.currentQ.fact||'');
  } else {
    const ans = G.currentQ.options[['A','B','C','D'].indexOf(G.currentQ.answer)];
    showFeedback(false, 'Incorreto', `Resposta correta: ${ans}.`, G.currentQ.fact||'');
  }
  setTimeout(askHist, correct?3000:3400);
}

function askHist() {
  setPhase('hist');
  const cp = G.players[G.currentIdx];
  const q  = G._histQOverride || pickQ(G.region.id);
  G._histQOverride = null;
  G.currentQ = q;
  log(`🏛 Quiz Histórico — ${G.region.label}\n${cp.name}, responda:`);
  setTimeout(() => showQuiz(q, handleHistResult), 300);
}

function handleHistResult(correct) {
  const cp = G.players[G.currentIdx];
  if (correct) {
    cp.score += 50;
    renderScoreboard();
    showFeedback(true, '+50 Pontos!', `${cp.name} agora tem ${cp.score} pts.`, G.currentQ.fact||'');
  } else {
    const ans = G.currentQ.options[['A','B','C','D'].indexOf(G.currentQ.answer)];
    showFeedback(false, 'Incorreto', `Resposta correta: ${ans}.`, G.currentQ.fact||'');
  }
  G.currentQ = null;
  setTimeout(advTurn, correct?3400:3800);
}

function advTurn() {
  G.currentIdx++;
  if (G.currentIdx >= G.players.length) { G.currentIdx=0; G.round++; }
  if (G.round > G.totalRounds) { endGame(); return; }
  setPhase('wait'); updateTopbar(); hideQuiz();
  setTimeout(beginTurn, 500);
}

/* ─────────────────────────────────────────────────
   FIM DE JOGO
───────────────────────────────────────────────── */
function endGame() {
  setPhase('end'); G.gameActive=false; hideQuiz();
  const sorted = [...G.players].sort((a,b)=>b.score-a.score);
  const medals = ['🥇','🥈','🥉'];
  document.getElementById('final-rank').innerHTML = sorted.map((p,i)=>`
    <div class="rank-row ${i===0?'gold':''}">
      <span class="rank-medal">${medals[i]||''}</span>
      <span class="rank-pos">${i+1}º</span>
      <span class="rank-name">${esc(p.id)} · ${esc(p.name)}</span>
      <span class="rank-pts">${p.score} pts</span>
    </div>`).join('');
  setTimeout(()=>showScreen('screen-end'), 600);
}

/* ─────────────────────────────────────────────────
   QUIZ UI
───────────────────────────────────────────────── */
function showQuiz(q, cb) {
  document.getElementById('quiz-block').style.display = 'block';
  document.getElementById('quiz-q').innerHTML = esc(q.q).replace(/\n/g,'<br>');
  const letters = ['A','B','C','D'];
  document.getElementById('quiz-opts').innerHTML = q.options.map((opt,i)=>`
    <button class="q-opt" data-letter="${letters[i]}" onclick="pickOpt('${letters[i]}',this)">
      <span class="q-letter">${letters[i]})</span>${esc(opt)}
    </button>`).join('');
  window._qCb      = cb;
  window._qCorrect = q.answer;
  window._qDone    = false;
}

function pickOpt(letter, btn) {
  if (window._qDone) return;
  window._qDone = true;
  const correct = window._qCorrect;
  document.querySelectorAll('.q-opt').forEach(b => {
    b.classList.add('disabled');
    if (b.dataset.letter === correct) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
  });
  const isOk = letter === correct;
  setTimeout(()=>{ hideQuiz(); if(window._qCb) window._qCb(isOk); }, 1100);
}

function hideQuiz() {
  document.getElementById('quiz-block').style.display='none';
  document.getElementById('quiz-q').innerHTML='';
  document.getElementById('quiz-opts').innerHTML='';
}

/* ─────────────────────────────────────────────────
   FEEDBACK
───────────────────────────────────────────────── */
function showFeedback(ok, title, body, fact, ms=2800) {
  const wrap = document.getElementById('feedback-wrap');
  const card = document.getElementById('feedback-card');
  document.getElementById('fb-icon').textContent  = ok ? '✅' : '❌';
  document.getElementById('fb-title').textContent = title;
  document.getElementById('fb-body').textContent  = body;
  document.getElementById('fb-fact').textContent  = fact ? `💡 ${fact}` : '';
  document.getElementById('fb-title').style.color = ok ? 'var(--green)' : 'var(--red)';
  card.className = `feedback-card ${ok?'fb-ok':'fb-err'}`;
  wrap.classList.add('visible');
  setTimeout(()=>wrap.classList.remove('visible'), ms);
}

/* ─────────────────────────────────────────────────
   MARCADOR DO JOGO
───────────────────────────────────────────────── */
function placeMarker(lat, lon) {
  const {x,y} = toPercent(lat, lon);
  const m = document.getElementById('game-marker');
  m.style.left = `${x}%`;
  m.style.top  = `${y}%`;
  m.classList.add('visible');
  document.getElementById('gm-label').textContent = G.players[G.currentIdx]?.id||'';
  const fLat = `${Math.abs(lat)}°${lat>=0?'N':'S'}`;
  const fLon = `${Math.abs(lon)}°${lon>=0?'L':'O'}`;
  const b1=document.getElementById('badge-lat');
  const b2=document.getElementById('badge-lon');
  const b3=document.getElementById('badge-region');
  b1.textContent=`LAT: ${fLat}`; b1.classList.add('lit');
  b2.textContent=`LON: ${fLon}`; b2.classList.add('lit');
  b3.textContent=G.region?.label||'–';
}

function hideMarker() {
  document.getElementById('game-marker').classList.remove('visible');
  ['badge-lat','badge-lon'].forEach(id=>{ const el=document.getElementById(id); el.textContent='LAT: –'; el.classList.remove('lit'); });
  document.getElementById('badge-lat').textContent='LAT: –';
  document.getElementById('badge-lon').textContent='LON: –';
  document.getElementById('badge-region').textContent='–';
}

/* ─────────────────────────────────────────────────
   LOG DO GM
───────────────────────────────────────────────── */
function log(text, type='narrator') {
  const c = document.getElementById('gm-log');
  const d = document.createElement('div');
  const clsMap = { narrator:'narrator', sys:'system-log', cmd:'cmd-log' };
  d.className = `log-entry ${clsMap[type]||type}`;
  if (type==='narrator') d.innerHTML = `<div class="log-from">✦ Mestre de Jogo</div>${esc(text).replace(/\n/g,'<br>')}`;
  else d.innerHTML = esc(text).replace(/\n/g,'<br>');
  c.appendChild(d); c.scrollTop=c.scrollHeight;
}

/* ─────────────────────────────────────────────────
   COMANDOS
───────────────────────────────────────────────── */
function doCmd() {
  const inp = document.getElementById('cmd-in');
  const raw = inp.value.trim();
  if (!raw) return;
  inp.value = '';
  if (!raw.startsWith('/')) { log(`ℹ Use os botões do quiz para responder, ou comandos com /.`, 'sys'); return; }
  log(raw, 'cmd');
  const parts = raw.split(/\s+/);
  const cmd   = parts[0].toLowerCase();

  if (cmd==='/set_pos') {
    const lat=parseInt(parts[1]), lon=parseInt(parts[2]);
    if (isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180) { log('⚠ Uso: /set_pos [Lat] [Lon]  ex: /set_pos -10 -50', 'sys'); return; }
    G.pendingPos = { lat:Math.round(lat), lon:Math.round(lon) };
    log(`📍 Próxima posição definida: ${lat}°, ${lon}°`, 'sys');
    if (G.phase==='wait' && G.gameActive) beginTurn();
    return;
  }

  if (cmd==='/status') {
    const r = [...G.players].sort((a,b)=>b.score-a.score).map((p,i)=>`${i+1}º ${p.name}: ${p.score}pts`).join(' · ');
    log(`📊 ${r} | Rodada ${G.round}/${G.totalRounds}`, 'sys'); return;
  }

  if (cmd==='/pular') {
    if (G.phase==='geo') { log('⏭ Quiz geográfico pulado.','sys'); hideQuiz(); setTimeout(askHist,300); }
    else if (G.phase==='hist') { log('⏭ Quiz histórico pulado.','sys'); hideQuiz(); setTimeout(advTurn,300); }
    else log('⚠ Nenhum quiz ativo.','sys');
    return;
  }

  if (cmd==='/dica') {
    if (G.currentQ?.fact) log(`💡 Curiosidade: ${G.currentQ.fact}`,'sys');
    else if (G.region) log(`💡 Região: ${G.region.label}`,'sys');
    else log('⚠ Nenhuma dica disponível.','sys');
    return;
  }

  log(`⚠ Comando desconhecido: "${cmd}". Use: /set_pos · /status · /pular · /dica`, 'sys');
}

/* ─────────────────────────────────────────────────
   RENDERIZAÇÃO DE UI DO JOGO
───────────────────────────────────────────────── */
function renderScoreboard() {
  document.getElementById('scoreboard').innerHTML = G.players.map((p,i)=>`
    <div class="score-row ${i===G.currentIdx?'active':''}">
      <span class="sc-pid">${p.id}</span>
      <span class="sc-name">${esc(p.name)}</span>
      <span class="sc-pts">${p.score}</span>
    </div>`).join('');
}

function renderDots() {
  document.getElementById('round-dots').innerHTML = Array.from({length:G.totalRounds},(_,i)=>{
    const c = i+1<G.round?'done':i+1===G.round?'current':'';
    return `<div class="r-dot ${c}"></div>`;
  }).join('');
}

function updateTopbar() {
  document.getElementById('round-num').textContent = G.round;
  document.getElementById('turn-player').textContent = G.players[G.currentIdx]?.name||'–';
  renderDots(); renderScoreboard();
}

function setPhase(p) {
  G.phase=p;
  const el=document.getElementById('phase-tag');
  const map={wait:'AGUARDANDO',geo:'QUIZ GEO',hist:'QUIZ HIST.',end:'FIM'};
  el.className=`phase-tag ${p}`; el.textContent=map[p]||p;
}

/* ─────────────────────────────────────────────────
   SELEÇÃO DE PERGUNTAS DO BANCO
───────────────────────────────────────────────── */
function pickQ(regionId) {
  // Tenta banco da região, depois region pai, depois oceano
  const candidates = [regionId, regionId.replace(/_[^_]+$/,''), 'oceano'];
  let pool = null;
  for (const id of candidates) {
    if (QB[id] && QB[id].length > 0) { pool=QB[id]; break; }
  }
  if (!pool) pool = QB['oceano'];

  if (!G.usedQ[regionId]) G.usedQ[regionId]=new Set();
  const used=G.usedQ[regionId];
  if (used.size>=pool.length) used.clear();
  let idx;
  do { idx=Math.floor(Math.random()*pool.length); } while(used.has(idx));
  used.add(idx);
  return pool[idx];
}

/* ─────────────────────────────────────────────────
   QUIZ GEOGRÁFICO (automático quando não há ponto professor)
───────────────────────────────────────────────── */
function buildGeoQuiz(lat, lon, regionLabel) {
  const fLat = v => `${Math.abs(v)}°${v>=0?'N':'S'}`;
  const fLon = v => `${Math.abs(v)}°${v>=0?'L':'O'}`;
  const correct = `Lat: ${fLat(lat)}, Lon: ${fLon(lon)}`;
  const wrongs = [
    `Lat: ${fLat(lat+20)}, Lon: ${fLon(lon+30)}`,
    `Lat: ${fLat(lat-20)}, Lon: ${fLon(lon-30)}`,
    `Lat: ${fLat(lat+10)}, Lon: ${fLon(lon-20)}`,
  ].map(s=>s.replace('Lat: -0°','Lat: 0°'));
  const opts = shuffle([correct,...wrongs]);
  const ansIdx = opts.indexOf(correct);
  return {
    q:`Qual é a Latitude e Longitude do marcador?\nRegião: ${regionLabel}`,
    options:opts,
    answer:['A','B','C','D'][ansIdx],
    fact:`A posição exata é Lat ${fLat(lat)}, Lon ${fLon(lon)} — ${regionLabel}.`,
  };
}

/* ─────────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────────── */
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function shuffle(a){return[...a].sort(()=>Math.random()-0.5);}

function randomCoord(){
  const lats=[-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
  return {
    lat:lats[Math.floor(Math.random()*lats.length)],
    lon:clamp(Math.round((Math.random()*340-170)/10)*10,-170,170),
  };
}

/* ─────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  showScreen('screen-menu');
  document.getElementById('cmd-in').addEventListener('keydown',e=>{
    if(e.key==='Enter') doCmd();
  });
});