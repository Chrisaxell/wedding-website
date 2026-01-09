export default function RootLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading...</p>
            </div>
        </div>
    );
}
