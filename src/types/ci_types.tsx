export interface CacheImageProps {
    uri: string;
    ready?: boolean;
    getSize?: (path: string) => void;
    musicCOver?: boolean;
    returnColor?: boolean;
    updateColors?: (colors: any) => void;
    stopLoading?: boolean;
    style?: any;
    alt_uri?: any;
    ref?: any;
    animation?: any;
    delay?: number;
    easing?: string;
    useNativeDriver?: boolean;
    onLoaded?: () => void;
    resizeMode?: string;
    onPress?: (path: string) => void;
    onLongPress?: (path: string) => void;
    duration?: number;
    isStatic?: string;
    FCMode?: boolean;
    blurRadius?: number;
    conversation?: boolean;
}


export interface CacheImageState {
    this: {
        source: any;
        wallPaper: any;
        uri: string;
        ready: boolean;
        path: string | null;
        downloaded: boolean;
        downloadProgress: number;
        indeterminate: boolean;
    }
}


export type DownloadBeginCallbackResult = any;

export type DownloadProgressCallbackResult = any;