// Calculate compact layout positions for all demo board entities
// Grid: 3 columns x 2 rows + Ops row

const COL_SPACING = 1800;
const ROW_SPACING = 1400;

// Cluster origins (top-left of team card)
const clusters = {
  eng_core:    { col: -1, row: 0 },  // left, top
  product:     { col: 0,  row: 0 },  // center, top
  marketing:   { col: 1,  row: 0 },  // right, top
  eng_mobile:  { col: -1, row: 1 },  // left, bottom
  cs:          { col: 0,  row: 1 },  // center, bottom
  sales:       { col: 1,  row: 1 },  // right, bottom
  ops:         { col: 0,  row: 2 },  // center, extra row
};

// Team dimensions
const TEAM_W = 500, TEAM_H = 300;
const PERSON_W = 280, PERSON_H = 100;
const EVIDENCE_W = 200, EVIDENCE_H = 120;
const GAP = 20;

// People per team
const people = {
  eng_core: ['p_eng_1','p_eng_2','p_eng_3','p_eng_4','p_eng_5','p_eng_6','p_eng_7','p_eng_8'],
  eng_mobile: ['p_mob_1','p_mob_2','p_mob_3','p_mob_4','p_mob_5'],
  product: ['p_prod_1','p_prod_2','p_prod_3','p_prod_4','p_prod_5'],
  marketing: ['p_mkt_1','p_mkt_2','p_mkt_3','p_mkt_4'],
  sales: ['p_sal_1','p_sal_2','p_sal_3','p_sal_4','p_sal_5'],
  cs: ['p_cs_1','p_cs_2','p_cs_3','p_cs_4'],
  ops: ['p_ops_1','p_ops_2','p_ops_3','p_ops_4'],
};

// Evidence per team (by speaker's team)
const evidence = {
  eng_core: ['ev_rob_1','ev_carla_1','ev_amanda_1','ev_fernando_1','ev_marcos_1','ev_juliana_1','ev_lucas_1','ev_sofia_1'],
  eng_mobile: ['ev_diego_1','ev_beatriz_1','ev_thiago_1','ev_larissa_1','ev_pedro_1'],
  product: ['ev_camila_1','ev_rafael_1','ev_mariana_1','ev_joao_1','ev_leticia_1'],
  marketing: ['ev_gabriel_1','ev_isabela_1','ev_felipe_1','ev_natalia_1'],
  sales: ['ev_rodrigo_1','ev_vanessa_1','ev_eduardo_1','ev_patricia_1','ev_andre_1'],
  cs: ['ev_carolina_1','ev_bruno_1','ev_aline_1','ev_marcelo_1'],
  ops: ['ev_ricardo_1','ev_fernanda_1','ev_tiago_1','ev_claudia_1'],
};

const teamIds = {
  eng_core: 'team_eng_core',
  eng_mobile: 'team_eng_mobile',
  product: 'team_product',
  marketing: 'team_marketing',
  sales: 'team_sales',
  cs: 'team_cs',
  ops: 'team_ops',
};

const results = {};

for (const [key, pos] of Object.entries(clusters)) {
  const cx = pos.col * COL_SPACING; // center of column
  const ry = pos.row * ROW_SPACING - 500; // top of row (offset so row 0 starts near y=-500)

  // Team: centered in column
  const teamX = cx - TEAM_W / 2;
  const teamY = ry;
  results[teamIds[key]] = { x: teamX, y: teamY };

  // People: 2 columns centered, below team
  const pCols = 2;
  const pTotalW = pCols * PERSON_W + (pCols - 1) * GAP; // 580
  const pStartX = cx - pTotalW / 2;
  const pStartY = teamY + TEAM_H + 30;

  const pList = people[key];
  pList.forEach((pid, i) => {
    const col = i % pCols;
    const row = Math.floor(i / pCols);
    results[pid] = {
      x: pStartX + col * (PERSON_W + GAP),
      y: pStartY + row * (PERSON_H + GAP),
    };
  });

  // Evidence: 3 columns centered, below people
  const pRows = Math.ceil(pList.length / pCols);
  const eCols = 3;
  const eTotalW = eCols * EVIDENCE_W + (eCols - 1) * GAP; // 640
  const eStartX = cx - eTotalW / 2;
  const eStartY = pStartY + pRows * (PERSON_H + GAP) + 30;

  const eList = evidence[key];
  eList.forEach((eid, i) => {
    const col = i % eCols;
    const row = Math.floor(i / eCols);
    results[eid] = {
      x: eStartX + col * (EVIDENCE_W + GAP),
      y: eStartY + row * (EVIDENCE_H + GAP),
    };
  });
}

// Note: centered above everything
results['note_origo'] = { x: -250, y: -900 };

// Print results grouped
console.log('=== TEAM POSITIONS ===');
for (const [k, v] of Object.entries(results).filter(([k]) => k.startsWith('team_'))) {
  console.log(`${k}: x=${v.x}, y=${v.y}`);
}

console.log('\n=== PERSON POSITIONS ===');
for (const [k, v] of Object.entries(results).filter(([k]) => k.startsWith('p_'))) {
  console.log(`${k}: x=${v.x}, y=${v.y}`);
}

console.log('\n=== EVIDENCE POSITIONS ===');
for (const [k, v] of Object.entries(results).filter(([k]) => k.startsWith('ev_'))) {
  console.log(`${k}: x=${v.x}, y=${v.y}`);
}

console.log('\n=== NOTE POSITION ===');
console.log(`note_origo: x=${results['note_origo'].x}, y=${results['note_origo'].y}`);

// Output as JSON for easy consumption
console.log('\n=== JSON ===');
console.log(JSON.stringify(results, null, 2));
