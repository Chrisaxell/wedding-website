export default function LoginPage() {
  const err =
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(globalThis.location.search).get('err');

  // Note: Using a plain HTML form -> server handles redirect + cookie set
  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Log in</h1>
      <form method="POST" action="/api/login" style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        <button type="submit">Enter</button>
      </form>
      {err && <p style={{ color: 'crimson', marginTop: 8 }}>Invalid password</p>}
    </main>
  );
}
