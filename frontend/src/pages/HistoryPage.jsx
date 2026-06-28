import { useEffect,useState } from 'react';
import { History,Trash2,ChevronLeft,ChevronRight,Filter } from 'lucide-react';
import api from '../utils/api';
import { formatTokens,formatCost,formatDate,MODELS } from '../utils/tokens';
import ModelBadge from '../components/ModelBadge';
import GradeTag from '../components/GradeTag';

export default function HistoryPage(){
  const [data,setData]=useState({requests:[],total:0,pages:1});
  const [page,setPage]=useState(1);
  const [model,setModel]=useState('all');
  const [loading,setLoading]=useState(true);
  const [deleting,setDeleting]=useState(null);

  const load=async()=>{
    setLoading(true);
    try{const{data:d}=await api.get(`/requests?page=${page}&limit=15&model=${model}`);setData(d);}
    catch(e){console.error(e);}finally{setLoading(false);}
  };
  useEffect(()=>{load();},[page,model]);

  const del=async id=>{setDeleting(id);try{await api.delete(`/requests/${id}`);load();}finally{setDeleting(null);}};

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div className="fade-up">
        <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Log</div>
        <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>History</h1>
        <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>{data.total} total requests tracked</p>
      </div>

      {/* Filters — scroll on mobile */}
      <div className="fade-up" style={{display:'flex',alignItems:'center',gap:8,flexWrap:'nowrap',overflowX:'auto',paddingBottom:4}}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text3)',flexShrink:0}}>
          <Filter size={12}/> Filter:
        </div>
        {['all',...MODELS.map(m=>m.key)].map(m=>(
          <button key={m} onClick={()=>{setModel(m);setPage(1);}} style={{padding:'5px 12px',borderRadius:20,fontSize:11,fontWeight:500,cursor:'pointer',border:model===m?'1.5px solid rgba(99,102,241,0.5)':'1px solid var(--border)',background:model===m?'rgba(99,102,241,0.12)':'rgba(255,255,255,0.03)',color:model===m?'#818cf8':'var(--text2)',transition:'all 0.18s',fontFamily:'var(--sans)',whiteSpace:'nowrap',flexShrink:0}}>
            {m==='all'?'All':m}
          </button>
        ))}
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="glass fade-up" style={{overflow:'hidden',animationDelay:'80ms'}}>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          {loading?(
            <div style={{display:'flex',justifyContent:'center',padding:'50px 0'}}><div style={{width:26,height:26,borderRadius:'50%',border:'2px solid #6366f1',borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/></div>
          ):data.requests.length===0?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'50px 20px',gap:10,color:'var(--text3)'}}>
              <History size={30} style={{opacity:0.3}}/>
              <p style={{margin:0,fontSize:13}}>No requests yet — go track one!</p>
            </div>
          ):(
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,0.02)'}}>
                  {['Prompt','Model','Tokens','Cost','Grade','Time',''].map(h=>(
                    <th key={h} style={{textAlign:'left',fontSize:10,fontWeight:600,color:'var(--text3)',padding:'10px 14px',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.requests.map((r,i)=>(
                  <tr key={r._id} style={{borderBottom:i<data.requests.length-1?'1px solid rgba(255,255,255,0.04)':'none',transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.025)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'11px 14px',maxWidth:200}}><span style={{fontSize:12,color:'var(--text1)',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={r.prompt}>{r.prompt}</span></td>
                    <td style={{padding:'11px 14px',whiteSpace:'nowrap'}}><ModelBadge model={r.model}/></td>
                    <td style={{padding:'11px 14px',whiteSpace:'nowrap'}}>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--text1)',fontFamily:'var(--mono)'}}>{formatTokens(r.totalTokens)}</div>
                      <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{r.inputTokens}↑ {r.outputTokens}↓</div>
                    </td>
                    <td style={{padding:'11px 14px',fontSize:12,fontWeight:700,color:'#10b981',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{formatCost(r.cost)}</td>
                    <td style={{padding:'11px 14px'}}><GradeTag grade={r.efficiencyGrade}/></td>
                    <td style={{padding:'11px 14px',fontSize:11,color:'var(--text3)',whiteSpace:'nowrap'}}>{formatDate(r.createdAt)}</td>
                    <td style={{padding:'11px 14px'}}>
                      <button onClick={()=>del(r._id)} disabled={deleting===r._id} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',padding:5,borderRadius:6,transition:'all 0.15s',display:'flex',alignItems:'center'}}
                        onMouseEnter={e=>{e.currentTarget.style.color='#f43f5e';e.currentTarget.style.background='rgba(244,63,94,0.08)'}}
                        onMouseLeave={e=>{e.currentTarget.style.color='var(--text3)';e.currentTarget.style.background='none'}}>
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {data.pages>1&&(
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}} className="fade-up">
          <span style={{fontSize:12,color:'var(--text3)'}}>Page {page} of {data.pages}</span>
          <div style={{display:'flex',gap:8}}>
            {[{icon:ChevronLeft,fn:()=>setPage(p=>Math.max(1,p-1)),dis:page===1},{icon:ChevronRight,fn:()=>setPage(p=>Math.min(data.pages,p+1)),dis:page===data.pages}].map(({icon:Icon,fn,dis},i)=>(
              <button key={i} onClick={fn} disabled={dis} className="btn btn-ghost" style={{padding:'7px 11px',opacity:dis?0.4:1,cursor:dis?'not-allowed':'pointer'}}><Icon size={14}/></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
