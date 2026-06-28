import { useState,useEffect } from 'react';
import { Send,Zap,AlertCircle,CheckCircle,Bot,Clock,Sparkles } from 'lucide-react';
import api from '../utils/api';
import { MODELS,approxTokens,calcCost,gradePrompt,gradeColor,formatCost } from '../utils/tokens';
import GradeTag from '../components/GradeTag';

const TIPS=[
  {tag:'Good',color:'#10b981',tip:'Be specific about output format'},
  {tag:'Good',color:'#10b981',tip:'Use bullet points for structure'},
  {tag:'Watch',color:'#f59e0b',tip:'Avoid repeating context'},
  {tag:'Watch',color:'#f59e0b',tip:'Keep system prompts short'},
  {tag:'Avoid',color:'#f43f5e',tip:'Pasting entire documents'},
  {tag:'Avoid',color:'#f43f5e',tip:'Multi-task in one prompt'},
];

export default function NewRequestPage(){
  const [prompt,setPrompt]=useState('');
  const [model,setModel]=useState('Groq Llama 3.3');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');
  const [inputTokens,setInputTokens]=useState(0);
  useEffect(()=>setInputTokens(approxTokens(prompt)),[prompt]);
  const grade=gradePrompt(inputTokens);
  const gColor=gradeColor(grade);

  const submit=async()=>{
    if(!prompt.trim())return;
    setLoading(true);setError('');setResult(null);
    try{const{data}=await api.post('/requests',{prompt,model});setResult(data);}
    catch(err){setError(err.response?.data?.message||'Request failed. Is backend running?');}
    finally{setLoading(false);}
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div className="fade-up">
        <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Groq API</div>
        <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>New Request</h1>
        <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>Send a real prompt — track exact token usage and cost</p>
      </div>

      {/* Two-col on desktop, single col on mobile */}
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr)',gap:14}} className="req-layout">
        <style>{`@media(min-width:900px){.req-layout{grid-template-columns:minmax(0,1fr) 300px!important;}}`}</style>

        {/* Left */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="glass fade-up" style={{padding:20,animationDelay:'60ms'}}>
            <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.06em',display:'block',marginBottom:8}}>Your Prompt</label>
            <textarea style={{width:'100%',padding:12,fontSize:14,height:130,resize:'vertical',lineHeight:1.7,borderRadius:10}}
              placeholder="Ask anything…"
              value={prompt} onChange={e=>setPrompt(e.target.value)}
              onKeyDown={e=>{if(e.ctrlKey&&e.key==='Enter')submit();}}/>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10,padding:'7px 10px',borderRadius:8,background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',flexWrap:'wrap',gap:6}}>
              <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#10b981',flexShrink:0}}/>
                <span style={{color:'var(--text2)'}}>~{inputTokens.toLocaleString()} tokens</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <GradeTag grade={grade}/>
                <span style={{fontSize:11,color:gColor}}>{grade==='A+'?'Excellent':grade==='A'?'Good':grade.startsWith('B')?'Moderate':'Too long'}</span>
              </div>
            </div>

            {/* Model grid */}
            <label style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.06em',display:'block',margin:'16px 0 10px'}}>Select Model</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {MODELS.map(m=>(
                <button key={m.key} onClick={()=>setModel(m.key)} style={{padding:'10px 12px',borderRadius:9,textAlign:'left',cursor:'pointer',border:model===m.key?`1.5px solid ${m.color}50`:'1px solid var(--border)',background:model===m.key?`${m.color}0d`:'rgba(255,255,255,0.02)',transition:'all 0.18s',fontFamily:'var(--sans)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:m.color,flexShrink:0,boxShadow:model===m.key?`0 0 6px ${m.color}`:'none'}}/>
                    <span style={{fontSize:12,fontWeight:600,color:model===m.key?m.color:'var(--text1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.key}</span>
                    {m.free&&<span style={{marginLeft:'auto',fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:3,background:'rgba(16,185,129,0.15)',color:'#10b981',flexShrink:0}}>FREE</span>}
                  </div>
                  <div style={{fontSize:10,color:'var(--text3)',marginTop:2,marginLeft:15,textTransform:'capitalize'}}>{m.provider}</div>
                </button>
              ))}
            </div>

            {/* Cost preview */}
            <div style={{display:'flex',justifyContent:'space-between',padding:'9px 12px',borderRadius:8,background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.15)',marginTop:14,flexWrap:'wrap',gap:4}}>
              <span style={{fontSize:12,color:'var(--text2)'}}>Estimated cost (input only)</span>
              <span style={{fontSize:13,fontWeight:700,color:'#818cf8',fontFamily:'var(--mono)'}}>{formatCost(calcCost(model,inputTokens,0))}</span>
            </div>

            {error&&(<div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'10px 12px',borderRadius:9,background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',color:'#fb7185',fontSize:13,marginTop:12}}><AlertCircle size={14} style={{flexShrink:0,marginTop:1}}/>{error}</div>)}

            <button onClick={submit} disabled={loading||!prompt.trim()} className="btn btn-primary" style={{width:'100%',marginTop:14,padding:'12px',fontSize:14,opacity:loading||!prompt.trim()?0.5:1}}>
              {loading?<><div style={{width:15,height:15,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.7s linear infinite'}}/> Calling API…</>:<><Send size={14}/> Send Request <span style={{opacity:0.5,fontSize:11,fontWeight:400}}>Ctrl+Enter</span></>}
            </button>
          </div>

          {/* Result */}
          {result&&(
            <div className="glass fade-up" style={{padding:20,border:'1px solid rgba(16,185,129,0.25)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,color:'#10b981',fontWeight:600,fontSize:13}}><CheckCircle size={15}/> Tracked — {result.responseTime}ms</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:14}}>
                {[['Input',result.inputTokens?.toLocaleString(),'#6366f1'],['Output',result.outputTokens?.toLocaleString(),'#06b6d4'],['Total',result.totalTokens?.toLocaleString(),'var(--text1)'],['Cost',formatCost(result.cost),'#10b981']].map(([l,v,c])=>(
                  <div key={l} style={{padding:'10px 12px',borderRadius:9,background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',textAlign:'center'}}>
                    <div style={{fontSize:10,color:'var(--text3)',marginBottom:4,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</div>
                    <div style={{fontSize:17,fontWeight:800,color:c,fontFamily:'var(--mono)'}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text3)',marginBottom:14,flexWrap:'wrap',gap:4}}>
                <div style={{display:'flex',alignItems:'center',gap:5}}><Clock size={11}/>{result.responseTime}ms</div>
                <div style={{display:'flex',alignItems:'center',gap:7}}>Grade: <GradeTag grade={result.efficiencyGrade}/></div>
              </div>
              {result.suggestions?.length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--text2)',marginBottom:8,display:'flex',alignItems:'center',gap:6,textTransform:'uppercase',letterSpacing:'0.05em'}}><Sparkles size={12} color="#f59e0b"/> Suggestions</div>
                  {result.suggestions.map((s,i)=>(<div key={i} style={{display:'flex',gap:8,padding:'8px 10px',borderRadius:8,background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.15)',marginBottom:6}}><span style={{color:'#f59e0b',flexShrink:0}}>→</span><span style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}>{s}</span></div>))}
                </div>
              )}
              {result.aiResponse&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--text2)',marginBottom:8,display:'flex',alignItems:'center',gap:6,textTransform:'uppercase',letterSpacing:'0.05em'}}><Bot size={12} color="#818cf8"/> Response</div>
                  <div style={{padding:14,borderRadius:9,fontSize:13,lineHeight:1.8,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',color:'var(--text2)',maxHeight:240,overflowY:'auto',whiteSpace:'pre-wrap'}}>{result.aiResponse}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips sidebar — hidden on mobile, shown below on small */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="glass fade-up" style={{padding:18,animationDelay:'100ms'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Sparkles size={14} color="#f59e0b"/><span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>Prompt Tips</span></div>
            {TIPS.map((t,i)=>(<div key={i} style={{display:'flex',gap:8,padding:'8px 10px',borderRadius:8,background:`${t.color}08`,border:`1px solid ${t.color}18`,marginBottom:6}}><span style={{fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:4,background:`${t.color}18`,color:t.color,flexShrink:0,alignSelf:'flex-start',marginTop:1}}>{t.tag}</span><span style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}>{t.tip}</span></div>))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
