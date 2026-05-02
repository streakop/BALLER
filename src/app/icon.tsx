import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1d4ed8', // Deep blue
          color: 'white',
          fontSize: 320,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          borderRadius: '50%', // This makes it perfectly round!
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
