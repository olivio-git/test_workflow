const PurchaseDetailSkeleton = () => {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header Skeleton */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-64"></div>
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex flex-wrap-reverse gap-2 justify-between">
                    <div className="bg-white border border-gray-200 rounded-lg p-2 flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 w-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-32 bg-gray-200 rounded"></div>
                        <div className="h-10 w-40 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-6">
                    {/* Main Info Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Two Column Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            <div className="h-5 bg-gray-200 rounded w-40"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comments Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDetailSkeleton;
