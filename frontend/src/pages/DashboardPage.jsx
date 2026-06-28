import { useEffect, useState } from 'react';
import { AreaChart,Area,BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis,Tooltip,ResponsiveContainer } from 'recharts';
import { Coins,BarChart3,Send,Star,TrendingUp,Activity,Download,FileText,AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { formatTokens,formatCost,MODELS } from '../utils/tokens';
import { exportCSV,exportPDF } from '../utils/export';

const EMPTY={today:{totalCost:0,totalTokens:0,count:0},week:{totalCost:0,totalTokens:0,count:0},allTime:{totalCost:0,totalTokens:0,count:0},month:{totalCost:0,totalTokens:0,count:0},modelBreakdown:[],weeklyTrend:[],forecast:{daysElapsed:0,daysInMonth:30,currentSpend:0,dailyAvg:0,forecastedSpend:0,monthlyBudget:0,budgetPct:null}};
function merge(r){if(!r||typeof r!=='object')return EMPTY;return{today:{...EMPTY.today,...(r.today||{})},week:{...EMPTY.week,...(r.week||{})},allTime:{...EMPTY.allTime,...(r.allTime||{})},month:{...EMPTY.month,...(r.month||{})},modelBreakdown:Array.isArray(r.modelBreakdown)?r.modelBreakdown:[],weeklyTrend:Array.isArray(r.weeklyTrend)?r.weeklyTrend:[],forecast:{...EMPTY.forecast,...(r.forecast||{})}};}

const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:'8px 12px',fontSize:12,boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}><div style={{color:'var(--text3)',marginBottom:4}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||'#818cf8',fontWeight:700}}>{p.name}: {p.value}</div>)}</div>);
};

