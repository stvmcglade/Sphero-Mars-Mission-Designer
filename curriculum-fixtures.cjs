const M=require('./mission-model.js');
module.exports=function fixture(id){const c=M.challenges[id],r=c.rules,s=M.blank(id);s.teamName='Student Engineering Team';s.missionName=c.name;s.scienceQuestion='How can our rover meet this mission objective safely?';s.objects=[M.makeObject('rover',100,500,'rover'),...Array.from({length:c.minObstacles},(_,i)=>M.makeObject('rock',100+i*120,100,'hazard-'+i))];const stops=[];let next=200,landing;
 const add=(type,action)=>{const o=M.makeObject(type,next,500,type+'-'+next);s.objects.push(o);stops.push([next,action]);next+=100;return o};
 if(r.land)landing=add('landing','land()');else if(r.finish==='landing'){landing=M.makeObject('landing',100,500,'landing');s.objects.push(landing)}
 for(let i=0;i<(r.samples||0);i++)add('sample','collect()');for(let i=0;i<(r.weather||0);i++)add('sensor','observe()');
 if(r.launch&&r.deposit)add('cache','collect()');for(let i=0;i<(r.relays||(r.confirm?1:0));i++)add('relay','transmit()');if(!r.launch&&r.deposit)add('cache','collect()');if(r.launch)add('ascent','launch()');if(r.finish==='landing')stops.push([landing.x,'']);
 let x=100;s.code='speed = 100\n'+stops.map(([end,action])=>{const result='roll(speed, '+(end>x?90:270)+', '+(Math.abs(end-x)/128).toFixed(7)+')\n'+action;x=end;return result}).join('\n')+'\nstop()';s.route=stops.map(([x],i)=>({id:'route-'+i,x,y:500}));return s};
