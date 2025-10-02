import Link from 'next/link';
import { readSessionFromCookie } from '@/lib/auth';
import { listInvites } from '@/lib/invites';

export default async function AdminPage() {
  const session = await readSessionFromCookie();
  const invites = await listInvites();

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Session: {session ? '✅ logged in' : '❌ not logged in'}</p>
      <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
        <Link href="/wedding">Public wedding info</Link>
        <Link href="/wedding-invite">Example invite</Link>
        {session ? <a href="/api/logout">Logout</a> : <Link href="/login/">Login</Link>}
      </nav>

      <section style={{ marginTop: 40 }}>
        <h2>Invites</h2>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {invites.map((inv) => (
            <div key={inv.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
              <code style={{ fontSize: 12 }}>{inv.id}</code>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 14 }}>
                <span>Name: {inv.guestName || '—'}</span>
                <span>Lang: {inv.language || '—'}</span>
                <span>RSVP: {inv.rsvp || '—'}</span>
              </div>
              <Link href={`/wedding-invite/${inv.id}`} style={{ fontSize: 12, color: '#2563eb' }}>
                Open invite
              </Link>
            </div>
          ))}
          {!invites.length && <p>No invites yet.</p>}
        </div>
      </section>
    </main>
  );
}
