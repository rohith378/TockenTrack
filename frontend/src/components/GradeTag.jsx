import { gradeColor } from '../utils/tokens';
export default function GradeTag({ grade }) {
  const c = gradeColor(grade);
  return(<span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:36,height:22,borderRadius:5,fontSize:11,fontWeight:700,background:`${c}15`,color:c,border:`1px solid ${c}30`,letterSpacing:'0.03em'}}>{grade}</span>);
}
