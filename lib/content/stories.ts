import cafe from '@/content/stories/el-ultimo-cafe.json';
import llave from '@/content/stories/la-llave-azul.json';
import tren from '@/content/stories/el-tren-de-las-seis.json';
import cartas from '@/content/stories/la-casa-de-las-cartas.json';
import habitacion from '@/content/stories/la-habitacion-doce.json';
import luz from '@/content/stories/cuando-volvio-la-luz.json';
import mapa from '@/content/stories/el-mapa-en-la-pared.json';
import ultimoTren from '@/content/stories/el-ultimo-tren.json';
import mesa from '@/content/stories/la-mesa-para-dos.json';
import mensaje from '@/content/stories/un-mensaje-equivocado.json';
import marcas from '@/content/stories/las-marcas-del-agua.json';
import { parseStories } from './schema';

export const stories = parseStories([llave, cafe, mapa, ultimoTren, mesa, mensaje, tren, cartas, habitacion, luz, marcas]);
export const getStory = (id: string) => stories.find(story => story.id === id);
