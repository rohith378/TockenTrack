import { useState } from 'react';
import { GitCompare,Trophy,Zap } from 'lucide-react';
import { MODELS,calcCost,approxTokens,formatCost } from '../utils/tokens';

const SAMPLES=['Explain how neural networks learn in 3 bullet points','Write a Python function to sort a list of dictionaries','Summarize the transformer attention mechanism','What are the SOLID principles in software engineering?'];

export default function ComparePage(){
  const [prompt,setPrompt]=useState(SAMPLES[0]);
  const [results,setResults]=useState(null);

  const run=()=>{
    const inT=approxTokens(prompt);
    const data=MODELS.map(m=>{const outT=Math.round(inT*(0.9+Math.random()*0.8));return{...m,inT,outT,total:inT+outT,cost:calcCost(m.key,inT,outT),ms:Math.round(200+Math.random()*1800)};}).sort((a,b)=>a.total-b.total);
    setResults(data);
  };

  const maxT=results?Math.max(...results.map(r=>r.total)):1;
  const winner=results?.[0];

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div className="fade-up">
        <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Analysis</div>
        <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>Compare Models</h1>
        <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>Same prompt — which model is cheapest?</p>
      </div>

      <div className="glass fade-up" style={{padding:20,animationDelay:'60ms'}}>
        <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.06em',display:'block',marginBottom:8}}>Prompt to Compare</label>
        <textarea style={{width:'100%',padding:12,fontSize:14,height:80,resize:'vertical',lineHeight:1.6,borderRadius:9}}
          value={prompt} onChange={e=>{setPrompt(e.target.value);setResults(null);}}/>
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,flexWrap:'wrap'}}>
          <button onClick={run} className="btn btn-primary" style={{padding:'9px 18px'}}>
            <GitCompare size={13}/> Run Comparison
          </button>
          <span style={{fontSize:11,color:'var(--text3)'}}>or try:</span>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {SAMPLES.map((s,i)=>(
              <button key={i} onClick={()=>{setPrompt(s);setResults(null);}} className="btn btn-ghost" style={{padding:'6px 10px',fontSize:11}}>Sample {i+1}</button>
            ))}
          </div>
        </div>
      </div>

      {results&&(
        <>
          {/* Winner banner */}
          <div className="glass fade-up" style={{padding:'14px 18px',border:`1px solid ${winner.color}30`,background:`${winner.color}06`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${winner.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Trophy size={17} color={winner.color}/></div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:'var(--text1)'}}>🏆 {winner.key} is most efficient</div>
                <div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{winner.total.toLocaleString()} tokens · {formatCost(winner.cost)} · {winner.ms}ms</div>
              </div>
            </div>
          </div>

          {/* Cards — 2 cols on mobile, 4 on desktop */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
            {results.map((r,i)=>(
              <div key={r.key} className="glass glass-hover fade-up" style={{padding:18,border:i===0?`1.5px solid ${r.color}40`:'1px solid var(--border)',animationDelay:`${i*50}ms`}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{width:9,height:9,borderRadius:'50%',background:r.color,boxShadow:`0 0 6px ${r.color}`}}/>
                    <span style={{fontSize:12,fontWeight:700,color:r.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:80}}>{r.key}</span>
                  </div>
                  {i===0&&<span style={{fontSize:8,fontWeight:800,padding:'2px 6px',borderRadius:4,background:`${r.color}20`,color:r.color,flexShrink:0}}>BEST</span>}
                </div>
                <div style={{fontSize:26,fontWeight:800,color:r.color,fontFamily:'var(--mono)',letterSpacing:'-0.5px',lineHeight:1}}>{r.total.toLocaleString()}</div>
                <div style={{fontSize:10,color:'var(--text3)',marginBottom:10,marginTop:3}}>tokens</div>
                <div style={{height:3,borderRadius:2,background:'var(--bg3)',marginBottom:12}}>
                  <div style={{height:3,borderRadius:2,background:r.color,width:`${(r.total/maxT)*100}%`,boxShadow:`0 0 6px ${r.color}60`,transition:'width 0.7s ease'}}/>
                </div>
                {[['In',r.inT],['Out',r.outT],['Cost',formatCost(r.cost)],['Speed',`${r.ms}ms`]].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'4px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{color:'var(--text3)'}}>{l}</span>
                    <span style={{fontWeight:600,color:'var(--text1)',fontFamily:'var(--mono)'}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Savings */}
          <div className="glass fade-up" style={{padding:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <Zap size={14} color="#f59e0b"/>
              <span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>Cost Savings vs Most Expensive</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {results.map(r=>{
                const maxCost=Math.max(...results.map(x=>x.cost));
                const pct=maxCost>0?((maxCost-r.cost)/maxCost*100).toFixed(0):0;
                return(
                  <div key={r.key} style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <span style={{fontSize:11,fontWeight:600,color:'var(--text2)',minWidth:90,flexShrink:0}}>{r.key}</span>
                    <div style={{flex:1,minWidth:60,height:5,borderRadius:3,background:'var(--bg3)'}}>
                      <div style={{height:5,borderRadius:3,background:`linear-gradient(90deg,${r.color},${r.color}80)`,width:`${Math.max(2,100-(r.cost/maxCost)*100)}%`,transition:'width 0.7s ease'}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:r.color,minWidth:65,textAlign:'right',flexShrink:0}}>{pct}% cheaper</span>
                    <span style={{fontSize:11,color:'#10b981',minWidth:80,textAlign:'right',fontFamily:'var(--mono)',flexShrink:0}}>
                      {(maxCost-r.cost)>0?`save ${formatCost(maxCost-r.cost)}`:'baseline'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
