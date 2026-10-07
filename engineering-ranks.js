const RANK_STORAGE_KEY='mars-mission-engineering-ranks-v1';
const COMPLETED_MISSIONS_KEY='mars-mission-completed-designs-v1';
let completedRanks=[];
let completedMissions=Object.create(null);
try{const saved=JSON.parse(localStorage.getItem(RANK_STORAGE_KEY)||'[]');if(Array.isArray(saved))completedRanks=Object.keys(MissionModel.challenges).filter(id=>saved.includes(id))}catch{}
try{const saved=JSON.parse(localStorage.getItem(COMPLETED_MISSIONS_KEY)||'{}');for(const id of Object.keys(MissionModel.challenges)){if(saved?.[id])try{const design=MissionModel.validate(saved[id]);if(design.challenge===id){completedMissions[id]=design;if(!completedRanks.includes(id))completedRanks.push(id)}}catch{}}}catch{}
function isMissionComplete(id){return completedRanks.includes(id)||Boolean(completedMissions[id])}
function persistCompletedMissions(){localStorage.setItem(COMPLETED_MISSIONS_KEY,JSON.stringify(completedMissions));localStorage.setItem(RANK_STORAGE_KEY,JSON.stringify(completedRanks))}
function saveCompletedExplanation(){
 const saved=completedMissions[state.challenge];if(!saved)return;
 // Keep the successful design and source when a student experiments after passing.
 if(saved.code!==state.code||JSON.stringify(saved.objects)!==JSON.stringify(state.objects)||JSON.stringify(saved.route)!==JSON.stringify(state.route))return;
 if(state.challenge==='free'&&!state.scienceQuestion.trim())return;
 for(const key of ['missionName','teamName','scienceQuestion','designNotes'])saved[key]=state[key];persistCompletedMissions();
}
function restoreCompletedEvidence(){
 if(!completedMissions[state.challenge])return;
 try{const run=RoverPython.simulate(state,state.code);if(!run.assessment.success)return;simulation=run;lastCodeEvidence=run;lastTest={mode:'code',visited:[...run.visited],result:'Mission complete',distance:run.distance,energy:run.energy,commands:run.commandsExecuted};$('testBadge').textContent='MISSION COMPLETE';$('missionStatus').textContent='Completed mission restored';$('codeStatus').textContent='Saved successful program restored. You can review or run it again.'}catch{}
}
function startMission(id,force=false){
 if(running||!Object.hasOwn(M.challenges,id))return;
 if(id===state.challenge&&!force){showMissionBriefing();return}
 clearTimeout(saveTimer);save();const team=state.teamName;
 state=completedMissions[id]?clone(completedMissions[id]):M.blank(id);if(!completedMissions[id])state.teamName=team;
 history=[];future=[];drag=null;selected=null;selectedWaypoint=null;armed=null;invalidate();restoreCompletedEvidence();setTool('select');save();render();$('logOutput').replaceChildren();
 log(completedMissions[id]?'Completed mission restored, including your saved design and Python code.':isMissionComplete(id)?'Earlier completion recorded, but this older app version did not save a separate design for this mission. Open a downloaded mission file to recover that design.':'New mission ready. Build your own map and write your program.');showMissionBriefing();
}
function awardEngineeringRank(){
 const id=state.challenge,before=M.curriculumScore(completedRanks);completedMissions[id]=clone(state);if(!completedRanks.includes(id))completedRanks.push(id);
 recordRankCertificates();
 try{persistCompletedMissions();save()}catch{toast('Mission passed. Browser saving is unavailable; download your mission to keep it.')}
 const earned=M.engineeringRank(completedRanks),after=M.curriculumScore(completedRanks),gained=after.total-before.total;log('Mission passed. Design and code saved. '+(gained?'+'+gained+' points · ':'')+after.total+' total points. Engineering rank: '+earned.name+'.','success');if(after.ranks>before.ranks)log('Rank complete! Your certificate is ready in the engineering journey.','success');
}
function renderEngineeringRanks(){
 const earned=M.engineeringRank(completedRanks);$('engineeringRank').textContent=(earned.rank?'Rank '+earned.rank+' · ':'')+earned.name;
 const score=M.curriculumScore(completedRanks);$('rankProgress').textContent=score.missions+' / 12 missions · '+score.ranks+' / 4 ranks complete';$('pointsTotal').textContent=score.total.toLocaleString()+' points';
 $('missionCompletionStar').hidden=!isMissionComplete(state.challenge);
 $('newBtn').textContent=completedMissions[state.challenge]?'★ Reopen completed mission':'＋ Restart this mission';
 const selector=$('challenge');selector.replaceChildren();M.rankOrder.forEach((base,i)=>{const group=document.createElement('optgroup');group.label='Rank '+(i+1)+' · '+M.challenges[base].rankName;M.rankMissions[base].forEach(id=>{const c=M.challenges[id];group.append(new Option((isMissionComplete(id)?'★ ':'')+(i+1)+'.'+c.mission+' · '+c.name+' · '+c.points+' pts',id))});selector.append(group)});selector.add(new Option((isMissionComplete('free')?'★ ':'')+'Open challenge · Mission architect','free'));selector.value=state.challenge;
 const host=$('rankLevels');host.replaceChildren();
 M.rankOrder.forEach((base,i)=>{const progress=M.rankProgress(i+1,completedRanks),card=document.createElement('article');card.className='rank-card'+(M.challenges[state.challenge].rank===i+1?' current':'')+(progress.complete?' passed':'');card.dataset.rank=String(i+1);
 const title=document.createElement('h3');title.textContent=(progress.complete?'★ ':'')+'Rank '+(i+1)+' · '+progress.name;const summary=document.createElement('p');summary.textContent=progress.count+'/3 missions · '+(progress.complete?'550 points earned':M.curriculumScore(progress.done).total+'/550 points');card.append(title,summary);
 progress.missions.forEach(id=>{const c=M.challenges[id],button=document.createElement('button');button.className='course-mission'+(state.challenge===id?' current':'')+(isMissionComplete(id)?' passed':'');button.dataset.mission=id;button.disabled=running;button.setAttribute('aria-pressed',String(state.challenge===id));button.textContent=(isMissionComplete(id)?'★ ':'')+c.mission+'. '+c.name;const points=document.createElement('small');points.textContent=c.points+' pts'+(isMissionComplete(id)?' · completed':'');button.append(points);button.onclick=()=>startMission(id);card.append(button)});
 const certificate=document.createElement('button');certificate.className='certificate-button';certificate.dataset.certificate=String(i+1);certificate.disabled=running||!progress.complete;certificate.textContent=progress.complete?'View / print certificate':'Complete 3 missions for certificate';certificate.onclick=()=>showRankCertificate(i+1);card.append(certificate);host.append(card)});
}
