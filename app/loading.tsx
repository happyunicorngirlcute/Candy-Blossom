export default function Loading() {
    return (
        <main className="min-h-screen bg-[var(--bg)] transition-colors p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-12 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-6 w-1/2 bg-gray-100 dark:bg-zinc-900 rounded-md"></div>
                </div>

                {/* Content Area Skeleton */}
                <div className="w-full max-w-md mx-auto space-y-4">
                    <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-12 bg-gray-300 dark:bg-zinc-700 rounded-md w-full"></div>
                </div>

                {/* Footer/Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                            <div className="h-4 w-5/6 bg-gray-100 dark:bg-zinc-900 rounded"></div>
                            <div className="h-4 w-4/6 bg-gray-100 dark:bg-zinc-900 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
