import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const alt = 'Ticehurst Grounds & Gardens — Garden Maintenance & Exterior Cleaning Kent'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default async function Image() {
  return new ImageResponse(
    <div style={{ background:'#1C3D2A', width:'100%', height:'100%', display:'flex',
      flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:'80px',
      fontFamily:'system-ui, sans-serif', position:'relative' }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:16, background:'#A4C856' }} />
      <div style={{ marginLeft:32 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#A4C856', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:24 }}>KENT &amp; EAST SUSSEX</div>
        <div style={{ fontSize:72, fontWeight:900, color:'#FFFFFF', lineHeight:0.9, textTransform:'uppercase', marginBottom:28 }}>Ticehurst</div>
        <div style={{ fontSize:42, fontWeight:700, color:'#7DBF8E', textTransform:'uppercase', marginBottom:40 }}>Grounds &amp; Gardens</div>
        <div style={{ fontSize:24, color:'#A8D5B5' }}>Professional garden maintenance &amp; exterior cleaning</div>
        <div style={{ fontSize:20, color:'#7DBF8E', marginTop:16 }}>Free no-obligation quotes · Fully insured · Kent &amp; East Sussex</div>
      </div>
    </div>, { ...size }
  )
}
