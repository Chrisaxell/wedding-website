import Link from 'next/link';
import { readSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  const session = await readSessionFromCookie();

  if (!session) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin Access Required</h1>
        <p>You need to be logged in to access this page.</p>
        <Link href="/login/">Login</Link>
      </main>
    );
  }

  // Fetch all RSVPs directly including contact info
  const rsvps = await prisma.rsvp.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      status: true,
      plusOne: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Session: ✅ logged in</p>
      <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
        <a href="/api/logout">Logout</a>
        <Link href="/invite" style={{ color: '#2563eb' }}>
          View Wedding Invite
        </Link>
      </nav>

      <section style={{ marginTop: 40 }}>
        <h2>RSVPs ({rsvps.length})</h2>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {rsvps.map((rsvp) => {
            const contact = rsvp.email || rsvp.phone || '—';
            return (
              <div key={rsvp.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>
                      <strong>{rsvp.name}</strong>
                    </span>
                    <span>
                      Status: <strong>{rsvp.status}</strong>
                    </span>
                    <span>
                      +1: <strong>{rsvp.plusOne ? 'Yes' : 'No'}</strong>
                    </span>
                    <span style={{ color: '#666' }}>Contact: {contact}</span>
                  </div>
                  <span style={{ color: '#666', fontSize: 12 }}>
                    {new Date(rsvp.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
          {!rsvps.length && <p>No RSVPs yet.</p>}
        </div>
      </section>
    </main>
  );
}
