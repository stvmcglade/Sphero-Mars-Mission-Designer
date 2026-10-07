// Isolated concept examples: no complete mission layout, solved route or finished program.
let ctx;
const currentMission={theme:'mars',planet:{grid:'#b86b5140'}},reducedMotion=false,sceneAnimation={wheelPhase:0};
let robot={color:'#50b8ff',crashed:false};
function worldToCanvas(p,z=0,s){return {x:s.originX+p.x*s.scale,y:s.originY+p.y*s.scale*s.ySquash-z*s.scale}}
const briefs=[
 {id:'landing',number:'01 / LANDING ENGINEER',minimum:2,title:'APPROACH. LAND. CONFIRM.',subtitle:'Choose a safe landing site and confirm touchdown — your own design',lines:['Example ideas only. Where could your arrival zone be safe?','Include at least 2 obstacles. Choose your own approach and landing site.','One obstacle example: how could you leave room for a safe arrival?','At your chosen landing zone, code land(). Then signal at a relay.','Test your approach. Explain how you confirmed a safe touchdown.']},
 {id:'return',number:'04 / FLIGHT DIRECTOR',minimum:5,title:'PREPARE. LAUNCH. RETURN.',subtitle:'Prepare samples and simulate their return to Earth — your own design',lines:['Example ideas only. Design your own sample return mission.','Include at least 5 obstacles. How will you protect your sample route?','One obstacle example: how could you reach your capsule safely?','Cache two samples and signal. At your capsule, code launch().','The capsule returns samples; the rover stays on Mars. Explain your design.']},
 {id:'samples',number:'03 / SAMPLE RETURN ENGINEER',minimum:3,title:'SEARCH. SAMPLE. SEND.',subtitle:'Collect two samples, signal and deposit — choose your own design',lines:['Example ideas only. Design your own science sites, layout and program.','Include at least 3 obstacles. Where will they create useful route choices?','One obstacle example: what could you change to keep the rover clear?','Choose your own headings and times. Program each science action.','Test your original mission. Explain your obstacle placement and changes.']},
 {id:'survey',number:'02 / SURFACE EXPLORER',minimum:4,title:'EXPLORE. OBSERVE. RETURN.',subtitle:'Observe a sample and weather, signal and return — your own design',lines:['Example ideas only. Choose your own survey sites and rover route.','Include at least 4 obstacles. Spread them through the exploration area.','One obstacle example: which direction might you choose instead?','Calculate values for your own layout. Code collection and observation.','Test your survey. Explain how your code avoids your chosen hazards.']},
 {id:'free',number:'OPEN CHALLENGE',minimum:5,title:'YOUR WORLD. YOUR MISSION.',subtitle:'Choose a science question and demonstrate your own expedition',lines:['Example ideas only. What question will your original mission investigate?','Include at least 5 obstacles. How will your terrain challenge the rover?','One obstacle example: can you think of more than one safe approach?','Write your own program. Choose the sites, headings, times and actions.','Test and improve. Explain the design choices you made independently.']}
];
function wrap(text,x,y,maxWidth,lineHeight){let line='';for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word}else line=next}ctx.fillText(line,x,y)}
function panel(x,y,w,h){ctx.fillStyle='#102333';drawRoundedRect(x,y,w,h,10);ctx.strokeStyle='#405d75';ctx.lineWidth=1;ctx.stroke()}
function text(text,x,y,size=14,color='#eaf4f2',weight=600){ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.font=weight+' '+size+'px system-ui';ctx.fillStyle=color;ctx.fillText(text,x,y)}
function rover(x,y,time,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);sceneAnimation.wheelPhase=time*4;drawRoverBody(25);drawRoverWheels(25);drawRoverMast(25);ctx.restore()}
function drawBriefing(canvas,b,time){
 ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height,chapter=Math.min(4,Math.floor(time/5.2)),phase=(time%5.2)/5.2;
 ctx.clearRect(0,0,w,h);const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#07101d');sky.addColorStop(1,'#251b25');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.globalAlpha=.4;drawStarfield({width:w,height:h});ctx.restore();
 panel(30,24,46,46);text('◉',40,56,27,'#6ed8e5');text('MARS MISSION DESIGN LAB / BRIEFING '+b.number,90,38,10,'#68d9d4');text(b.title,90,67,25);text(b.subtitle,90,91,12,'#c1c8cd',400);
 ctx.fillStyle='#f47b2025';drawRoundedRect(30,108,900,30,6);text('CONCEPT EXAMPLE ONLY  /  CREATE YOUR OWN LAYOUT, ROUTE AND CODE',47,129,11,'#ffd0a8');
 panel(30,153,580,268);panel(630,153,300,268);
 const questions=['What will you investigate?','Where will obstacles matter?','How could you avoid this?','What values suit YOUR map?','What will you improve?'];
 text(questions[chapter],50,183,19,'#92e3d8');
 if(chapter===0){const planet=ctx.createRadialGradient(250,285,2,270,300,85);planet.addColorStop(0,'#dca06e');planet.addColorStop(.5,'#965539');planet.addColorStop(1,'#241721');ctx.fillStyle=planet;ctx.beginPath();ctx.arc(270,300,75,0,Math.PI*2);ctx.fill();rover(270,307,time,Math.sin(time)*.12);text('YOUR SCIENCE QUESTION',140,399,14,'#a9d5ef');}
 if(chapter===1){
  // Separate inventory cards, not positions in a mission map.
  const icons=[['Rock field',drawRockField],['Sand trap',drawSandTrap],['Crater',null]];
  icons.forEach(([label,draw],i)=>{const x=52+i*178;panel(x,222,160,150);const s={scale:.6,ySquash:.72,originX:x+80,originY:303};if(draw)draw({x:-42,y:-32,w:84,h:64},s);else drawCrater({x:0,y:0,size:45},s);text(label,x+17,351,12,'#c4d9e8')});
  text('You decide the types and positions.',64,401,13,'#c1c8cd',400);
 }
 if(chapter===2){
  // A rover approaches one hazard and pauses. Students decide the safe route.
  const s={scale:.85,ySquash:.72,originX:370,originY:318};drawRockField({x:-44,y:-28,w:88,h:56},s);rover(105+Math.min(.8,phase)*95,319,time);
  ctx.strokeStyle='#e18e5670';ctx.setLineDash([5,5]);ctx.beginPath();ctx.ellipse(370,318,65,46,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  text('?',263,279,45,'#96ddff');text('?',273,385,45,'#96ddff');text('Leave room around the hazard.',58,401,13,'#c1c8cd',400);
 }
 if(chapter===3){text('COMMAND SHAPES — YOU CHOOSE THE VALUES',52,223,11,'#a7c6d9');ctx.font='15px ui-monospace,monospace';ctx.fillStyle='#95d9ff';ctx.fillText('roll(speed, heading, seconds)',53,274);ctx.fillText(b.id==='landing'?'land()':b.id==='return'?'launch()':b.id==='survey'?'observe()':'collect()',53,318);ctx.fillText('# write your own commands',53,361);text('Calculate and test against your own terrain.',52,400,12,'#c1c8cd',400);}
 if(chapter===4){['TEST YOUR CODE','READ THE FEEDBACK','EXPLAIN A CHANGE'].forEach((label,i)=>{panel(60,220+i*57,515,43);text(label,78,247+i*57,13,i===Math.floor(phase*3)?'#9affea':'#a7c6d9')});text('There can be more than one good design.',61,409,12,'#c1c8cd',400);}
 text('YOUR MISSION REQUIREMENT',650,183,11,'#6ad7c8');text('AT LEAST '+b.minimum+' OBSTACLES',650,224,21,'#ffcc9b');text('Spread hazards through your',650,257,13,'#c5d7e5',400);text('exploration area.',650,278,13,'#c5d7e5',400);
 text('You choose:',650,313,13,'#89d7ef');['• Science site positions','• Obstacle positions','• Safe route and Python values'].forEach((label,i)=>text(label,650,339+i*23,12,'#c5d7e5',400));
 ctx.fillStyle='#081420e8';drawRoundedRect(30,439,900,70,9);ctx.textAlign='left';ctx.font='600 18px system-ui';ctx.fillStyle='#eff8f2';wrap(b.lines[chapter],50,466,860,25);
 ctx.fillStyle='#d3a079';ctx.fillRect(30,521,900*Math.min(1,time/26),3);text('Independent classroom concept examples · captions · original ambient space music · use video controls to mute',38,537,9,'#8d9fac',400);
}
async function composeSpaceMusic(){
 // Original music synthesized locally: warm minor chords, soft bass and drifting bells.
 const sampleRate=48000,duration=26,audio=new OfflineAudioContext(2,sampleRate*duration,sampleRate);
 const master=audio.createGain();master.gain.value=.65;master.connect(audio.destination);
 const echo=audio.createDelay(2),feedback=audio.createGain(),wet=audio.createGain();echo.delayTime.value=.48;feedback.gain.value=.23;wet.gain.value=.22;echo.connect(feedback);feedback.connect(echo);echo.connect(wet);wet.connect(master);
 const chords=[[164.81,196,246.94],[130.81,164.81,196,246.94],[146.83,196,246.94],[146.83,196,220,293.66]],bass=[82.41,65.41,98,73.42];
 for(let chord=0;chord<4;chord++){
  const start=chord*6.5,end=Math.min(26,start+8);
  chords[chord].forEach((frequency,index)=>{for(const detune of [-4,4]){const oscillator=audio.createOscillator(),gain=audio.createGain(),filter=audio.createBiquadFilter(),pan=audio.createStereoPanner();oscillator.type='triangle';oscillator.frequency.value=frequency;oscillator.detune.value=detune;filter.type='lowpass';filter.frequency.value=650;pan.pan.value=index%2?.35:-.35;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.024,start+1.4);gain.gain.setValueAtTime(.024,Math.max(start+1.4,end-2));gain.gain.linearRampToValueAtTime(0,end);oscillator.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(master);oscillator.start(start);oscillator.stop(end)}});
  const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.value=bass[chord];gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.04,start+1.3);gain.gain.linearRampToValueAtTime(0,end);oscillator.connect(gain);gain.connect(master);oscillator.start(start);oscillator.stop(end);
 }
 const notes=[659.25,783.99,987.77,1174.66,987.77,783.99,523.25,659.25,783.99,987.77,783.99,659.25];
 notes.forEach((frequency,index)=>{const start=1.4+index*1.9,end=Math.min(26,start+3.2),oscillator=audio.createOscillator(),gain=audio.createGain(),pan=audio.createStereoPanner();oscillator.type='sine';oscillator.frequency.value=frequency;pan.pan.value=Math.sin(index*1.1)*.55;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.048,start+.03);gain.gain.exponentialRampToValueAtTime(.0001,end);oscillator.connect(gain);gain.connect(pan);pan.connect(master);pan.connect(echo);oscillator.start(start);oscillator.stop(end)});
 const buffer=await audio.startRendering();let peak=0;for(let ch=0;ch<buffer.numberOfChannels;ch++)for(const value of buffer.getChannelData(ch))peak=Math.max(peak,Math.abs(value));
 const level=peak?Math.min(1,.2/peak):1;for(let ch=0;ch<buffer.numberOfChannels;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++){const time=i/sampleRate,fade=Math.min(1,time/1.2,(duration-time)/1.8);data[i]*=level*Math.max(0,fade)}}
 return buffer;
}
async function recordBriefings(){
 const music=await composeSpaceMusic(),audio=new AudioContext({sampleRate:48000}),destination=audio.createMediaStreamDestination(),source=audio.createBufferSource();source.buffer=music;source.connect(destination);await audio.resume();
 const recordings=briefs.map(b=>{const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;document.body.append(canvas);drawBriefing(canvas,b,0);const poster=canvas.toDataURL('image/png').split(',')[1],video=canvas.captureStream(20),stream=new MediaStream([...video.getVideoTracks(),...destination.stream.getAudioTracks().map(track=>track.clone())]),mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm;codecs=vp8,opus',recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1200000,audioBitsPerSecond:96000}),chunks=[];const stopped=new Promise(resolve=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=resolve});recorder.start();return {b,canvas,stream,recorder,chunks,stopped,poster}});
 source.start();
 const start=performance.now();await new Promise(resolve=>{function frame(){const time=(performance.now()-start)/1000;recordings.forEach(r=>drawBriefing(r.canvas,r.b,Math.min(time,25.999)));if(time<26)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});
 recordings.forEach(r=>r.recorder.stop());await Promise.all(recordings.map(r=>r.stopped));await audio.close();
 return Promise.all(recordings.map(async r=>{r.stream.getTracks().forEach(t=>t.stop());const blob=new Blob(r.chunks,{type:'video/webm'}),video=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob)});const stamp=n=>'00:'+String(Math.floor(n/60)).padStart(2,'0')+':'+(n%60).toFixed(3).padStart(6,'0');const captions='WEBVTT\n\n'+r.b.lines.map((line,i)=>stamp(i*5.2)+' --> '+stamp((i+1)*5.2)+'\n'+line+'\n').join('\n');return {id:r.b.id,video,poster:r.poster,captions}}));
}
