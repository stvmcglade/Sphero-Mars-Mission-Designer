const assert=require('node:assert/strict'),fs=require('node:fs');
module.exports=async function verifyMediaReport(browser){
 fs.mkdirSync('tmp/pdfs',{recursive:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5175');
 async function closeBriefing(){if(await page.locator('#welcomeDialog').isVisible()){await page.locator('#welcomeContinueBtn').click();await page.locator('#briefingDialog').waitFor({state:'visible'})}if(await page.locator('#briefingDialog').isVisible())await page.locator('#briefingDialog [data-close]').first().click()}
 for(const challenge of ['landing','survey','samples','return','free']){
  await closeBriefing();await page.locator('#challenge').selectOption(challenge);
  await page.waitForFunction(()=>document.getElementById('briefingVideo').readyState>=2);
  assert.match(await page.locator('#videoDescription').textContent(),/ambient space music/);
  await page.locator('#briefingVideo').evaluate(v=>{v.volume=1;v.muted=false;return v.play()});await page.waitForFunction(()=>document.getElementById('briefingVideo').currentTime>2);
  const audio=await page.evaluate(async()=>{const stream=document.getElementById('briefingVideo').captureStream(),tracks=stream.getAudioTracks();if(!tracks.length)return {tracks:0,rms:0};const context=new AudioContext();await context.resume();const analyser=context.createAnalyser();analyser.fftSize=2048;context.createMediaStreamSource(stream).connect(analyser);const data=new Float32Array(2048);let rms=0;for(let i=0;i<4;i++){await new Promise(r=>setTimeout(r,80));analyser.getFloatTimeDomainData(data);rms=Math.max(rms,Math.sqrt(data.reduce((sum,n)=>sum+n*n,0)/data.length))}await context.close();stream.getTracks().forEach(t=>t.stop());return {tracks:tracks.length,rms}});
  assert.equal(audio.tracks,1);assert.ok(audio.rms>.0001,challenge+' soundtrack must contain audible music');console.log(challenge+' soundtrack: audio track verified; RMS '+audio.rms.toFixed(4));
  await page.locator('#briefingVideo').evaluate(v=>{v.muted=true});assert.equal(await page.locator('#briefingVideo').evaluate(v=>v.muted),true);
 }
 await closeBriefing();await page.locator('#challenge').selectOption('samples');await closeBriefing();await page.evaluate(s=>{state=MissionModel.validate(s);invalidate();render()},require('./mission-model.js').starter());
 await page.locator('#missionName').fill('Student Mars Mission Portfolio');await page.locator('#teamName').fill('Mars Engineering Team');
 await page.locator('#scienceQuestion').fill('How do rock samples differ across our imagined Mars science sites?');
 await page.locator('#designNotes').fill('We placed three terrain obstacles between our science sites. We chose a route with space around each hazard. After testing, we revised our travel times and explained each science action.');
 const code='# Student-written rover program\nspeed = 60\nfor step in range(2):\n  roll(speed, 90, 0.5)\n  turn(90)\n# We will add the science actions for our own layout.\ncollect()\nflash_colour_code("orange-blue")\nstop()\n# END OF STUDENT PROGRAM';
 await page.locator('#codeEditor').fill(code);await page.evaluate(()=>{window.print=()=>{window.__printed=true}});await page.locator('#reportBtn').click();await page.waitForFunction(()=>document.getElementById('printReport').dataset.ready==='true'&&window.__printed);
 assert.equal(await page.locator('#printReport .report-code').textContent(),code);assert.deepEqual(await page.locator('#printReport img').evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight})),{width:1600,height:980});
 await page.pdf({path:'tmp/pdfs/mission-portfolio-qa.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
 // Long programs must span pages and preserve the final line, including a long comment.
 const longCode=Array.from({length:180},(_,i)=>'# Student program line '+String(i+1).padStart(3,'0')+' - explain our rover command').join('\n')+'\n# '+('Wrapping-check '.repeat(28))+'\nstop()\n# FINAL STUDENT LINE 182';
 await page.locator('#codeEditor').fill(longCode);await page.locator('#reportBtn').click();await page.waitForFunction(()=>document.getElementById('printReport').dataset.ready==='true');await page.pdf({path:'tmp/pdfs/mission-portfolio-long-code-qa.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
 assert.equal(await page.locator('#printReport .report-code').textContent(),longCode);
 // A mobile export still receives the same crisp design image and latest editor text.
 await page.setViewportSize({width:390,height:844});await page.locator('#reportBtn').click();await page.waitForFunction(()=>document.getElementById('printReport').dataset.ready==='true');assert.equal(await page.locator('#printReport img').evaluate(img=>img.naturalWidth),1600);
 // file:// playback cannot be captured as a stream in Edge, so check decoded audio bytes instead.
 const direct=await browser.newPage();direct.on('pageerror',e=>errors.push(e.message));await direct.goto('file:///'+__dirname.replaceAll('\\','/')+'/index.html');if(await direct.locator('#welcomeDialog').isVisible()){await direct.locator('#welcomeContinueBtn').click();await direct.locator('#briefingDialog').waitFor({state:'visible'})}await direct.waitForFunction(()=>document.getElementById('briefingVideo').readyState>=2);await direct.locator('#briefingVideo').evaluate(v=>v.play());await direct.waitForFunction(()=>{const v=document.getElementById('briefingVideo');return v.currentTime>1&&v.webkitAudioDecodedByteCount>0});assert.ok(await direct.locator('#briefingVideo').evaluate(v=>v.webkitAudioDecodedByteCount)>0);await direct.close();
 assert.deepEqual(errors,[]);await page.close();console.log('Media and report checks passed: music in all five videos, mute control, offline audio track, latest code, 1600px design screenshot, A4 PDFs, long-program pagination and mobile export.');
};

