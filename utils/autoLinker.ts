import { CanvasItem, TeamItem, PersonItem } from '../types';

/**
 * Scans evidence content for mentions of canvas entities (Teams, People)
 * and returns their IDs to be used as linkedEntityIds.
 * Speaker (speakerId) is always included.
 */
export const autoLinkEntities = (
  content: string,
  items: CanvasItem[],
  speakerId?: string
): string[] => {
  const entities = items.filter(
    i => i.type === 'TEAM' || i.type === 'PERSON'
  ) as (TeamItem | PersonItem)[];

  const contentLower = content.toLowerCase();
  const linked = new Set<string>();

  // Speaker is always linked
  if (speakerId) linked.add(speakerId);

  entities.forEach(entity => {
    if (!entity.title) return;

    const titleLower = entity.title.toLowerCase().trim();
    const nameParts = titleLower.split(/\s+/).filter(p => p.length > 2);

    // Full name match
    if (contentLower.includes(titleLower)) {
      linked.add(entity.id);
      return;
    }

    // For people: match if first name OR last name appears (min 4 chars to avoid noise)
    if (entity.type === 'PERSON' && nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      if (
        (firstName.length >= 4 && contentLower.includes(firstName)) ||
        (lastName.length >= 4 && contentLower.includes(lastName))
      ) {
        linked.add(entity.id);
        return;
      }
    }

    // For teams: match key words from team name (min 4 chars)
    if (entity.type === 'TEAM') {
      const matched = nameParts.some(
        part => part.length >= 4 && contentLower.includes(part)
      );
      if (matched) linked.add(entity.id);
    }
  });

  return Array.from(linked);
};
