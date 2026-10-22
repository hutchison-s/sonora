import json, re
from pathlib import Path
out=Path('content/stories'); out.mkdir(exist_ok=True,parents=True)
def a(text,meaning,explanation,kind='grammar',grammar=None,tip=None,**kw):
    obj=dict(id='tmp',text=text,type=kind,meaning=meaning,explanation=explanation)
    if grammar:obj['grammar']=grammar
    if tip:obj['tip']=tip
    obj.update(kw)
    return obj
def q(question,options,index,explanation):return dict(question=question,options=options,correctIndex=index,explanation=explanation)
def story(id,title,en,level,genre,synopsis,grammar,secondary,duration,prompt,pairs,annotations,questions):
    sentences=[]
    for i,(es,eng) in enumerate(pairs):
        ann=[]
        for j,x in enumerate(annotations.get(i,[])):
            x=dict(x);x['id']=f'{id}-a{i+1}-{j+1}';ann.append(x)
        sentences.append(dict(id=f's{i+1}',es=es,en=eng,annotations=ann,audio=None))
    word_count=sum(len(s['es'].split()) for s in sentences)
    item=dict(schemaVersion=1,id=id,title={'es':title,'en':en},level=level,dialect='neutral Latin American Spanish',genre=genre,synopsis=synopsis,series=None,episode=None,grammarFocus=grammar,secondaryGrammar=secondary,estimatedDurationSeconds=duration,wordCount=word_count,coverImagePrompt=prompt,coverImage=f'/images/{id}.svg',sentences=sentences,comprehension=questions,narration={'status':'unavailable','audioUrl':None,'durationSeconds':None,'alignment':'none'})
    (out/f'{id}.json').write_text(json.dumps(item,ensure_ascii=False,indent=2)+'\n')
    print(id,word_count,'words',len(pairs),'sentences')

story('el-ultimo-cafe','El último café','The Last Coffee','A1','Slice of life',
'A quiet café, a forgotten notebook, and one small reason to return.','Present tense · ser, estar and tener',['Hay / location'],52,
'Rainy Madrid neighborhood café at dusk, steaming espresso, amber window light, empty chair',[
('Son las siete de la tarde y llueve en la ciudad.','It is seven in the evening, and it is raining in the city.'),
('Lucía está en un café pequeño cerca de su casa.','Lucía is in a small café near her home.'),
('Tiene un libro, pero no tiene café.','She has a book, but she has no coffee.'),
('El camarero dice: «Hoy cerramos temprano».','The waiter says, “Today we are closing early.”'),
('Lucía mira la mesa y ve un cuaderno rojo.','Lucía looks at the table and sees a red notebook.'),
('Dentro hay una nota: «Este lugar es especial para mí».','Inside there is a note: “This place is special to me.”'),
('Lucía sonríe y deja su número en otra página.','Lucía smiles and leaves her number on another page.'),
('Mañana quiere volver, con café o sin café.','Tomorrow she wants to come back, with or without coffee.')],{
1:[a('está en','is in','Estar locates people and things. Use está, not es, to say where Lucía is.',grammar={'infinitive':'estar','tense':'present','person':'third-person singular'})],
2:[a('Tiene','She has','Tiene is the present-tense third-person singular of tener.',grammar={'infinitive':'tener','tense':'present','person':'third-person singular'})],
5:[a('hay','there is','Hay expresses existence without naming a specific subject.',grammar={'structure':'hay + noun'})],
7:[a('quiere volver','wants to return','After querer, the second verb stays in its infinitive form.',grammar={'structure':'querer + infinitive'})]},[
q('Where is Lucía?',['At a small café','At the library','On a train'],0,'She is at a small café near her home.'),
q('What does she find?',['An old photograph','A red notebook','A blue key'],1,'She sees a red notebook on the table.'),
q('What does she leave behind?',['Her phone number','Her book','A cup of coffee'],0,'She writes her number on another page.')])

