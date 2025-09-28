import Link from "next/link";

export default function Wedding() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Wedding</h1>
            <p>This page is public. Share general info here.</p>
            <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
                <Link href="/weddingInvite/11111111-1111-1111-1111-111111111111">Example invite</Link>
            </nav>
        </main>
    );
}
