import { useEffect,useState } from 'react';
import { Key,DollarSign,Moon,Sun,Save,Eye,EyeOff,CheckCircle,ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { PROVIDERS } from '../utils/tokens';

export default function SettingsPage(){
  const { theme,toggleTheme } = useTheme();
  const [settings,setSettings]=useState(null);
  const [keys,setKeys]=useState({groq:'',openai:'',anthropic:'',gemini:''});
  const [showKey,setShowKey]=useState({});
  const [budget,setBudget]=useState(0);
  const [saved,setSaved]=useState('');
  const [loading,setLoading]=useState(true);

  const load=async()=>{const{data}=await api.get('/settings');setSettings(data);setBudget(data.monthlyBudget||0);setLoading(false);};
  useEffect(()=>{load();},[]);

  const saveKey=async(provider)=>{
    if(!keys[provider])return;
    await api.patch('/settings/api-keys',{provider,key:keys[provider]});
    setKeys(k=>({...k,[provider]:''}));setSaved(provider);setTimeout(()=>setSaved(''),2000);load();
  };
  const saveBudget=async()=>{await api.patch('/settings/budget',{monthlyBudget:Number(budget)});setSaved('budget');setTimeout(()=>setSaved(''),2000);};

  if(loading)return(<div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}><div style={{width:28,height:28,borderRadius:'50%',border:'2px solid #6366f1',borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>);

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18,maxWidth:720}}>
      <div className="fade-up">
        <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Configuration</div>
        <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>Settings</h1>
        <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>API keys, budget alerts, and preferences</p>
      </div>

      {/* Theme */}
      <div className="glass fade-up" style={{padding:20,animationDelay:'60ms'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:34,height:34,borderRadius:9,background:'rgba(99,102,241,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {theme==='dark'?<Moon size={16} color="#818cf8"/>:<Sun size={16} color="#f59e0b"/>}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'var(--text1)'}}>Appearance</div>
              <div style={{fontSize:12,color:'var(--text3)',marginTop:2}}>{theme==='dark'?'Dark mode':'Light mode'} active</div>
            </div>
          </div>
          <button onClick={toggleTheme} style={{width:50,height:27,borderRadius:14,border:'none',cursor:'pointer',background:theme==='dark'?'#6366f1':'#e2e8f0',position:'relative',transition:'background 0.25s',flexShrink:0}}>
            <div style={{width:21,height:21,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:theme==='dark'?26:3,transition:'left 0.25s',boxShadow:'0 2px 6px rgba(0,0,0,0.3)'}}/>
          </button>
        </div>
      </div>

      {/* Budget */}
      <div className="glass fade-up" style={{padding:20,animationDelay:'100ms'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:9,background:'rgba(16,185,129,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><DollarSign size={16} color="#10b981"/></div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text1)'}}>Monthly Budget</div>
            <div style={{fontSize:12,color:'var(--text3)'}}>Alerts at 80%, 90%, and 100% usage</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:160}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text3)',fontSize:14}}>$</span>
            <input type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)} style={{width:'100%',padding:'10px 12px 10px 24px',borderRadius:8,fontSize:14}} placeholder="0 = no budget"/>
          </div>
          <button onClick={saveBudget} className="btn btn-primary" style={{padding:'10px 16px'}}>
            {saved==='budget'?<CheckCircle size={14}/>:<Save size={14}/>}
            {saved==='budget'?'Saved':'Save'}
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="glass fade-up" style={{padding:20,animationDelay:'140ms'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
          <div style={{width:34,height:34,borderRadius:9,background:'rgba(99,102,241,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Key size={16} color="#818cf8"/></div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text1)'}}>API Keys</div>
            <div style={{fontSize:12,color:'var(--text3)'}}>Stored securely, only used for your requests</div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {PROVIDERS.map(p=>(
            <div key={p.key}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:6}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:p.color}}/>
                  <span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>{p.label}</span>
                  {p.free&&<span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:4,background:'rgba(16,185,129,0.15)',color:'#10b981'}}>FREE</span>}
                  {settings.apiKeysSet[p.key]&&<CheckCircle size={12} color="#10b981"/>}
                </div>
                <a href={p.signupUrl} target="_blank" rel="noreferrer" style={{fontSize:11,color:'var(--text3)',display:'flex',alignItems:'center',gap:3,textDecoration:'none'}}>
                  Get key <ExternalLink size={10}/>
                </a>
              </div>
              <div style={{display:'flex',gap:8}}>
                <div style={{position:'relative',flex:1}}>
                  <input
                    type={showKey[p.key]?'text':'password'}
                    placeholder={settings.apiKeysSet[p.key]?`Saved: ${settings.apiKeys[p.key]}`:`Enter ${p.label} API key`}
                    value={keys[p.key]}
                    onChange={e=>setKeys(k=>({...k,[p.key]:e.target.value}))}
                    style={{width:'100%',padding:'9px 36px 9px 12px',borderRadius:8,fontSize:13,fontFamily:'JetBrains Mono,monospace'}}
                  />
                  <button onClick={()=>setShowKey(s=>({...s,[p.key]:!s[p.key]}))} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center'}}>
                    {showKey[p.key]?<EyeOff size={13}/>:<Eye size={13}/>}
                  </button>
                </div>
                <button onClick={()=>saveKey(p.key)} disabled={!keys[p.key]} className="btn btn-ghost" style={{padding:'9px 12px',opacity:keys[p.key]?1:0.4,flexShrink:0}}>
                  {saved===p.key?<CheckCircle size={13} color="#10b981"/>:'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
