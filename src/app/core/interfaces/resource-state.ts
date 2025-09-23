export interface ResourceState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}