export default function DashboardPage(){
  const [data,setData]=useState(EMPTY);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState(false);
  useEffect(()=>{api.get('/stats/dashboard').then(r=>setData(merge(r.data))).catch(()=>setErr(true)).finally(()=>setLoading(false));},[]);

  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300,flexDirection:'column',gap:14}}><div style={{width:32,height:32,borderRadius:'50%',border:'2px solid #6366f1',borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/><span style={{color:'var(--text3)',fontSize:13}}>Loading…</span><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>);
  if(err)return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:300,gap:12}}><div style={{fontSize:36}}>⚠️</div><div style={{fontWeight:600,color:'var(--text1)'}}>Backend unreachable</div><code style={{fontSize:12,background:'var(--bg2)',border:'1px solid var(--border)',padding:'6px 14px',borderRadius:8,color:'#818cf8'}}>cd backend && node server.js</code></div>);

  const modelColors=Object.fromEntries(MODELS.map(m=>[m.key,m.color]));
  const pieData=data.modelBreakdown.filter(m=>m?._id).map(m=>({name:String(m._id),value:Number(m.tokens)||0,color:modelColors[m._id]||'#64748b'}));
  const weeklyData=data.weeklyTrend.filter(d=>d?.date).map(d=>({day:new Date(d.date).toLocaleDateString('en',{weekday:'short'}),tokens:Math.round((Number(d.tokens)||0)/1000),cost:parseFloat((Number(d.cost)||0).toFixed(4))}));
  const BAR_COLORS=['#6366f1','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6'];
  const fc=data.forecast;
  const budgetSet=fc.monthlyBudget>0;
  const budgetPct=fc.budgetPct??0;
  const budgetColor=budgetPct>=100?'#f43f5e':budgetPct>=90?'#f59e0b':budgetPct>=80?'#fbbf24':'#10b981';

  const doExport=async(type)=>{
    try{const{data:exp}=await api.get('/stats/export');const summary={count:exp.requests.length,tokens:exp.requests.reduce((s,r)=>s+r.totalTokens,0).toLocaleString(),cost:exp.requests.reduce((s,r)=>s+r.cost,0)};if(type==='csv')exportCSV(exp.requests,exp.user.name);else exportPDF(exp.requests,exp.user.name,summary);}catch(e){console.error(e);}
  };

  const Empty=({msg})=>(<div style={{height:140,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:13,fontStyle:'italic',textAlign:'center',padding:'0 16px'}}>{msg}</div>);

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      {/* Header */}
      <div className="fade-up" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:'var(--accent)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Overview</div>
          <h1 style={{fontSize:'clamp(22px,4vw,28px)',fontWeight:800,letterSpacing:'-0.5px',margin:0}}>Dashboard</h1>
          <p style={{fontSize:13,color:'var(--text2)',margin:'4px 0 0'}}>Your AI token consumption at a glance</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <button onClick={()=>doExport('csv')} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12}}><Download size={13}/> CSV</button>
          <button onClick={()=>doExport('pdf')} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12}}><FileText size={13}/> PDF</button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        <StatCard icon={Coins}     label="Cost Today"   value={formatCost(data.today.totalCost)}       sub={`${data.today.count} requests`}    color="#6366f1" delay={0}/>
        <StatCard icon={BarChart3} label="Tokens Today" value={formatTokens(data.today.totalTokens)}   sub="All models"                        color="#06b6d4" delay={60}/>
        <StatCard icon={Send}      label="This Week"    value={formatCost(data.week.totalCost)}         sub={`${data.week.count} requests`}     color="#10b981" delay={120}/>
        <StatCard icon={Star}      label="All Time"     value={formatTokens(data.allTime.totalTokens)}  sub={formatCost(data.allTime.totalCost)} color="#f59e0b" delay={180}/>
      </div>

      {/* Forecast + Budget */}
      <div style={{display:'grid',gridTemplateColumns:budgetSet?'1fr 1fr':'1fr',gap:12}} className="fade-up">
        <div className="glass" style={{padding:'16px 20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}><TrendingUp size={13} color="#818cf8"/><span style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Month-End Forecast</span></div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}><span style={{fontSize:22,fontWeight:800,color:'var(--text1)',fontFamily:'var(--mono)'}}>{formatCost(fc.forecastedSpend)}</span><span style={{fontSize:12,color:'var(--text3)'}}>predicted</span></div>
          <div style={{fontSize:12,color:'var(--text3)',marginTop:4}}>Current: {formatCost(fc.currentSpend)} · avg {formatCost(fc.dailyAvg)}/day</div>
        </div>
        {budgetSet&&(
          <div className="glass" style={{padding:'16px 20px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}><div style={{display:'flex',alignItems:'center',gap:7}}>{budgetPct>=80?<AlertTriangle size={13} color={budgetColor}/>:<Coins size={13} color={budgetColor}/>}<span style={{fontSize:11,fontWeight:600,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Budget</span></div><span style={{fontSize:12,fontWeight:700,color:budgetColor}}>{budgetPct.toFixed(0)}%</span></div>
            <div style={{height:6,borderRadius:3,background:'var(--bg3)',marginBottom:6}}><div style={{height:6,borderRadius:3,width:`${Math.min(100,budgetPct)}%`,background:budgetColor,transition:'width 0.6s'}}/></div>
            <div style={{fontSize:12,color:'var(--text3)'}}>{formatCost(fc.currentSpend)} of {formatCost(fc.monthlyBudget)}</div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)',gap:12}} className="fade-up">
        <div className="glass" style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:16}}><TrendingUp size={14} color="#6366f1"/><span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>7-Day Token Trend</span></div>
          {weeklyData.length>0?(
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData} margin={{top:4,right:4,left:0,bottom:0}}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="day" tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} unit="K" width={32}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="tokens" name="Tokens(K)" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" dot={{fill:'#6366f1',r:2.5,strokeWidth:0}}/>
              </AreaChart>
            </ResponsiveContainer>
          ):<Empty msg="Make your first request to see the trend"/>}
        </div>

        <div className="glass" style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12}}><Activity size={14} color="#06b6d4"/><span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>Model Usage</span></div>
          {pieData.length>0?(
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:6}}>
                {pieData.slice(0,4).map((m,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:11}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:7,height:7,borderRadius:'50%',background:m.color,flexShrink:0}}/><span style={{color:'var(--text2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:80}}>{m.name}</span></div>
                    <span style={{fontWeight:700,color:'var(--text1)'}}>{formatTokens(m.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ):<Empty msg="No model data yet"/>}
        </div>
      </div>

      {/* Bar chart */}
      <div className="glass fade-up" style={{padding:20}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:16}}><BarChart3 size={14} color="#10b981"/><span style={{fontSize:13,fontWeight:600,color:'var(--text1)'}}>Daily Cost (USD)</span></div>
        {weeklyData.length>0?(
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData} barSize={24} margin={{top:4,right:4,left:0,bottom:0}}>
              <XAxis dataKey="day" tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false} unit="$" width={38}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="cost" name="Cost($)" radius={[4,4,0,0]}>{weeklyData.map((_,i)=><Cell key={i} fill={BAR_COLORS[i%BAR_COLORS.length]} fillOpacity={0.85}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        ):<Empty msg="Cost data will appear after tracking requests"/>}
      </div>
    </div>
  );
}