story('la-llave-azul','La llave azul','The Blue Key','A1','Light mystery',
'A misplaced key leads a new neighbor to a surprisingly warm welcome.','Present tense · common prepositions',['Direct objects'],57,
'Old painted blue door in colonial Mexican courtyard with potted plants, warm afternoon sunshine',[
('Mateo vive en un edificio antiguo con muchas puertas.','Mateo lives in an old building with many doors.'),
('Esta mañana encuentra una llave azul en el suelo.','This morning he finds a blue key on the floor.'),
('La llave no es de su casa.','The key is not for his home.'),
('Mateo sube las escaleras y llama a una puerta verde.','Mateo goes up the stairs and knocks on a green door.'),
('Una mujer mayor abre y mira la llave.','An older woman opens and looks at the key.'),
('«¡Es mía!», dice con una sonrisa.','“It’s mine!” she says with a smile.'),
('La mujer se llama Elena y tiene un jardín en la azotea.','The woman’s name is Elena, and she has a rooftop garden.'),
('Ahora Mateo tiene una nueva amiga y un lugar tranquilo para leer.','Now Mateo has a new friend and a quiet place to read.')],{
0:[a('vive en','lives in','Vivir en tells you where somebody lives.',grammar={'infinitive':'vivir','tense':'present','person':'third-person singular'})],
2:[a('no es de','does not belong to','Ser de can indicate ownership or origin. Here it means the key does not belong to his home.',grammar={'structure':'ser + de'})],
4:[a('Una mujer mayor','An older woman','Mayor often means older, not necessarily physically larger.',kind='vocabulary')],
7:[a('para leer','to read','Para followed by an infinitive expresses purpose.',grammar={'structure':'para + infinitive'})]},[
q('What color is the key?',['Green','Blue','Yellow'],1,'Mateo finds a blue key on the floor.'),
q('Who owns the key?',['Elena','Mateo','The building manager'],0,'The older woman, Elena, recognizes her key.'),
q('Where is Elena’s garden?',['Beside the street','On the roof','Behind a café'],1,'Her garden is on the rooftop.')])

story('el-tren-de-las-seis','El tren de las seis','The Six O’Clock Train','A2','Travel',
'A missed train turns a hurried journey into an unexpected encounter.','Preterite · completed past actions',['Irregular past forms','Temporal connectors'],101,
'Cinematic Spanish coastal train platform at sunset with old clock and lone suitcase, golden atmosphere',[
('Clara llegó a la estación diez minutos antes de las seis.','Clara arrived at the station ten minutes before six.'),
('Llevaba una maleta pequeña y un billete para visitar a su hermano en Valencia.','She was carrying a small suitcase and a ticket to visit her brother in Valencia.'),
('Cuando vio el reloj, empezó a correr hacia el andén.','When she saw the clock, she started running toward the platform.'),
('Pero el tren salió justo cuando ella llegó a la puerta.','But the train departed just as she reached the door.'),
('Clara se sentó en un banco y llamó a su hermano.','Clara sat on a bench and called her brother.'),
('«No pasa nada», dijo él. «Hay otro tren a las ocho».','“It’s all right,” he said. “There’s another train at eight.”'),
('Mientras esperaba, una señora le ofreció una naranja y le preguntó por su viaje.','While she waited, a woman offered her an orange and asked about her trip.'),
('Hablaron de ciudades, de comida y de los lugares que todavía querían conocer.','They talked about cities, food, and places they still wanted to discover.'),
('La señora había vivido treinta años en Valencia y conocía todos sus rincones.','The woman had lived in Valencia for thirty years and knew all its hidden corners.'),
('Antes de despedirse, escribió una dirección detrás del billete de Clara.','Before saying goodbye, she wrote an address on the back of Clara’s ticket.'),
('«Aquí hacen la mejor paella», le dijo, y las dos se rieron.','“They make the best paella here,” she said, and both women laughed.'),
('A las ocho, Clara subió al siguiente tren sin prisa.','At eight, Clara boarded the next train without rushing.'),
('Perdió dos horas, pero ganó una historia que contar.','She lost two hours, but gained a story to tell.')],{
0:[a('llegó','arrived','The preterite llegó presents arriving as a completed event.',grammar={'infinitive':'llegar','tense':'preterite','person':'third-person singular'})],
3:[a('salió','left / departed','Salir has an irregular first-person preterite, but salió follows the regular third-person pattern.',grammar={'infinitive':'salir','tense':'preterite','person':'third-person singular'})],
6:[a('Mientras esperaba','While she was waiting','Mientras plus the imperfect sets the background for another past action.',grammar={'infinitive':'esperar','tense':'imperfect','structure':'mientras + imperfect'})],
8:[a('había vivido','had lived','The pluperfect puts one past situation before another past moment.',grammar={'infinitive':'vivir','tense':'pluperfect','breakdown':[{'part':'había','explanation':'imperfect of haber'},{'part':'vivido','explanation':'past participle of vivir'}]})],
12:[a('ganó una historia','gained a story','Ganar can mean earning or gaining something, not only winning a competition.',kind='expression')]},[
q('Why does Clara stay at the station?',['Her suitcase is lost','She misses her train','Her brother calls her'],1,'The train leaves just as she reaches the door.'),
q('What does the woman give Clara?',['A hotel key','A map','An orange and an address'],2,'She offers an orange and writes an address on Clara’s ticket.'),
q('How does Clara feel when she boards at eight?',['In no hurry','Angry','Afraid'],0,'She boards without rushing, having enjoyed an unexpected conversation.')])

