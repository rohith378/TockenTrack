import { useState } from 'react';
import { Calculator,TrendingUp } from 'lucide-react';
import { MODELS,formatCost } from '../utils/tokens';

export default function CalculatorPage(){
  const [vals,setVals]=useState({inputTokens:5000,outputTokens:500,requestsPerDay:100});
  const set=(k,v)=>setVals(p=>({...p,[k]:Number(v)}));

  const results=MODELS.map(m=>{
    const perReq=(vals.inputTokens/1000)*m.in+(vals.outputTokens/1000)*m.out;
    const perDay=perReq*vals.requestsPerDay;
    const perMonth=perDay*30;
    const perYear=perDay*365;
    return{...m,perReq,perDay,perMonth,perYear};
  }).sort((a,b)=>a.perMonth-b.perMonth);

  const cheapest=results[0];
  const mostExp=results[results.length-1];

  const SLIDERS=[
    {key:'inputTokens',label:'Input tokens / request',min:100,max:100000,step:100,unit:'tokens'},
    {key:'outputTokens',label:'Output tokens / request',min:50,max:10000,step:50,unit:'tokens'},
    {key:'requestsPerDay',label:'Requests per day',min:1,max:10000,step:1,unit:'req/day'},
  ];

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div className="fade-up">
        <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Estimation</div>
        <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>Cost Calculator</h1>
        <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>Estimate monthly spend across all AI providers</p>
      </div>

      <div className="glass fade-up" style={{padding:24,animationDelay:'60ms'}}>
        {SLIDERS.map(({key,label,min,max,step,unit})=>(
          <div key={key} style={{marginBottom:22}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,flexWrap:'wrap',gap:4}}>
              <span style={{fontSize:13,fontWeight:500,color:'var(--text1)'}}>{label}</span>
              <span style={{fontSize:13,fontWeight:800,color:'#818cf8',fontFamily:'var(--mono)'}}>{vals[key].toLocaleString()} <span style={{fontSize:11,fontWeight:400,color:'var(--text3)'}}>{unit}</span></span>
            </div>
            <input type="range" min={min} max={max} step={step} value={vals[key]} onChange={e=>set(key,e.target.value)} style={{width:'100%'}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
              <span style={{fontSize:10,color:'var(--text3)'}}>{min.toLocaleString()}</span>
              <span style={{fontSize:10,color:'var(--text3)'}}>{max.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Savings banner */}
      <div className="glass fade-up" style={{padding:'14px 18px',border:'1px solid rgba(16,185,129,0.25)',background:'rgba(16,185,129,0.06)',animationDelay:'100ms'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <TrendingUp size={18} color="#10b981" style={{flexShrink:0}}/>
          <span style={{fontSize:13,color:'var(--text1)',lineHeight:1.5}}>
            Switch <strong style={{color:'#f43f5e'}}>{mostExp.key}</strong> → <strong style={{color:'#10b981'}}>{cheapest.key}</strong> · save <strong style={{color:'#10b981',fontFamily:'var(--mono)'}}>{formatCost(mostExp.perMonth-cheapest.perMonth)}/mo</strong>
          </span>
        </div>
      </div>

      {/* Cards — responsive grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        {results.map((r,i)=>(
          <div key={r.key} className="glass glass-hover fade-up" style={{padding:18,border:i===0?`1.5px solid ${r.color}40`:'1px solid var(--border)',animationDelay:`${150+i*50}ms`}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:r.color,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:700,color:r.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:90}}>{r.key}</span>
              </div>
              {i===0&&<span style={{fontSize:8,fontWeight:800,padding:'2px 6px',borderRadius:4,background:`${r.color}20`,color:r.color,flexShrink:0}}>CHEAPEST</span>}
            </div>
            <div style={{fontSize:26,fontWeight:800,color:r.color,fontFamily:'var(--mono)',letterSpacing:'-0.5px',lineHeight:1}}>{formatCost(r.perMonth)}</div>
            <div style={{fontSize:10,color:'var(--text3)',marginBottom:14,marginTop:4}}>per month</div>
            {[['Per req',r.perReq],['Per day',r.perDay],['Per year',r.perYear]].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'5px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{color:'var(--text3)'}}>{l}</span>
                <span style={{fontWeight:600,color:'var(--text1)',fontFamily:'var(--mono)'}}>{formatCost(v)}</span>
              </div>
            ))}
            <div style={{marginTop:12,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:4}}>
                <span style={{color:'var(--text3)'}}>In /1K</span><span style={{fontWeight:700,color:r.color}}>${r.in}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10}}>
                <span style={{color:'var(--text3)'}}>Out /1K</span><span style={{fontWeight:700,color:r.color}}>${r.out}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison table — scrollable on mobile */}
      <div className="glass fade-up" style={{overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
          <Calculator size={14} color="#818cf8"/>
          <span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>Full Comparison</span>
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:480}}>
            <thead>
              <tr style={{background:'rgba(255,255,255,0.02)'}}>
                {['Model','Per Req','Daily','Monthly','Yearly'].map(h=>(
                  <th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:10,fontWeight:600,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r,i)=>(
                <tr key={r.key} style={{borderBottom:i<results.length-1?'1px solid rgba(255,255,255,0.04)':'none',transition:'background 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'11px 16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:r.color,flexShrink:0}}/>
                      <span style={{fontSize:12,fontWeight:700,color:r.color,whiteSpace:'nowrap'}}>{r.key}</span>
                    </div>
                  </td>
                  {[r.perReq,r.perDay,r.perMonth,r.perYear].map((v,j)=>(
                    <td key={j} style={{padding:'11px 16px',fontSize:12,fontWeight:500,color:'var(--text1)',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{formatCost(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
