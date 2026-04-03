const fs = require('fs');
let f = fs.readFileSync('apps/frontend/src/pages/bounties/BountyBoardPage.tsx', 'utf8');
f = f.replace(/import React /, 'import ');
fs.writeFileSync('apps/frontend/src/pages/bounties/BountyBoardPage.tsx', f);
