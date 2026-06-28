import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap,Mail,Lock,AlertCircle,ArrowRight } from 'lucide-react';

export default function LoginPage(){
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form,setForm]=useState({email:'',password:''});
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async e=>{
    e.preventDefault();setError('');setLoading(true);
    try{await login(form.email,form.password);navigate('/');}
    catch(err){setError(err.response?.data?.message||'Invalid email or password');}
    finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',position:'relative',overflow:'hidden'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',width:'50vw',height:'50vw',maxWidth:500,maxHeight:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',top:'-10%',left:'-5%',filter:'blur(40px)'}}/>
        <div style={{position:'absolute',width:'40vw',height:'40vw',maxWidth:400,maxHeight:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)',bottom:'-5%',right:'0%',filter:'blur(40px)'}}/>
      </div>

      {/* Left panel — hidden on mobile */}
      <div style={{flex:1,display:'none',flexDirection:'column',justifyContent:'center',padding:'60px 80px',position:'relative',zIndex:1}} className="login-left">
        <style>{`@media(min-width:900px){.login-left{display:flex!important;}}`}</style>
        <div className="fade-up">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:44}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}><Zap size={17} color="#fff" strokeWidth={2.5}/></div>
            <span style={{fontWeight:800,fontSize:18,letterSpacing:'-0.4px',background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TokenTrack</span>
          </div>
          <div style={{fontSize:12,fontWeight:600,color:'#6366f1',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Welcome back</div>
          <h1 style={{fontSize:'clamp(32px,4vw,42px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-1px',marginBottom:16}}>
            Track every<br/><span className="grad-text">AI token</span><br/>you spend
          </h1>
          <p style={{fontSize:15,color:'var(--text2)',lineHeight:1.7,maxWidth:380}}>Real-time analytics for GPT-4o, Claude, Groq and Gemini.</p>
          <div style={{display:'flex',gap:24,marginTop:36,flexWrap:'wrap'}}>
            {[['142K','Tokens tracked'],['$0.84','Saved today'],['4','AI providers']].map(([v,l])=>(
              <div key={l}><div style={{fontSize:22,fontWeight:800,color:'var(--text1)',letterSpacing:'-0.5px'}}>{v}</div><div style={{fontSize:12,color:'var(--text3)',marginTop:2}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{width:'100%',maxWidth:480,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px',position:'relative',zIndex:1,borderLeft:'1px solid var(--border)',margin:'0 auto'}}>
        <div style={{width:'100%',maxWidth:360}} className="fade-up">
          {/* Mobile logo */}
          <div style={{textAlign:'center',marginBottom:28,display:'block'}} className="mobile-logo">
            <style>{`@media(min-width:900px){.mobile-logo{display:none!important;}}`}</style>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px',boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}><Zap size={20} color="#fff" strokeWidth={2.5}/></div>
            <div style={{fontWeight:800,fontSize:18,letterSpacing:'-0.4px',background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TokenTrack</div>
          </div>

          <div style={{marginBottom:24}}>
            <h2 style={{fontSize:24,fontWeight:800,letterSpacing:'-0.5px',marginBottom:6}}>Sign in</h2>
            <p style={{fontSize:13,color:'var(--text2)'}}>Enter your credentials to continue</p>
          </div>

          {error&&(<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',color:'#fb7185',fontSize:13,marginBottom:16}}><AlertCircle size={14}/>{error}</div>)}

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            {[{key:'email',type:'email',icon:Mail,label:'Email',placeholder:'you@example.com'},{key:'password',type:'password',icon:Lock,label:'Password',placeholder:'••••••••'}].map(({key,type,icon:Icon,label,placeholder})=>(
              <div key={key}>
                <label style={{fontSize:12,fontWeight:500,color:'var(--text2)',display:'block',marginBottom:6}}>{label}</label>
                <div style={{position:'relative'}}>
                  <Icon size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text3)',pointerEvents:'none'}}/>
                  <input type={type} required placeholder={placeholder} style={{width:'100%',padding:'10px 12px 10px 36px',fontSize:14}} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%',marginTop:4,padding:'12px'}}>
              {loading?<><div style={{width:15,height:15,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.7s linear infinite'}}/> Signing in…</>:<><span>Sign In</span><ArrowRight size={15}/></>}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'var(--text3)',marginTop:20}}>No account?{' '}<Link to="/register" style={{color:'#818cf8',fontWeight:600,textDecoration:'none'}}>Create one free →</Link></p>
        </div>
      </div>
    </div>
  );
}
