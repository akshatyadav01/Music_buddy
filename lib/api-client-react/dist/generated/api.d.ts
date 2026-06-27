import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { DeleteResult, ErrorResponse, HealthStatus, ListSongsParams, Song, SongStats, SongUpload } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListSongsUrl: (params?: ListSongsParams) => string;
/**
 * Returns all songs, optionally filtered by search query
 * @summary List all songs
 */
export declare const listSongs: (params?: ListSongsParams, options?: RequestInit) => Promise<Song[]>;
export declare const getListSongsQueryKey: (params?: ListSongsParams) => readonly ["/api/songs", ...ListSongsParams[]];
export declare const getListSongsQueryOptions: <TData = Awaited<ReturnType<typeof listSongs>>, TError = ErrorType<unknown>>(params?: ListSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSongs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSongsQueryResult = NonNullable<Awaited<ReturnType<typeof listSongs>>>;
export type ListSongsQueryError = ErrorType<unknown>;
/**
 * @summary List all songs
 */
export declare function useListSongs<TData = Awaited<ReturnType<typeof listSongs>>, TError = ErrorType<unknown>>(params?: ListSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUploadSongUrl: () => string;
/**
 * Upload a new song with audio file, title, and optional poster
 * @summary Upload a song
 */
export declare const uploadSong: (songUpload: SongUpload, options?: RequestInit) => Promise<Song>;
export declare const getUploadSongMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadSong>>, TError, {
        data: BodyType<SongUpload>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadSong>>, TError, {
    data: BodyType<SongUpload>;
}, TContext>;
export type UploadSongMutationResult = NonNullable<Awaited<ReturnType<typeof uploadSong>>>;
export type UploadSongMutationBody = BodyType<SongUpload>;
export type UploadSongMutationError = ErrorType<ErrorResponse>;
/**
* @summary Upload a song
*/
export declare const useUploadSong: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadSong>>, TError, {
        data: BodyType<SongUpload>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadSong>>, TError, {
    data: BodyType<SongUpload>;
}, TContext>;
export declare const getGetSongUrl: (id: number) => string;
/**
 * @summary Get song by ID
 */
export declare const getSong: (id: number, options?: RequestInit) => Promise<Song>;
export declare const getGetSongQueryKey: (id: number) => readonly [`/api/songs/${number}`];
export declare const getGetSongQueryOptions: <TData = Awaited<ReturnType<typeof getSong>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSongQueryResult = NonNullable<Awaited<ReturnType<typeof getSong>>>;
export type GetSongQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get song by ID
 */
export declare function useGetSong<TData = Awaited<ReturnType<typeof getSong>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDeleteSongUrl: (id: number) => string;
/**
 * @summary Delete a song
 */
export declare const deleteSong: (id: number, options?: RequestInit) => Promise<DeleteResult>;
export declare const getDeleteSongMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
    id: number;
}, TContext>;
export type DeleteSongMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSong>>>;
export type DeleteSongMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a song
*/
export declare const useDeleteSong: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSong>>, TError, {
    id: number;
}, TContext>;
export declare const getGetSongStatsUrl: () => string;
/**
 * Returns total songs, total duration, and recently added songs
 * @summary Get song library statistics
 */
export declare const getSongStats: (options?: RequestInit) => Promise<SongStats>;
export declare const getGetSongStatsQueryKey: () => readonly ["/api/songs/stats"];
export declare const getGetSongStatsQueryOptions: <TData = Awaited<ReturnType<typeof getSongStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSongStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSongStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSongStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getSongStats>>>;
export type GetSongStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get song library statistics
 */
export declare function useGetSongStats<TData = Awaited<ReturnType<typeof getSongStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSongStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map