story('la-casa-de-las-cartas','La casa de las cartas','The House of Letters','A2','Human relationships',
'A young woman inherits a bookstore—and a stack of letters addressed to strangers.','Imperfect vs preterite',['Indirect object pronouns','Past habits'],110,
'Dusty independent bookstore in Bogotá with golden window light, handwritten letters, green plants',[
('Cuando Inés era niña, pasaba los sábados en la librería de su abuelo.','When Inés was a child, she spent Saturdays in her grandfather’s bookstore.'),
('El local olía a papel viejo y siempre sonaba música suave.','The shop smelled of old paper, and soft music was always playing.'),
('Después de muchos años, su abuelo murió y le dejó la librería.','After many years, her grandfather died and left her the bookstore.'),
('Inés volvió una tarde de otoño para limpiar y decidir qué hacer.','Inés returned one autumn afternoon to clean and decide what to do.'),
('Detrás de una estantería encontró una caja llena de cartas sin enviar.','Behind a bookshelf, she found a box full of unsent letters.'),
('Cada carta tenía un nombre, una dirección y una pequeña historia.','Each letter had a name, an address, and a small story.'),
('En una, su abuelo daba las gracias a un vecino que le prestó dinero cuando abrió la tienda.','In one, her grandfather thanked a neighbor who had lent him money when he opened the shop.'),
('En otra, pedía perdón a una amiga por una discusión muy antigua.','In another, he apologized to a friend for an argument long ago.'),
('Inés leyó las cartas durante toda la noche y comprendió algo importante.','Inés read the letters all night and understood something important.'),
('Para su abuelo, la librería no era solamente un negocio: era un lugar de encuentros.','For her grandfather, the bookstore was not just a business: it was a place for people to meet.'),
('Al día siguiente, Inés buscó los nombres en una guía antigua y salió con los sobres.','The next day, Inés looked up the names in an old directory and went out with the envelopes.'),
('Algunos vecinos ya no vivían allí, pero otros la recibieron con abrazos y recuerdos.','Some neighbors no longer lived there, but others welcomed her with hugs and memories.'),
('Esa semana decidió abrir la librería otra vez, con una mesa especial para escribir cartas.','That week she decided to reopen the bookstore, with a special table for writing letters.')],{
0:[a('era niña','was a child','The imperfect describes a background state or ongoing period in the past.',grammar={'infinitive':'ser','tense':'imperfect'})],
2:[a('le dejó','left her','Le is an indirect object pronoun: the bookstore was left to her.',grammar={'infinitive':'dejar','tense':'preterite','pronouns':'le = to her'})],
4:[a('encontró','found','The preterite marks the discovery as a specific completed action.',grammar={'infinitive':'encontrar','tense':'preterite','person':'third-person singular'})],
7:[a('pedía perdón','was asking for forgiveness','Pedir perdón is the natural Spanish expression for apologizing.',kind='expression',grammar={'infinitive':'pedir','tense':'imperfect'})],
12:[a('decidió abrir','decided to open','After decidir, use the infinitive to name the intended action.',grammar={'structure':'decidir + infinitive'})]},[
q('What does Inés inherit?',['A café','A bookstore','A house'],1,'Her grandfather leaves her his bookstore.'),
q('What does she find behind a shelf?',['Old photographs','A box of letters','A hidden doorway'],1,'She discovers letters her grandfather never sent.'),
q('What does Inés decide to do?',['Sell everything','Leave the city','Reopen the bookstore'],2,'She reopens the shop and adds a table for writing letters.')])

