import { MODEL_MAP } from '../utils/tokens';
export default function ModelBadge({ model }) {
  const m = MODEL_MAP[model];
  const c = m?.color || '#64748b';
  return(<span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 8px',borderRadius:5,fontSize:11,fontWeight:500,background:`${c}12`,color:c,border:`1px solid ${c}25`,whiteSpace:'nowrap'}}><span style={{width:5,height:5,borderRadius:'50%',background:c,flexShrink:0}}/>{model}</span>);
}
