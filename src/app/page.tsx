import Link from "next/link";

export default function Home() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Welcome</h1>
            <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
                <Link href="/wedding">Public wedding info</Link>
                <Link href="/admin">Admin</Link>
            </nav>
        </main>
    );
}
