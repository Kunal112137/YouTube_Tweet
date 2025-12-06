import {Link} from 'react-router-dom';
import {Aside} from '../../components';
import { FormatDuration } from '../../utils/formatDuration';
import { formatViews } from '../../utils/formatViews';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useGetWatchHistoryQuery } from '../../services/user/userApi';
import { useEffect, useMemo } from 'react';
import { memo } from 'react';
const HistoryVideos = memo(() => {
    const { data, error, isLoading, refetch } = useGetWatchHistoryQuery();
    const videos = useMemo(() => data?.data || [], [data]);

    useEffect(() => {
        refetch(); // run once
    }, []);

    return (
        <>
            <div className="h-screen overflow-y-auto bg-[#121212] text-white">
                <h1 className="sm:ml-[70px] text-4xl sm:text-5xl font-bold p-4 
                    bg-gradient-to-r from-gray-100 via-gray-500 to-gray-800 bg-clip-text text-transparent">
                    Your History
                </h1>

                <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                    <Aside />

                    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
                        {/* Loader */}
                        {isLoading && (
                            <div className="flex h-full items-center justify-center p-8">
                                Loading...
                            </div>
                        )}

                        {/* Error */}
                        {error && !isLoading && (
                            <div className="flex h-full items-center justify-center p-8">
                                <p>Error: {error?.data?.message || "Failed to load"}</p>
                            </div>
                        )}

                        {/* Videos */}
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
                            {!isLoading && !error && videos?.length > 0 ? (
                                videos.map((video) => (
                                    <div key={video._id} className="w-full">
                                        {video?.isPublished && (
                                            <div className="w-full">
                                                <div className="relative mb-2 w-full pt-[56%]">
                                                    <Link to={`/player/${video._id}`}>
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="absolute inset-0 h-full w-full object-cover rounded-lg"
                                                        />
                                                    </Link>
                                                    <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                                                        {FormatDuration(video.duration)}
                                                    </span>
                                                </div>

                                                <div className="flex gap-x-2">
                                                    <Link to={`/channel/${video.owner?.username}`}>
                                                        <img
                                                            src={video.owner?.avatar}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </Link>

                                                    <div className="w-full capitalize">
                                                        <h6 className="mb-1 font-semibold line-clamp-2">
                                                            {video.title}
                                                        </h6>
                                                        <p className="flex text-sm text-gray-200">
                                                            {formatViews(video.views)} Views ·{" "}
                                                            {formatTimeAgo(video.createdAt)}
                                                        </p>
                                                        <p className="text-sm text-gray-200 lowercase">
                                                            @{video.owner?.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center p-4">
                                    <div className="w-full max-w-sm text-center">
                                        <h5 className="mb-2 font-semibold">No videos found</h5>
                                        <p>Your history is empty.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
});

export default HistoryVideos


