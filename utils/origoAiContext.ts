import { CanvasItem, TeamItem, PersonItem, EvidenceItem } from '../types';

export const serializeBoardForOrigo = (items: CanvasItem[]) => {
    const teams = items.filter(i => i.type === 'TEAM') as TeamItem[];
    const people = items.filter(i => i.type === 'PERSON') as PersonItem[];
    const evidences = items.filter(i => i.type === 'EVIDENCE') as EvidenceItem[];

    return {
        meta: {
            generatedAt: new Date().toISOString(),
            totalItems: items.length,
            methodology: "Origo Systemic Synthesis v1.0"
        },
        teams: teams.map(t => ({
            id: t.id,
            name: t.title,
            description: t.description,
            linkedTeams: t.linkedTeamIds || []
        })),
        people: people.map(p => ({
            id: p.id,
            name: p.title,
            role: p.role,
            teamId: p.teamId,
            skills: p.skills || []
        })),
        evidences: evidences.map(e => ({
            id: e.id,
            title: e.title,
            content: e.content,
            source: e.source,
            sentiment: e.sentiment,
            linkedEntities: e.linkedEntityIds || []
        }))
    };
};
