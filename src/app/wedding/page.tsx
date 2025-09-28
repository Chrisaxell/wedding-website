import Link from "next/link";

export default function Wedding() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Wedding</h1>
            <p>This page is public. Share general info here.</p>
            <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
                <Link href="/wedding-invite/f8234976-a9a7-4d86-a02f-9539c0307d33">Example invite</Link>
            </nav>
        </main>
    );
}
