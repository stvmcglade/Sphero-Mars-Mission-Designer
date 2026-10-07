const {chromium}=require('C:/Users/09024076/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('./mission-model.js');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 if(process.argv.includes('--curriculum')){await require('./verify-curriculum.cjs')(browser);return}
 if(process.argv.includes('--welcome')){await require('./verify-welcome.cjs')(browser);return}
 if(process.argv.includes('--mission-storage')){await require('./verify-mission-storage.cjs')(browser);return}
 if(process.argv.includes('--ranks')){await require('./verify-ranks.cjs')(browser);return}
 if(process.argv.includes('--media-report')){await require('./verify-media-report.cjs')(browser);return}
 const page=await browser.newPage({viewport:{width:1440,height:1100},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(s=>{if(!localStorage.getItem('mars-mission-design-lab-v1'))localStorage.setItem('mars-mission-design-lab-v1',JSON.stringify(s))},M.starter());
 await page.goto('http://localhost:5175');if(await page.locator('#welcomeDialog').isVisible()){await page.locator('#welcomeContinueBtn').click();await page.locator('#briefingDialog').waitFor({state:'visible'})}await page.waitForSelector('.inventory-card');
 async function closeBriefing(){if(await page.locator('#briefingDialog').isVisible())await page.locator('#briefingDialog [data-close]').first().click()}
 async function loadStarter(){await page.locator('#importFile').setInputFiles({name:'starter-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(M.starter()))});await page.waitForFunction(()=>state.objects.length===9&&state.route.length===0);await closeBriefing()}
 assert.equal(await page.locator('#briefingDialog').isVisible(),true);
 assert.match(await page.locator('#videoExampleNotice').textContent(),/create your own mission/);
 assert.match(await page.locator('#briefingGoals').textContent(),/at least 3 terrain obstacles/);
 await page.waitForFunction(()=>document.getElementById('briefingVideo').readyState>=2);
 console.log('Opening video metadata:',await page.locator('#briefingVideo').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight})));
 await page.locator('#briefingVideo').evaluate(v=>v.play());await page.waitForFunction(()=>document.getElementById('briefingVideo').currentTime>.2);
 await page.screenshot({path:'preview-briefing.png'});await closeBriefing();
 assert.equal(await page.locator('.inventory-card').count(),12);
 await page.screenshot({path:'preview-desktop.png',fullPage:true});
 async function point(x,y){return page.evaluate(({x,y})=>{const p=worldToCanvas({x,y}),rect=document.getElementById('arenaCanvas').getBoundingClientRect();return {x:p.x+rect.left,y:p.y+rect.top}},{x,y})}
 async function clickMap(x,y){await page.locator('#arenaCanvas').scrollIntoViewIfNeeded();const p=await point(x,y);await page.mouse.click(p.x,p.y)}
 await page.locator('[data-type="sensor"]').click();await clickMap(460,160);assert.equal(await page.locator('#objectSelect option').count(),11);
 const sensor=await page.locator('#objectSelect').inputValue();await page.locator('#objectName').fill('Atmosphere station');await page.locator('#objectName').press('Tab');
 await page.locator('#objectX').fill('500');await page.locator('#objectX').press('Tab');assert.equal(await page.locator('#objectX').inputValue(),'500');
 await page.locator('#arenaCanvas').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#objectX').inputValue(),'510');
 await page.locator('#duplicateBtn').click();assert.equal(await page.locator('#objectSelect option').count(),12);await page.locator('#deleteBtn').click();assert.equal(await page.locator('#objectSelect option').count(),11);await page.locator('#undoBtn').click();assert.equal(await page.locator('#objectSelect option').count(),12);await page.locator('#redoBtn').click();assert.equal(await page.locator('#objectSelect option').count(),11);
 // Real pointer drag moves the placed object.
 await page.locator('#arenaCanvas').scrollIntoViewIfNeeded();const start=await point(510,160),end=await point(560,180);await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:8});await page.mouse.up();assert.equal(await page.locator('#objectX').inputValue(),'560');
 // Native HTML drag from palette to canvas creates an object.
 const dust=page.locator('[data-type="dust"]'),dustBox=await dust.boundingBox(),drop=await point(760,120);await page.mouse.move(dustBox.x+dustBox.width/2,dustBox.y+dustBox.height/2);await page.mouse.down();await page.mouse.move(drop.x,drop.y,{steps:20});await page.mouse.up();assert.equal(await page.locator('#objectSelect option').count(),12);
 // JSON export, reload persistence, and import replace a design safely.
 const downloadPromise=page.waitForEvent('download');await page.locator('#exportBtn').click();const download=await downloadPromise;await download.saveAs('browser-test-mission.json');M.validate(JSON.parse(fs.readFileSync('browser-test-mission.json','utf8')));
 await page.reload();await closeBriefing();assert.equal(await page.locator('#objectSelect option').count(),12);await page.locator('#newBtn').click();await closeBriefing();assert.equal(await page.locator('#objectSelect option').count(),1);await page.locator('#importFile').setInputFiles('browser-test-mission.json');await page.waitForFunction(()=>document.getElementById('objectSelect').options.length===12);await closeBriefing();
 await loadStarter();assert.equal(await page.locator('#objectSelect option').count(),10);
 // A full successful expedition is built entirely with route clicks.
 await page.locator('#routeTool').click();for(const [x,y] of [[340,440],[350,230],[690,230],[825,410],[840,555]])await clickMap(x,y);
 assert.equal(await page.locator('.waypoint-chip').count(),5);assert.match(await page.locator('#readiness').textContent(),/Flight plan ready/);
 await page.locator('#runBtn').click();await page.waitForFunction(()=>document.getElementById('testBadge').textContent==='PREVIEW SAFE',{},{timeout:20000});assert.match(await page.locator('#logOutput').textContent(),/Write and run your Python/);
 await page.screenshot({path:'preview-success.png',fullPage:true});
 // Print proposal builds safe text nodes and includes the current design.
 await page.evaluate(()=>window.print=()=>{});await page.locator('#reportBtn').click();assert.match(await page.locator('#printReport').textContent(),/Route preview safe/);
 // Stop releases all editing controls.
 await page.locator('#runBtn').click();await page.locator('#stopBtn').click();assert.equal(await page.locator('#runBtn').isEnabled(),true);
 // Continuous path collision is visible in the live simulation.
 await page.locator('#clearRouteBtn').click();await clickMap(800,140);await page.locator('#runBtn').click();await page.waitForFunction(()=>document.getElementById('testBadge').textContent==='REVISE ROUTE',{},{timeout:15000});assert.match(await page.locator('#logOutput').textContent(),/Route blocked by/);
 // Dialogs, downloadable PNG, narrow layouts, and direct file opening.
 await page.locator('#guideBtn').click();assert.equal(await page.locator('#guideDialog').isVisible(),true);await page.keyboard.press('Escape');await page.locator('#briefingBtn').click();assert.equal(await page.locator('#briefingDialog').isVisible(),true);await page.locator('#briefingDialog [data-close]').first().click();
 const pngPromise=page.waitForEvent('download');await page.locator('#imageBtn').click();const png=await pngPromise;assert.ok(png.suggestedFilename().endsWith('.png'));
 await loadStarter();
 // The code runs without any planned route; science actions must be written explicitly.
 const routePoints=[[340,440],[350,230],[690,230],[825,410],[840,555]],science=['collect()','','collect()','flash_colour_code("orange-blue")','collect()'];let previous={x:130,y:540};const source=routePoints.map(([x,y],i)=>{const d=Math.hypot(x-previous.x,y-previous.y),heading=(Math.atan2(x-previous.x,previous.y-y)*180/Math.PI+360)%360;previous={x,y};return 'roll(70, '+heading.toFixed(6)+', '+(d/89.6).toFixed(6)+')\n'+science[i]}).join('\n')+'\nstop()';
 await page.locator('#codeEditor').fill(source);await page.locator('#runCodeBtn').click();await page.waitForFunction(()=>document.getElementById('testBadge').textContent==='MISSION COMPLETE',{},{timeout:25000});assert.match(await page.locator('#logOutput').textContent(),/Deposited 2 sample/);assert.equal(await page.locator('#routeList .waypoint-chip').count(),0);
 await page.screenshot({path:'preview-python-success.png',fullPage:true});await page.locator('#reportBtn').click();assert.ok((await page.locator('#printReport').textContent()).includes(source));assert.match(await page.locator('#printReport').textContent(),/Actual code run/);
 assert.match(await page.locator('#printReport').textContent(),/3 terrain obstacles/);
 // Otherwise successful Python must be revised when a required obstacle is removed.
 await page.locator('#objectSelect').selectOption('crater-1');await page.locator('#deleteBtn').click();assert.match(await page.locator('#objectiveList').textContent(),/2\/3 placed/);
 await page.locator('#runCodeBtn').click();await page.waitForFunction(()=>document.getElementById('testBadge').textContent==='REVISE PROGRAM',{},{timeout:25000});assert.match(await page.locator('#logOutput').textContent(),/3 terrain obstacles \(2\/3 placed\)/);await page.locator('#undoBtn').click();assert.match(await page.locator('#objectiveList').textContent(),/3\/3 placed/);
 await page.locator('#codeEditor').fill('roll(101, 90, 1)');await page.locator('#runCodeBtn').click();assert.match(await page.locator('#codeStatus').textContent(),/line 1.*Speed/);assert.equal(await page.locator('#runCodeBtn').isEnabled(),true);
 await page.locator('#codeEditor').fill('while True:\n  pass');await page.locator('#runCodeBtn').click();assert.match(await page.locator('#codeStatus').textContent(),/Loop limit/);
 await page.locator('#codeEditor').fill('roll(100, 62, 5)');await page.locator('#runCodeBtn').click();await page.waitForFunction(()=>document.getElementById('testBadge').textContent==='CODE ERROR',{},{timeout:10000});assert.match(await page.locator('#logOutput').textContent(),/blocked/);
 await page.locator('#codeEditor').fill('wait(10)\nroll(50, 90, 1)');await page.locator('#runCodeBtn').click();await page.locator('#stopBtn').click();assert.equal(await page.locator('#runCodeBtn').isEnabled(),true);await page.waitForTimeout(100);assert.match(await page.locator('#testBadge').textContent(),/CODE STOPPED/);
 // Briefings open for each chosen challenge; all three actual video files play.
 for(const challenge of ['survey','free','samples']){await page.locator('#challenge').selectOption(challenge);assert.equal(await page.locator('#briefingDialog').isVisible(),true);const required=M.challenges[challenge].minObstacles;assert.ok((await page.locator('#briefingGoals').textContent()).includes('at least '+required+' terrain obstacles'));assert.match(await page.locator('#videoDescription').textContent(),/concept example/);await page.waitForFunction(()=>document.getElementById('briefingVideo').readyState>=2);await page.locator('#briefingVideo').evaluate(v=>v.play());await page.waitForFunction(()=>document.getElementById('briefingVideo').currentTime>.2);if(challenge==='samples'){await page.locator('#briefingVideo').evaluate(v=>{v.pause();v.currentTime=12});await page.waitForFunction(()=>Math.abs(document.getElementById('briefingVideo').currentTime-12)<.1&&document.getElementById('briefingVideo').readyState>=2);await page.locator('#briefingVideo').screenshot({path:'preview-video-concept.png'})}await closeBriefing()}
 await page.locator('#codeEditor').fill(source);await page.reload();await closeBriefing();assert.equal(await page.locator('#codeEditor').inputValue(),source);await page.locator('#functionGuideBtn').click();assert.equal(await page.locator('#functionGuideDialog').isVisible(),true);await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'preview-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const direct=await browser.newPage({viewport:{width:1440,height:1000}});direct.on('pageerror',e=>errors.push(e.message));await direct.goto('file:///'+__dirname.replaceAll('\\','/')+'/index.html');if(await direct.locator('#welcomeDialog').isVisible()){await direct.locator('#welcomeContinueBtn').click();await direct.locator('#briefingDialog').waitFor({state:'visible'})}assert.equal(await direct.locator('.inventory-card').count(),12);await direct.waitForFunction(()=>document.getElementById('briefingVideo').readyState>=2);await direct.locator('#briefingVideo').evaluate(v=>v.play());await direct.waitForFunction(()=>document.getElementById('briefingVideo').currentTime>.2);await direct.close();
 assert.deepEqual(errors,[]);console.log('Browser checks passed: design controls, Python success and errors, bounded loops, code stop, source persistence and report, three opening videos, route previews, mobile and offline video playback.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