story('la-habitacion-doce','La habitación doce','Room Twelve','B1','Mystery',
'At a quiet seaside hotel, a guest discovers that one locked room has a story nobody agrees on.','Past narration · imperfect, preterite and pluperfect',['Reported speech','Conditional','Subjunctive after doubt'],255,
'Moody seaside boutique hotel at night in Galicia with dark corridors brass room number twelve and ocean mist',[
('El hotel Miramar estaba casi vacío cuando Daniel llegó al pueblo, una noche de noviembre.','The Miramar Hotel was nearly empty when Daniel arrived in town one November night.'),
('Había viajado hasta la costa para ordenar las fotografías que su padre le dejó después de morir.','He had traveled to the coast to sort through the photographs his father left him after his death.'),
('Su padre había sido fotógrafo y, durante años, había visitado aquel hotel en invierno.','His father had been a photographer and had visited that hotel in winter for years.'),
('La recepcionista, una mujer llamada Rosa, le entregó la llave de la habitación once y le deseó buenas noches.','The receptionist, a woman named Rosa, handed him the key to room eleven and wished him good night.'),
('Mientras subía las escaleras, Daniel observó que la puerta de la habitación doce no tenía número.','As he climbed the stairs, Daniel noticed that the door to room twelve had no number.'),
('En su lugar había una marca rectangular, más clara que el resto de la madera.','In its place was a rectangular mark, lighter than the rest of the wood.'),
('Esa madrugada, un sonido lo despertó: alguien arrastraba una silla al otro lado de la pared.','That night, a sound woke him: someone was dragging a chair on the other side of the wall.'),
('Daniel esperó unos minutos y salió al pasillo, pero todas las luces estaban apagadas.','Daniel waited a few minutes and stepped into the hallway, but all the lights were off.'),
('A la mañana siguiente le preguntó a Rosa si alguien dormía en la habitación contigua.','The next morning he asked Rosa whether someone was sleeping in the adjoining room.'),
('«Allí no se hospeda nadie desde hace muchos años», respondió ella sin levantar la vista.','“No one has stayed there for many years,” she replied without looking up.'),
('Daniel no sabía si creerle, aunque tampoco quería parecer un huésped difícil.','Daniel did not know whether to believe her, although he did not want to seem like a difficult guest.'),
('Más tarde encontró una fotografía de su padre: mostraba el hotel, el mar y una joven junto a la ventana del segundo piso.','Later he found one of his father’s photographs: it showed the hotel, the sea, and a young woman beside a second-floor window.'),
('En el reverso alguien había escrito: «Clara, habitación doce, febrero de 1987».','On the back someone had written: “Clara, room twelve, February 1987.”'),
('Daniel llevó la fotografía al comedor, donde Rosa estaba colocando flores en una mesa.','Daniel took the photograph to the dining room, where Rosa was arranging flowers on a table.'),
('Al verla, la mujer se quedó inmóvil y después se sentó frente a él.','When she saw it, the woman froze and then sat down across from him.'),
('Le explicó que Clara era su hermana y que había desaparecido durante una tormenta, sin dejar ninguna nota.','She explained that Clara was her sister and had disappeared during a storm, leaving no note.'),
('Durante décadas, Rosa había mantenido cerrada su antigua habitación porque temía olvidar su voz.','For decades, Rosa had kept her sister’s former room closed because she feared forgetting her voice.'),
('Daniel miró otra vez la foto y descubrió un detalle que antes no había visto.','Daniel looked at the photograph again and discovered a detail he had not noticed before.'),
('Sobre la mesa, detrás de Clara, había una pequeña grabadora con una cinta puesta.','On the table, behind Clara, there was a small tape recorder with a cassette inside.'),
('Rosa abrió un cajón, sacó una caja y encontró una cinta con la misma fecha.','Rosa opened a drawer, took out a box, and found a cassette with the same date.'),
('No era una respuesta a todo, pero por primera vez tenían algo que podían escuchar juntas: una voz que seguía allí.','It did not explain everything, but for the first time they had something they could listen to together: a voice that was still there.'),
('Cuando Daniel regresó a su cuarto, la puerta doce tenía de nuevo su número de latón.','When Daniel returned to his room, door twelve once again bore its brass number.')],{
1:[a('Había viajado','had traveled','The pluperfect describes travel completed before the story’s main past timeline.',grammar={'infinitive':'viajar','tense':'pluperfect','breakdown':[{'part':'Había','explanation':'imperfect of haber'},{'part':'viajado','explanation':'past participle of viajar'}]})],
4:[a('Mientras subía','While he was going up','The imperfect subía sets an ongoing scene; observó is the interruption.',grammar={'infinitive':'subir','tense':'imperfect','structure':'mientras + imperfect, preterite'})],
9:[a('sin levantar la vista','without looking up','Sin followed by an infinitive describes how an action happens.',grammar={'structure':'sin + infinitive'})],
10:[a('si creerle','whether to believe her','Si introduces an indirect yes/no question. Le refers to Rosa.',grammar={'structure':'si + infinitive','pronouns':'le = her'})],
15:[a('había desaparecido','had disappeared','This event occurred before Rosa told Daniel the story.',grammar={'infinitive':'desaparecer','tense':'pluperfect'})],
16:[a('temía olvidar','was afraid of forgetting','Temer plus infinitive expresses fear of an action.',grammar={'structure':'temer + infinitive'})],
17:[a('antes no había visto','had not seen before','The pluperfect connects an earlier lack of noticing with a later discovery.',grammar={'infinitive':'ver','tense':'pluperfect'})],
20:[a('seguía allí','was still there','Seguir expresses continuation; aquí the voice continues to exist in the recording.',grammar={'infinitive':'seguir','tense':'imperfect'},tip='Seguir + gerund means “to keep doing something.” Here seguir stands alone.')]
},[
q('Why does Daniel come to the coast?',['To take a job','To organize his father’s photographs','To buy the hotel'],1,'He comes to sort through the photographs his late father left behind.'),
q('Who is Clara?',['Rosa’s sister','The receptionist’s daughter','Daniel’s mother'],0,'Rosa explains that Clara was her sister.'),
q('What new clue appears in the photograph?',['A handwritten map','A cassette recorder','A second hotel'],1,'Daniel notices a tape recorder behind Clara in the old photograph.')])

