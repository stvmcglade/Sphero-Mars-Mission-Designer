const fs=require('node:fs');function edit(file,from,to){const s=fs.readFileSync(file,'utf8');if(!s.includes(from))throw Error('Missing text in '+file);fs.writeFileSync(file,s.replace(from,to))}
edit('index.html','<input id="missionName" aria-label="Mission name" maxlength="60" value="Red Planet Pathfinder">','<div class="mission-name-row"><input id="missionName" aria-label="Mission name" maxlength="60" value="My Mars Mission"><span id="missionCompletionStar" class="completion-star" role="img" aria-label="Completed mission" title="Completed mission — design and code saved" hidden>★</span></div>');
edit('index.html','<button id="newBtn" class="quiet-button full">＋ New / starter mission</button>','<button id="newBtn" class="quiet-button full">＋ Restart this mission</button>');
edit('index.html','Progress saves in this browser.</p></section>','Completed missions keep their design and code in this browser. ★ marks a completed mission.</p></section>');
edit('index.html',fs.readFileSync('index.html','utf8').split(/\r?\n/).find(line=>line.startsWith('<dialog id="newDialog">')),'');
edit('app.js',"$('challengeTitle').textContent=challenge.title;","$('challengeTitle').textContent=(isMissionComplete(state.challenge)?'★ ':'')+challenge.title;");
edit('app.js',"$('briefingTitle').textContent=(c.rank?","$('briefingTitle').textContent=(isMissionComplete(state.challenge)?'★ ':'')+(c.rank?");
edit('engineering-ranks.js',"number.textContent=completedRanks.includes(id)?'★':","number.textContent=completedRanks.includes(id)?'✓':");
edit('report.js',"element('h1',design.missionName.trim()||'Mars mission proposal')","element('h1',(isMissionComplete(design.challenge)?'★ ':'')+(design.missionName.trim()||'Mars mission proposal'))");
edit('report.js',"completedRanks.length+'/4 levels passed in this browser'","M.rankOrder.filter(isMissionComplete).length+'/4 levels passed in this browser'");
edit('verify-ranks.cjs',"await page.locator('#newBtn').click();await page.locator('#starterBtn').click();","await page.locator('#newBtn').click();");
console.log('Completed mission stars and start controls updated.');
