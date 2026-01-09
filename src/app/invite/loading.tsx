export default function Loading() {
    return (
        <main className="mx-auto w-full max-w-[430px] bg-white">
            <div className="animate-pulse">
                {/* Hero skeleton */}
                <div className="px-6 pt-8 pb-4">
                    <div className="mx-auto h-4 w-32 rounded bg-zinc-200"></div>
                    <div className="mx-auto mt-2 h-8 w-48 rounded bg-zinc-300"></div>
                    <div className="mx-auto mt-1 h-3 w-24 rounded bg-zinc-200"></div>
                </div>

                {/* Image skeleton */}
                <div className="px-6">
                    <div className="aspect-[5/8] w-full rounded-lg bg-zinc-200"></div>
                </div>

                {/* Names skeleton */}
                <div className="mt-5 px-6">
                    <div className="mx-auto h-6 w-48 rounded bg-zinc-300"></div>
                    <div className="mx-auto mt-1 h-4 w-64 rounded bg-zinc-200"></div>
                    <div className="mx-auto mt-1 h-4 w-56 rounded bg-zinc-200"></div>
                </div>

                {/* Content skeleton */}
                <div className="mt-10 space-y-10 px-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                            <div className="mx-auto h-3 w-20 rounded bg-zinc-200"></div>
                            <div className="mx-auto mt-2 h-5 w-40 rounded bg-zinc-300"></div>
                            <div className="mt-4 h-32 w-full rounded-lg bg-zinc-200"></div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
