import cafe from '@/content/stories/el-ultimo-cafe.json';
import llave from '@/content/stories/la-llave-azul.json';
import tren from '@/content/stories/el-tren-de-las-seis.json';
import cartas from '@/content/stories/la-casa-de-las-cartas.json';
import habitacion from '@/content/stories/la-habitacion-doce.json';
import luz from '@/content/stories/cuando-volvio-la-luz.json';
import { parseStories } from './schema';

export const stories = parseStories([llave, cafe, tren, cartas, habitacion, luz]);
export const getStory = (id: string) => stories.find(story => story.id === id);
