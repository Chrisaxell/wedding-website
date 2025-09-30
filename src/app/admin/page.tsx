import Link from 'next/link';
import { readSessionFromCookie } from '@/lib/auth';

export default async function AdminPage() {
  const session = await readSessionFromCookie();

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Session: {session ? '✅ logged in' : '❌ not logged in'}</p>
      <nav style={{ display: 'grid', gap: 8, marginTop: 16 }}>
        <Link href="/wedding">Public wedding info</Link>
        <Link href="/wedding-invite">Example invite</Link>
        {session ? <a href="/api/logout">Logout</a> : <Link href="/login/">Login</Link>}
      </nav>
    </main>
  );
}
