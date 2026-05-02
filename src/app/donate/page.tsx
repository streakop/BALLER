export default function DonatePage() {
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>Support Baller</h2>
      <p style={{ marginBottom: '2rem', color: '#555' }}>
        If you find this platform helpful for your studies, consider supporting its development and server costs!
      </p>
      
      <div style={{ padding: '2rem', border: '1px solid var(--color-cf-border)', backgroundColor: '#fafafa', borderRadius: '8px' }}>
        <h3>Donate via UPI</h3>
        <p style={{ margin: '1rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>your-upi-id@bank</p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>(Replace with your actual payment info or link!)</p>
      </div>
    </div>
  );
}
