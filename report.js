function captureDesignImage(){
 const savedSelection=selected,savedWaypoint=selectedWaypoint;
 try{selected=null;selectedWaypoint=null;draw({width:1600,height:980});return canvas.toDataURL('image/png')}
 finally{selected=savedSelection;selectedWaypoint=savedWaypoint;draw()}
}
async function buildMissionReport(){
 const design=clone(state),test=lastTest?{...lastTest}:null;
 const report=$('printReport');report.dataset.ready='false';report.replaceChildren();
 function element(tag,text,className=''){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el}
 function section(host,heading,content,className=''){const el=element('section',undefined,className);el.append(element('h2',heading),element('p',content));host.append(el);return el}
 const header=element('header',undefined,'report-header');header.append(element('p','MARS MISSION DESIGN LAB / STUDENT PORTFOLIO','report-kicker'),element('h1',(isMissionComplete(design.challenge)?'★ ':'')+(design.missionName.trim()||'Mars mission proposal')),element('p','Student / team: '+(design.teamName.trim()||'Name not entered')));report.append(header);
 const overview=element('div',undefined,'report-overview');report.append(overview);
 const level=M.challenges[design.challenge],rank=M.engineeringRank(completedRanks),score=M.curriculumScore(completedRanks);section(overview,'Mission challenge',(level.rank?'Rank '+level.rank+' · Mission '+level.mission+'/3 · '+level.name+'\n':'Open challenge · Mission Architect\n')+level.brief);section(overview,'Engineering rank',rank.name+' · '+score.total+' points · '+score.missions+'/12 missions · '+score.ranks+'/4 ranks complete'+(lastCodeEvidence&&M.assessCode(design,lastCodeEvidence).success?'\nThis design passed its Python mission checks.':'\nThis design still needs a successful Python demonstration.'));
 const figure=element('figure',undefined,'report-design');figure.append(element('h2','Mission design screenshot'));
 const image=element('img');image.alt='Student Mars mission design showing placed equipment, terrain obstacles and rover routes';image.src=captureDesignImage();figure.append(image,element('figcaption','Design captured for this proposal. Dashed line: planned route. Solid line: latest coded traverse.'));overview.append(figure);
 const resources='Build credits: '+M.budget(design)+' / 1,000 | Terrain obstacles: '+M.obstacleCount(design)+' / '+M.challenges[design.challenge].minObstacles+' minimum\nPlanned route: '+Math.round(M.length(design))+' map units | Planned energy: '+M.energy(design)+' / '+(level.energyLimit||100)+'\nLatest test: '+(test?.result||(running?'Test in progress':'Awaiting code test'))+(test?.mode==='code'?'\nActual code run: '+Math.round(test.distance)+' map units | '+test.energy+' / '+(level.energyLimit||100)+' energy | '+test.commands+' commands':'');
 section(overview,'Mission resources and testing',resources,'report-resources');
 section(overview,'Our science question',design.scienceQuestion.trim()||'Not yet written.');
 section(overview,'Our engineering decisions',design.designNotes.trim()||'Not yet written.');
 const program=element('div',undefined,'report-program');program.append(element('h2','Our Python rover program'),element('p','Student-written program, including comments and indentation.','report-caption'),element('pre',design.code||'# No program written yet.','report-code'));report.append(program);
 const checks=lastCodeEvidence?M.assessCode(design,lastCodeEvidence).goals:[...M.analyze(design).goals,{text:'Demonstrate your mission with a successful Python run',pass:false}];
 section(program,lastCodeEvidence?'Python demonstration checks':'Design checklist (code not yet demonstrated)',checks.map(g=>(g.pass?'PASS: ':'STILL NEEDED: ')+g.text).join('\n'));
 const inventory=element('section',undefined,'report-inventory');inventory.append(element('h2','Placed equipment and obstacles'));
 const table=element('table'),head=element('thead'),heading=element('tr');['Object','Type','Position (X, Y)','Credits'].forEach(text=>heading.append(element('th',text)));head.append(heading);table.append(head);const body=element('tbody');design.objects.forEach(o=>{const row=element('tr');[o.label,M.catalog[o.type].name,Math.round(o.x)+', '+Math.round(o.y),M.catalog[o.type].cost].forEach(text=>row.append(element('td',text)));body.append(row)});table.append(body);inventory.append(table);program.append(inventory);
 section(program,'Planned flight path',design.route.map((p,i)=>(i+1)+'. '+Math.round(p.x)+', '+Math.round(p.y)).join('\n')||'No planned waypoints. The Python program controls the rover directly.');
 report.append(element('p','Independent classroom simulation. Imagined Mars terrain and simplified build credits, energy and mission actions.','report-footnote'));
 // Ensure the screenshot is decoded before the browser prepares its print pages.
 await image.decode();if(document.fonts?.ready)await document.fonts.ready;report.dataset.ready='true';return report;
}

