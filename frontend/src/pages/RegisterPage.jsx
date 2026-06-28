import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap,User,Mail,Lock,AlertCircle,ArrowRight } from 'lucide-react';

export default function RegisterPage(){
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form,setForm]=useState({name:'',email:'',password:''});
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async e=>{
    e.preventDefault();setError('');setLoading(true);
    try{await register(form.name,form.email,form.password);navigate('/');}
    catch(err){setError(err.response?.data?.message||'Registration failed');}
    finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px',position:'relative',overflow:'hidden'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{position:'fixed',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',width:'50vw',height:'50vw',maxWidth:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)',top:'-10%',right:'-5%',filter:'blur(40px)'}}/>
        <div style={{position:'absolute',width:'40vw',height:'40vw',maxWidth:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)',bottom:'-5%',left:'-5%',filter:'blur(40px)'}}/>
      </div>

      <div style={{width:'100%',maxWidth:400,position:'relative',zIndex:1}} className="fade-up">
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px',boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}><Zap size={20} color="#fff" strokeWidth={2.5}/></div>
          <div style={{fontWeight:800,fontSize:18,letterSpacing:'-0.4px',background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>TokenTrack</div>
          <div style={{fontSize:13,color:'var(--text2)',marginTop:4}}>Create your free account</div>
        </div>

        <div className="glass" style={{padding:24}}>
          <h2 style={{fontSize:20,fontWeight:800,letterSpacing:'-0.5px',marginBottom:4}}>Get started</h2>
          <p style={{fontSize:13,color:'var(--text2)',marginBottom:18}}>Free forever. No credit card needed.</p>

          {error&&(<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',color:'#fb7185',fontSize:13,marginBottom:14}}><AlertCircle size={14}/>{error}</div>)}

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:13}}>
            {[{key:'name',type:'text',icon:User,label:'Full name',placeholder:'Your name'},{key:'email',type:'email',icon:Mail,label:'Email',placeholder:'you@example.com'},{key:'password',type:'password',icon:Lock,label:'Password',placeholder:'Min 6 characters'}].map(({key,type,icon:Icon,label,placeholder})=>(
              <div key={key}>
                <label style={{fontSize:12,fontWeight:500,color:'var(--text2)',display:'block',marginBottom:6}}>{label}</label>
                <div style={{position:'relative'}}>
                  <Icon size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text3)',pointerEvents:'none'}}/>
                  <input type={type} required placeholder={placeholder} style={{width:'100%',padding:'10px 12px 10px 36px',fontSize:14}} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%',marginTop:4,padding:'12px'}}>
              {loading?<><div style={{width:15,height:15,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.7s linear infinite'}}/> Creating…</>:<><span>Create Account</span><ArrowRight size={15}/></>}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'var(--text3)',marginTop:18}}>Have an account?{' '}<Link to="/login" style={{color:'#818cf8',fontWeight:600,textDecoration:'none'}}>Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
