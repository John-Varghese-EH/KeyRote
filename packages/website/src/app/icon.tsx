import { ImageResponse } from 'next/og';

// Route segment config
export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 22,
          background: 'linear-gradient(135deg, #27272a 0%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontFamily: 'sans-serif',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <span style={{ transform: 'translateY(-1px)' }}>K</span>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
