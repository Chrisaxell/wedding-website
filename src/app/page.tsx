'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/invite');
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-4xl font-light text-zinc-700">Coming Soon</h1>
                <p className="mt-4 text-zinc-500">Wedding information will be available here soon.</p>
            </div>
        </main>
    );
}
