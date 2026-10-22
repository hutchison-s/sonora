import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseStories } from '../lib/content/schema';

const storyDir = resolve(process.cwd(), 'content/stories');
const filenames = readdirSync(storyDir).filter(f => f.endsWith('.json')).sort();
if (filenames.length === 0) throw new Error('No story files were found.');
try {
  const stories = parseStories(filenames.map(f => JSON.parse(readFileSync(resolve(storyDir, f), 'utf8'))));
  for (const story of stories) {
    if (story.narration.status === 'ready' && !existsSync(resolve(process.cwd(), 'public', story.narration.audioUrl.slice(1)))) {
      throw new Error(`${story.id}: narration marked ready but ${story.narration.audioUrl} does not exist`);
    }
    if (!existsSync(resolve(process.cwd(), 'public', story.coverImage.slice(1)))) {
      throw new Error(`${story.id}: missing cover image ${story.coverImage}`);
    }
    console.info(`✓ ${story.title.es} (${story.level}, ${story.wordCount} words, ${story.sentences.length} sentences)`);
  }
  console.info(`Validated ${stories.length} stories.`);
} catch (error) {
  console.error('Story validation failed:', error);
  process.exitCode = 1;
}
