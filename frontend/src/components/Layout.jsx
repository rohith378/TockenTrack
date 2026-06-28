import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Send, History, GitCompare, Calculator, LogOut, Zap, ChevronDown, Settings, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/request', icon: Send,            label: 'Request' },
  { to: '/history', icon: History,         label: 'History' },
  { to: '/compare', icon: GitCompare,      label: 'Compare' },
  { to: '/calc',    icon: Calculator,      label: 'Calc' },
  { to: '/settings',icon: Settings,        label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.6)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}
        .nav-link{display:flex;align-items:center;gap:6px;padding:6px 11px;border-radius:9px;font-size:13px;font-weight:500;color:var(--text2);text-decoration:none;transition:all 0.2s;white-space:nowrap;}
        .nav-link:hover{color:var(--text1);background:rgba(255,255,255,0.05);}
        .nav-link.active{color:#fff;background:rgba(99,102,241,0.15);box-shadow:inset 0 0 0 1px rgba(99,102,241,0.25);}
        .mob-link{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;padding:6px 2px;font-size:10px;font-weight:500;color:var(--text3);text-decoration:none;transition:color 0.2s;border-radius:8px;}
        .mob-link.active{color:#818cf8;}
        .mob-link:hover{color:var(--text2);}
        .drawer-link{display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:10px;font-size:14px;font-weight:500;color:var(--text2);text-decoration:none;transition:all 0.2s;}
        .drawer-link:hover{color:var(--text1);background:rgba(255,255,255,0.05);}
        .drawer-link.active{color:#fff;background:rgba(99,102,241,0.15);}
        .drop-item{display:flex;align-items:center;gap:9px;width:100%;padding:9px 12px;border-radius:8px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--sans);transition:background 0.15s;}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.04);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all 0.2s;flex-shrink:0;}
        .icon-btn:hover{border-color:var(--border2);color:var(--text1);}
        @media(min-width:769px){.mob-only{display:none!important;}}
        @media(max-width:768px){.desk-only{display:none!important;}}
      `}</style>

      {/* Navbar */}
      <header style={{ position:'sticky',top:0,zIndex:40,background:'rgba(7,13,26,0.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1320,margin:'0 auto',padding:'0 16px',height:56,display:'flex',alignItems:'center',gap:8 }}>

          {/* Logo */}
          <div style={{ display:'flex',alignItems:'center',gap:9,flexShrink:0,cursor:'pointer',marginRight:8 }} onClick={()=>navigate('/')}>
            <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(99,102,241,0.4)' }}>
              <Zap size={16} color="#fff" strokeWidth={2.5}/>
            </div>
            <span style={{ fontWeight:800,fontSize:16,letterSpacing:'-0.4px',background:'linear-gradient(135deg,#e0e7ff,#c7d2fe)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>TokenTrack</span>
          </div>

          {/* Desktop nav */}
          <div className="desk-only" style={{ width:1,height:20,background:'var(--border)',flexShrink:0 }}/>
          <nav className="desk-only" style={{ display:'flex',alignItems:'center',gap:2,flex:1,overflowX:'auto' }}>
            {NAV.map(({ to,icon:Icon,label,exact })=>(
              <NavLink key={to} to={to} end={exact} className={({isActive})=>`nav-link${isActive?' active':''}`}>
                <Icon size={14} strokeWidth={2}/>{label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display:'flex',alignItems:'center',gap:8,marginLeft:'auto',flexShrink:0 }}>
            <div className="desk-only" style={{ display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:20,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',animation:'pulse-dot 2s infinite' }}/>
              <span style={{ fontSize:11,fontWeight:600,color:'#10b981' }}>LIVE</span>
            </div>
            <button className="icon-btn" onClick={toggleTheme}>
              {theme==='dark'?<Sun size={14}/>:<Moon size={14}/>}
            </button>
            {/* Desktop user */}
            <div className="desk-only" style={{ position:'relative' }}>
              <button onClick={()=>setUserOpen(o=>!o)} style={{ display:'flex',alignItems:'center',gap:7,padding:'5px 10px 5px 5px',borderRadius:10,border:'1px solid var(--border)',background:'rgba(255,255,255,0.04)',cursor:'pointer',color:'var(--text2)',fontSize:13,fontWeight:500,fontFamily:'var(--sans)',transition:'all 0.2s' }}>
                <div style={{ width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:11 }}>{user?.name?.[0]?.toUpperCase()}</div>
                <span>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={12} style={{ transform:userOpen?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s' }} color="var(--text3)"/>
              </button>
              {userOpen&&(
                <>
                  <div style={{ position:'fixed',inset:0,zIndex:40 }} onClick={()=>setUserOpen(false)}/>
                  <div style={{ position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:50,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:12,minWidth:200,padding:6,boxShadow:'0 20px 60px rgba(0,0,0,0.5)',animation:'slideDown 0.18s ease' }}>
                    <div style={{ padding:'10px 12px 12px',borderBottom:'1px solid var(--border)',marginBottom:4 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:'var(--text1)' }}>{user?.name}</div>
                      <div style={{ fontSize:11,color:'var(--text3)',marginTop:2 }}>{user?.email}</div>
                    </div>
                    <button className="drop-item" style={{ color:'var(--text2)' }} onClick={()=>{ navigate('/settings');setUserOpen(false); }}><Settings size={14}/> Settings</button>
                    <button className="drop-item" style={{ color:'var(--red)' }} onClick={()=>{ logout();navigate('/login');setUserOpen(false); }}><LogOut size={14}/> Sign out</button>
                  </div>
                </>
              )}
            </div>
            {/* Mobile menu btn */}
            <button className="icon-btn mob-only" onClick={()=>setMenuOpen(true)}><Settings size={14}/></button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen&&(
        <div style={{ position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)' }} onClick={()=>setMenuOpen(false)}>
          <div style={{ position:'absolute',top:0,right:0,bottom:0,width:260,background:'var(--bg2)',borderLeft:'1px solid var(--border)',padding:'20px 12px',display:'flex',flexDirection:'column',gap:6,animation:'slideRight 0.22s ease' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <span style={{ fontWeight:700,fontSize:15,color:'var(--text1)' }}>Menu</span>
              <button onClick={()=>setMenuOpen(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text2)' }}><X size={18}/></button>
            </div>
            <div style={{ padding:'10px 12px',borderRadius:10,background:'rgba(255,255,255,0.03)',marginBottom:4 }}>
              <div style={{ fontSize:13,fontWeight:600,color:'var(--text1)' }}>{user?.name}</div>
              <div style={{ fontSize:11,color:'var(--text3)',marginTop:2 }}>{user?.email}</div>
            </div>
            {NAV.map(({ to,icon:Icon,label,exact })=>(
              <NavLink key={to} to={to} end={exact} className={({isActive})=>`drawer-link${isActive?' active':''}`} onClick={()=>setMenuOpen(false)}>
                <Icon size={16}/>{label}
              </NavLink>
            ))}
            <div style={{ marginTop:'auto',paddingTop:16,borderTop:'1px solid var(--border)' }}>
              <button onClick={()=>{ logout();navigate('/login'); }} style={{ display:'flex',alignItems:'center',gap:9,width:'100%',padding:'10px 14px',borderRadius:10,border:'none',background:'rgba(244,63,94,0.08)',color:'var(--red)',fontWeight:500,fontSize:13,cursor:'pointer',fontFamily:'var(--sans)' }}>
                <LogOut size={14}/> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <main style={{ maxWidth:1320,margin:'0 auto',padding:'20px 16px 90px' }}>
        <Outlet/>
      </main>

      {/* Mobile bottom nav */}
      <div className="mob-only" style={{ position:'fixed',bottom:0,left:0,right:0,zIndex:40,background:'rgba(7,13,26,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-around',alignItems:'center',padding:'8px 4px',paddingBottom:'max(8px, env(safe-area-inset-bottom))' }}>
        {NAV.slice(0,5).map(({ to,icon:Icon,label,exact })=>(
          <NavLink key={to} to={to} end={exact} className={({isActive})=>`mob-link${isActive?' active':''}`}>
            <Icon size={21} strokeWidth={1.8}/>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