story('cuando-volvio-la-luz','Cuando volvió la luz','When the Lights Came Back','B1','Human relationships · Light suspense',
'A citywide blackout reveals the lives behind the doors of one apartment building.','Past contrasts · imperfect, preterite and reported speech',['Por vs para','Conditional','Relative clauses'],262,
'Old Buenos Aires apartment courtyard during night power outage, candlelight glowing balconies neighbors talking',[
('A las nueve y cuarto, todas las luces del edificio se apagaron al mismo tiempo.','At nine fifteen, every light in the building went out at once.'),
('Sofía estaba preparando una presentación para el trabajo cuando su computadora dejó de funcionar.','Sofía was preparing a presentation for work when her computer stopped working.'),
('Durante unos segundos esperó a que regresara la electricidad, pero la pantalla permaneció oscura.','For a few seconds she waited for the power to come back, but the screen stayed dark.'),
('Desde la calle llegaban bocinas, voces y el ruido de un autobús que no podía avanzar.','From the street came car horns, voices, and the noise of a bus that could not move forward.'),
('Sofía salió al pasillo con la linterna del teléfono y encontró a su vecino del tercero sentado en las escaleras.','Sofía went into the hallway with her phone flashlight and found her third-floor neighbor sitting on the stairs.'),
('Se llamaba Julián y vivía allí desde hacía ocho años, aunque apenas se habían saludado.','His name was Julián, and he had lived there for eight years, although they had barely greeted one another.'),
('«El ascensor no funciona y mi madre está arriba», explicó, señalando el quinto piso.','“The elevator isn’t working, and my mother is upstairs,” he explained, pointing to the fifth floor.'),
('Sofía se ofreció a acompañarlo, y subieron despacio para no tropezar con los escalones.','Sofía offered to accompany him, and they climbed slowly so they would not trip on the steps.'),
('En el cuarto piso encontraron a una niña que sostenía una vela y buscaba a su gato.','On the fourth floor they found a girl holding a candle and looking for her cat.'),
('Los tres escucharon un maullido detrás de una puerta y descubrieron al animal escondido entre unas cajas.','The three heard a meow behind a door and discovered the animal hiding among some boxes.'),
('Cuando llegaron al quinto, la madre de Julián ya había preparado té con el agua caliente que quedaba en una tetera.','When they reached the fifth floor, Julián’s mother had already made tea with the hot water left in a kettle.'),
('Los invitó a entrar, y pronto aparecieron otros vecinos con galletas, velas y noticias del barrio.','She invited them in, and soon other neighbors appeared with cookies, candles, and neighborhood news.'),
('Una arquitecta contó que el apagón afectaba a varias calles; un estudiante ofreció compartir su radio de pilas.','An architect said the blackout affected several streets; a student offered to share his battery-powered radio.'),
('Al principio todos hablaban del problema, pero después empezaron a hablar de ellos mismos.','At first everyone talked about the problem, but later they began talking about themselves.'),
('Sofía descubrió que Julián tocaba el violín, que la arquitecta había vivido en Lima y que la niña escribía historias de detectives.','Sofía discovered that Julián played the violin, the architect had lived in Lima, and the girl wrote detective stories.'),
('Nadie miraba una pantalla y, sin embargo, la conversación parecía avanzar más rápido que cualquier mensaje.','Nobody was looking at a screen, and yet the conversation seemed to move faster than any message.'),
('A las once volvió la electricidad y las lámparas se encendieron, una detrás de otra.','At eleven the electricity returned, and the lamps came on, one after another.'),
('Los vecinos guardaron sus cosas y se despidieron, pero nadie se apresuró a cerrar la puerta.','The neighbors put away their things and said goodbye, but nobody hurried to close the door.'),
('A la mañana siguiente, Sofía bajó por las escaleras en lugar de tomar el ascensor.','The following morning, Sofía went down the stairs instead of taking the elevator.'),
('En el segundo piso se cruzó con Julián, que llevaba un pequeño cartel escrito a mano.','On the second floor she ran into Julián, who was carrying a small handwritten sign.'),
('Decía: «Viernes, ocho de la noche: té en la azotea. No hace falta que se vaya la luz».','It said: “Friday, eight in the evening: tea on the rooftop. The power doesn’t have to go out.”'),
('Sofía sonrió, cambió el rumbo y fue a comprar galletas para el viernes.','Sofía smiled, changed direction, and went to buy cookies for Friday.')],{
1:[a('estaba preparando','was preparing','Estar in the imperfect with a gerund presents an action in progress when another event interrupted.',grammar={'infinitive':'preparar','tense':'imperfect progressive','structure':'estar (imperfect) + gerund'})],
2:[a('a que regresara','for it to return','Esperar a que often takes the subjunctive when the awaited event is uncertain.',grammar={'infinitive':'regresar','mood':'imperfect subjunctive','structure':'esperar a que + subjunctive'})],
5:[a('desde hacía ocho años','for eight years','Desde hacía describes how long something had already been true at a point in the past.',grammar={'structure':'desde hacía + duration'})],
7:[a('para no tropezar','so as not to trip','Para + infinitive expresses purpose; the no comes before the infinitive.',grammar={'structure':'para + no + infinitive'})],
10:[a('ya había preparado','had already made','The pluperfect tells us the tea was prepared before they arrived.',grammar={'infinitive':'preparar','tense':'pluperfect'})],
15:[a('sin embargo','however / nevertheless','A connector that introduces a contrast between what came before and what follows.',kind='expression')],
18:[a('en lugar de','instead of','En lugar de followed by an infinitive introduces an alternative action.',grammar={'structure':'en lugar de + infinitive'})],
20:[a('No hace falta que','There is no need for','With a new subject, hacer falta que leads to a subjunctive verb.',grammar={'structure':'hacer falta que + subjunctive'})]
},[
q('Why do Sofía and Julián go upstairs?',['To find a lost phone','To check on Julián’s mother','To restart the electricity'],1,'Julián’s mother is on the fifth floor, and the elevator is not working.'),
q('What happens when the neighbors gather?',['They begin to know one another','They argue about the electricity','They leave the building'],0,'Their conversation shifts from the blackout to their lives.'),
q('What does Julián’s sign announce?',['A building meeting','A rooftop tea gathering','A violin concert'],1,'It invites neighbors to tea on Friday, even without a blackout.')])
