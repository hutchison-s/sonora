import mapaVocabulary from '@/content/vocabulary/el-mapa-en-la-pared.json';
import ultimoTrenVocabulary from '@/content/vocabulary/el-ultimo-tren.json';
import mesaVocabulary from '@/content/vocabulary/la-mesa-para-dos.json';
import mensajeVocabulary from '@/content/vocabulary/un-mensaje-equivocado.json';
import marcasVocabulary from '@/content/vocabulary/las-marcas-del-agua.json';

export type VocabularyTerm = { es: string; en: string };
export type VerbTerm = VocabularyTerm & { present: [string, string, string, string, string] };
export type StoryVocabulary = { nouns: VocabularyTerm[]; verbs: VerbTerm[]; prepositions: VocabularyTerm[]; expressions: VocabularyTerm[] };

const verb = (es: string, en: string, present: VerbTerm['present']): VerbTerm => ({ es, en, present });

export const vocabularyByStory: Record<string, StoryVocabulary> = {
  'la-llave-azul': {
    nouns: [
      { es:'el edificio', en:'building' }, { es:'la puerta', en:'door' }, { es:'la llave', en:'key' },
      { es:'el suelo', en:'floor / ground' }, { es:'el apartamento', en:'apartment' }, { es:'las escaleras', en:'stairs' },
      { es:'la mujer', en:'woman' }, { es:'la sonrisa', en:'smile' }, { es:'el jardín', en:'garden' },
      { es:'la azotea', en:'rooftop' }, { es:'la amiga', en:'friend' }, { es:'el lugar', en:'place' },
    ],
    verbs: [
      verb('vivir','to live',['vivo','vives','vive','vivimos','viven']),
      verb('encontrar','to find',['encuentro','encuentras','encuentra','encontramos','encuentran']),
      verb('abrir','to open',['abro','abres','abre','abrimos','abren']),
      verb('subir','to go up',['subo','subes','sube','subimos','suben']),
      verb('llamar','to call / knock',['llamo','llamas','llama','llamamos','llaman']),
      verb('mirar','to look at',['miro','miras','mira','miramos','miran']),
      verb('tener','to have',['tengo','tienes','tiene','tenemos','tienen']),
      verb('leer','to read',['leo','lees','lee','leemos','leen']),
    ],
    prepositions: [{ es:'en', en:'in / on' }, { es:'de', en:'of / from' }, { es:'con', en:'with' }, { es:'para', en:'for / in order to' }],
    expressions: [{ es:'en el suelo', en:'on the floor' }, { es:'llamar a la puerta', en:'to knock on the door' }, { es:'con una sonrisa', en:'with a smile' }, { es:'en la azotea', en:'on the rooftop' }],
  },
  'el-ultimo-cafe': {
    nouns: [
      { es:'la tarde', en:'afternoon / evening' }, { es:'la ciudad', en:'city' }, { es:'el café', en:'café / coffee' },
      { es:'la casa', en:'home / house' }, { es:'el libro', en:'book' }, { es:'el camarero', en:'waiter' },
      { es:'la mesa', en:'table' }, { es:'el cuaderno', en:'notebook' }, { es:'la nota', en:'note' },
      { es:'el lugar', en:'place' }, { es:'el número', en:'number' }, { es:'la página', en:'page' },
    ],
    verbs: [
      verb('llover','to rain',['lluevo','llueves','llueve','llovemos','llueven']),
      verb('estar','to be (state/location)',['estoy','estás','está','estamos','están']),
      verb('tener','to have',['tengo','tienes','tiene','tenemos','tienen']),
      verb('cerrar','to close',['cierro','cierras','cierra','cerramos','cierran']),
      verb('ver','to see',['veo','ves','ve','vemos','ven']),
      verb('volver','to return',['vuelvo','vuelves','vuelve','volvemos','vuelven']),
    ],
    prepositions: [{ es:'en', en:'in / at' }, { es:'cerca de', en:'near' }, { es:'para', en:'for' }, { es:'con / sin', en:'with / without' }],
    expressions: [{ es:'cerrar temprano', en:'to close early' }, { es:'ser especial para alguien', en:'to be special to someone' }, { es:'dejar su número', en:'to leave one’s number' }, { es:'con café o sin café', en:'with or without coffee' }],
  },
  'el-tren-de-las-seis': {
    nouns: [
      { es:'la estación', en:'station' }, { es:'la maleta', en:'suitcase' }, { es:'el billete', en:'ticket' },
      { es:'el hermano', en:'brother' }, { es:'el reloj', en:'clock' }, { es:'el andén', en:'platform' },
      { es:'el tren', en:'train' }, { es:'la puerta', en:'door' }, { es:'el banco', en:'bench' },
      { es:'la naranja', en:'orange' }, { es:'el viaje', en:'trip / journey' }, { es:'el rincón', en:'corner / hidden spot' },
      { es:'la dirección', en:'address' }, { es:'la paella', en:'paella' }, { es:'la historia', en:'story' },
    ],
    verbs: [
      verb('llegar','to arrive',['llego','llegas','llega','llegamos','llegan']),
      verb('llevar','to carry / wear',['llevo','llevas','lleva','llevamos','llevan']),
      verb('correr','to run',['corro','corres','corre','corremos','corren']),
      verb('salir','to leave',['salgo','sales','sale','salimos','salen']),
      verb('esperar','to wait / hope',['espero','esperas','espera','esperamos','esperan']),
      verb('ofrecer','to offer',['ofrezco','ofreces','ofrece','ofrecemos','ofrecen']),
      verb('conocer','to know / visit',['conozco','conoces','conoce','conocemos','conocen']),
      verb('perder','to lose / miss',['pierdo','pierdes','pierde','perdemos','pierden']),
    ],
    prepositions: [{ es:'antes de', en:'before' }, { es:'hacia', en:'toward' }, { es:'en', en:'in / on' }, { es:'detrás de', en:'behind / on the back of' }],
    expressions: [{ es:'No pasa nada', en:'It’s all right / No problem' }, { es:'todos sus rincones', en:'every corner of it' }, { es:'antes de despedirse', en:'before saying goodbye' }, { es:'sin prisa', en:'without rushing' }],
  },
  'la-casa-de-las-cartas': {
    nouns: [
      { es:'la librería', en:'bookstore' }, { es:'el abuelo', en:'grandfather' }, { es:'el local', en:'shop / premises' },
      { es:'el papel', en:'paper' }, { es:'el otoño', en:'autumn' }, { es:'la estantería', en:'bookshelf' },
      { es:'la caja', en:'box' }, { es:'la carta', en:'letter' }, { es:'el nombre', en:'name' },
      { es:'la dirección', en:'address' }, { es:'el vecino', en:'neighbor' }, { es:'la discusión', en:'argument' },
      { es:'el negocio', en:'business' }, { es:'el encuentro', en:'meeting' }, { es:'el sobre', en:'envelope' },
    ],
    verbs: [
      verb('pasar','to spend / pass',['paso','pasas','pasa','pasamos','pasan']),
      verb('oler','to smell',['huelo','hueles','huele','olemos','huelen']),
      verb('dejar','to leave',['dejo','dejas','deja','dejamos','dejan']),
      verb('encontrar','to find',['encuentro','encuentras','encuentra','encontramos','encuentran']),
      verb('pedir','to ask for',['pido','pides','pide','pedimos','piden']),
      verb('comprender','to understand',['comprendo','comprendes','comprende','comprendemos','comprenden']),
      verb('buscar','to look for',['busco','buscas','busca','buscamos','buscan']),
      verb('abrir','to open',['abro','abres','abre','abrimos','abren']),
    ],
    prepositions: [{ es:'detrás de', en:'behind' }, { es:'durante', en:'during' }, { es:'para', en:'for / in order to' }, { es:'con', en:'with' }],
    expressions: [{ es:'oler a papel viejo', en:'to smell of old paper' }, { es:'dar las gracias', en:'to give thanks' }, { es:'pedir perdón', en:'to apologize' }, { es:'un lugar de encuentro', en:'a meeting place' }, { es:'al día siguiente', en:'the next day' }],
  },
  'la-habitacion-doce': {
    nouns: [
      { es:'el hotel', en:'hotel' }, { es:'el pueblo', en:'town' }, { es:'la costa', en:'coast' },
      { es:'la fotografía', en:'photograph' }, { es:'el fotógrafo', en:'photographer' }, { es:'la recepcionista', en:'receptionist' },
      { es:'la llave', en:'key' }, { es:'la habitación', en:'room' }, { es:'la escalera', en:'staircase' },
      { es:'la puerta', en:'door' }, { es:'la marca', en:'mark' }, { es:'la madera', en:'wood' },
      { es:'la madrugada', en:'early hours of the morning' }, { es:'la pared', en:'wall' }, { es:'el huésped', en:'guest' },
      { es:'la tormenta', en:'storm' }, { es:'la voz', en:'voice' }, { es:'la grabadora', en:'tape recorder' },
      { es:'la cinta', en:'cassette / tape' }, { es:'el cajón', en:'drawer' }, { es:'el latón', en:'brass' },
    ],
    verbs: [
      verb('llegar','to arrive',['llego','llegas','llega','llegamos','llegan']),
      verb('viajar','to travel',['viajo','viajas','viaja','viajamos','viajan']),
      verb('subir','to go up',['subo','subes','sube','subimos','suben']),
      verb('despertar','to wake up',['despierto','despiertas','despierta','despertamos','despiertan']),
      verb('arrastrar','to drag',['arrastro','arrastras','arrastra','arrastramos','arrastran']),
      verb('desaparecer','to disappear',['desaparezco','desapareces','desaparece','desaparecemos','desaparecen']),
      verb('olvidar','to forget',['olvido','olvidas','olvida','olvidamos','olvidan']),
      verb('encontrar','to find',['encuentro','encuentras','encuentra','encontramos','encuentran']),
    ],
    prepositions: [{ es:'junto a', en:'beside' }, { es:'al otro lado de', en:'on the other side of' }, { es:'frente a', en:'across from' }, { es:'detrás de', en:'behind' }],
    expressions: [{ es:'en su lugar', en:'in its place' }, { es:'sin levantar la vista', en:'without looking up' }, { es:'se quedó inmóvil', en:'she froze' }, { es:'de nuevo', en:'once again' }, { es:'de latón', en:'made of brass' }],
  },
  'cuando-volvio-la-luz': {
    nouns: [
      { es:'la luz', en:'light / electricity' }, { es:'el edificio', en:'building' }, { es:'la presentación', en:'presentation' },
      { es:'la computadora', en:'computer' }, { es:'la pantalla', en:'screen' }, { es:'la calle', en:'street' },
      { es:'el autobús', en:'bus' }, { es:'el pasillo', en:'hallway' }, { es:'la linterna', en:'flashlight' },
      { es:'el ascensor', en:'elevator' }, { es:'la vela', en:'candle' }, { es:'el maullido', en:'meow' },
      { es:'la tetera', en:'kettle / teapot' }, { es:'el apagón', en:'blackout' }, { es:'la radio de pilas', en:'battery-powered radio' },
      { es:'la azotea', en:'rooftop' }, { es:'el cartel', en:'sign' }, { es:'el rumbo', en:'direction / course' },
    ],
    verbs: [
      verb('apagarse','to go out / switch off',['me apago','te apagas','se apaga','nos apagamos','se apagan']),
      verb('preparar','to prepare',['preparo','preparas','prepara','preparamos','preparan']),
      verb('regresar','to return',['regreso','regresas','regresa','regresamos','regresan']),
      verb('acompañar','to accompany',['acompaño','acompañas','acompaña','acompañamos','acompañan']),
      verb('tropezar','to trip',['tropiezo','tropiezas','tropieza','tropezamos','tropiezan']),
      verb('descubrir','to discover',['descubro','descubres','descubre','descubrimos','descubren']),
      verb('despedirse','to say goodbye',['me despido','te despides','se despide','nos despedimos','se despiden']),
      verb('cruzarse','to cross paths',['me cruzo','te cruzas','se cruza','nos cruzamos','se cruzan']),
    ],
    prepositions: [{ es:'desde', en:'from / since' }, { es:'detrás de', en:'behind' }, { es:'entre', en:'among / between' }, { es:'en lugar de', en:'instead of' }],
    expressions: [{ es:'al mismo tiempo', en:'at the same time' }, { es:'apenas se habían saludado', en:'they had barely greeted one another' }, { es:'sin embargo', en:'however' }, { es:'se cruzó con', en:'ran into' }, { es:'cambió el rumbo', en:'changed direction' }],
  },
  'el-mapa-en-la-pared': mapaVocabulary as StoryVocabulary,
  'el-ultimo-tren': ultimoTrenVocabulary as StoryVocabulary,
  'la-mesa-para-dos': mesaVocabulary as StoryVocabulary,
  'un-mensaje-equivocado': mensajeVocabulary as StoryVocabulary,
  'las-marcas-del-agua': marcasVocabulary as StoryVocabulary,
};

export function getStoryVocabulary(storyId: string): StoryVocabulary | undefined { return vocabularyByStory[storyId]; }
