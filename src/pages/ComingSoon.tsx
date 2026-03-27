import { Helmet } from 'react-helmet-async';
import { MouseFollowingEyes } from '../components/ui/mouse-following-eyes';

export default function ComingSoon() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a', /* dark background */
      color: '#ffffff',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      gap: '40px'
    }}>
      <Helmet>
        <title>Coming Soon | Dental of Valor</title>
      </Helmet>
      
      <h1 style={{
        fontSize: '5rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center',
        margin: 0,
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        Coming Soon
      </h1>

      <MouseFollowingEyes />
      
    </div>
  );
}
