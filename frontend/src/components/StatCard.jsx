export default function StatCard({ icon: Icon, label, value, sub, color = '#6366f1', delay = 0 }) {
  return (
    <div className="glass glass-hover fade-up" style={{ padding:'18px 20px', animationDelay:`${delay}ms`, cursor:'default' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
        <span style={{ fontSize:11,fontWeight:600,color:'var(--text3)',letterSpacing:'0.05em',textTransform:'uppercase' }}>{label}</span>
        <div style={{ width:34,height:34,borderRadius:9,background:`${color}18`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <Icon size={15} color={color}/>
        </div>
      </div>
      <div style={{ fontSize:26,fontWeight:800,color:'var(--text1)',letterSpacing:'-0.5px',lineHeight:1,marginBottom:6 }}>{value}</div>
      {sub && <div style={{ fontSize:12,color:'var(--text3)' }}>{sub}</div>}
      <div style={{ marginTop:14,height:2,borderRadius:2,background:`linear-gradient(90deg,${color}40,transparent)` }}/>
    </div>
  );
}
