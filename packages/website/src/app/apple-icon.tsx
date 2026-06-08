import { ImageResponse } from 'next/og';

// Route segment config
export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 110,
          background: 'linear-gradient(135deg, #27272a 0%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontFamily: 'sans-serif',
          borderRadius: '40px', // Standard Apple rounded corner proportion
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.1)',
        }}
      >
        <span style={{ transform: 'translateY(-4px)' }}>K</span>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
