import React, { Component } from "react";
import { Image, TouchableOpacity, Platform, View } from 'react-native'
import shorthash from 'shorthash'
import RNFS from 'react-native-fs'
import * as X from 'react-native-animatable'
import ImageColors from "react-native-image-colors"
import * as Progress from 'react-native-progress';
import { 
    CacheImageProps, CacheImageState, 
    DownloadBeginCallbackResult, DownloadProgressCallbackResult 
} from "./types/ci_types";




const fadeIn = {
    0: {
        opacity: 0.2
    },
    0.5: {
        opacity: 1
    },
    1: {
        opacity: 0.2
    },
}

export default class CacheImage_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: null,
            wallPaper: "",
            uri: "",
            ready: false,
            path: null,
            downloaded: false,
            downloadProgress: 0,
            indeterminate: true,
        }
    }

    //     loadFile = ( path )=> {
    //         this.setState({ source:{uri:path}}) ;
    //       }
    //   downloadFile = (uri,path) => {

    //     RNFS.downloadFile({fromUrl:uri, toFile: path}).promise
    //         .then(res =>this.loadFile(path));
    //    }
    //   componentDidMount(){
    //     const { uri } = this.props ; 
    //     const name = shorthash.unique(uri);
    //     const extension = (Platform.OS === 'android') ? 'file://' : '' 
    //     const path =`${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    //     RNFS.exists(path).then( exists => {
    //           if(exists)this.loadFile(path) ;
    //           else this.downloadFile(uri,path) ;
    //         })
    //    }

    update_downloadProgress = (prog) => {
        const progress = prog
        this.setState({
            downloadProgress: progress,
            indeterminate: progress > 0 ? false : true
        })
    }

    processCache = async () => {
        this.setState({ downloaded: false });
        const urii = this.state.uri;
        // const uriii = urii ? urii : "http://localhost"
        // const leengt = uriii.length;
        // const uri = 25 >= leengt ? uriii : "http://localhost" + uriii
        const uri2 = urii
        // const uri2 = uri.slice(24, leengt)
        //     alert("failed" + uri)
        //     // alert(eeeeee)
        const name = shorthash.unique(uri2);
        const path = `${RNFS.CachesDirectoryPath}/${name}.png`;
        const imageExist = await RNFS.exists(path);
        const addLinker = Platform.OS === "ios" ? "" : "file://"
        if (imageExist) {
            // alert("EXIST" + path)
            // const image = await RNFS.readDir(path);
            this.setState({
                wallPaper: {
                    uri: addLinker + path
                },
                path: addLinker + path,
                downloaded: true,
            })
            if (this.props.getSize) {
                this.props.getSize(path)
            }
            if (this.props.musicCOver) {
                this.getCoverColors(path)
            }
        } else {
            RNFS.downloadFile({
                fromUrl: uri2,
                toFile: path,
                background: true, // Continue the download in the background after the app terminates (iOS only)**
                discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
                cacheable: true, // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)**

                begin: (res) => {
                    //   console.log("Response begin ===\n\n");
                    //   console.log(res);
                },
                progress: (res) => {
                    //here you can calculate your progress for file download

                    //   console.log("Response written ===\n\n");
                    const progressPent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
                    const progressPercent = progressPent / 100; // to calculate in percentage
                    this.update_downloadProgress(progressPercent)
                    //   console.log("\n\nprogress===",progressPercent)
                    //   this.setState({ progress: progressPercent.toString() });
                    //   item.downloadProgress = progressPercent;
                    //   console.log(res);
                }
            }).promise.then(async (r) => {
                // alert(addLinker + path)
                // alert("downloaded") 
                // const image2 = await RNFS.readDir(path);
                this.setState({
                    wallPaper: {
                        uri: addLinker + path
                    },
                    path: addLinker + path,
                    downloaded: true,
                })
                if (this.props.getSize) {
                    this.props.getSize(path)
                }
                if (this.props.musicCOver) {
                    this.getCoverColors(path)
                }
            }).catch((error) => {
                this.setState({ downloaded: false });
                if (this.props.musicCOver) {
                    this.returnDefaultColors()
                    this.processWallpaper()
                    this.setState({ downloaded: false });
                }
            });
        }
    }

    processOFDir = async () => {
        // const { item, bgColor, color } = this.props;
        const { uri } = this.state;
        const name = shorthash.unique(uri);
        const dir = Platform.OS === "ios" ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath + '/iMaask';
        //////
        RNFS.mkdir(dir + `/media`).then(files => {
            RNFS.mkdir(dir + `/media/Photos`).then(files => {
            }).catch(err => { });
        }).catch(err => { });
        //////
        const path = `${dir}/media/Photos/${name}.png`;
        const addLinker = Platform.OS === "ios" ? "" : "file://"
        const imageExist = await RNFS.exists(path);
        if (imageExist) {
            // alert("exist !")
            // const image = await RNFS.readDir(path);
            this.setState({
                wallPaper: {
                    uri: addLinker + path
                },
                path: addLinker + path,
                downloaded: true,
            })
            if (this.props.getSize) {
                this.props.getSize(addLinker + path)
            }
            if (this.props.musicCOver) {
                this.getCoverColors(addLinker + path)
            }
        } else {
            RNFS.downloadFile({
                fromUrl: uri,
                toFile: path,
                background: true, // Continue the download in the background after the app terminates (iOS only)**
                discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
                cacheable: true, // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)**

                begin: (res) => {
                    //   console.log("Response begin ===\n\n");
                    //   console.log(res);
                },
                progress: (res) => {
                    // progress: (res: DownloadProgressCallbackResult) => {
                    //here you can calculate your progress for file download

                    //   console.log("Response written ===\n\n");
                    const progressPent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
                    const progressPercent = progressPent / 100; // to calculate in percentage
                    this.update_downloadProgress(progressPercent)
                    //   console.log("\n\nprogress===",progressPercent)
                    //   this.setState({ progress: progressPercent.toString() });
                    //   item.downloadProgress = progressPercent;
                    //   console.log(res);
                }
            }).promise.then(async (r) => {
                // alert("downloaded") 
                // const image2 = await RNFS.readDir(path);
                this.setState({
                    wallPaper: {
                        uri: addLinker + path
                    },
                    path: addLinker + path,
                    downloaded: true,
                })
                if (this.props.getSize) {
                    this.props.getSize(addLinker + path)
                }
                if (this.props.musicCOver) {
                    this.getCoverColors(addLinker + path)
                }
            }).catch((error) => {
                this.setState({ downloaded: false });
                if (this.props.musicCOver) {
                    this.returnDefaultColors()
                    this.processWallpaper()
                }
            });

        }
    }

    processWallpaper = async () => {
        const { conversation } = this.props
        if (conversation === true) {
            this.processOFDir()
        } else {
            this.processCache()
        }
    }

    getCoverColors = async (value) => {
        const { returnColor, updateColors } = this.props

        if (returnColor) {
            const colors = await ImageColors.getColors("file://" + value, {
                fallback: "#228B22",
            })

            if (colors.platform === "android") {
                // Access android properties
                // e.g.
                const averageColor = colors.average
                updateColors(colors)
                // alert(JSON.stringify(colors));
            } else {
                updateColors(colors)
            }
        }

    }

    returnDefaultColors = async (value) => {
        const { returnColor, updateColors } = this.props

        if (returnColor) {

            if (Platform.OS === "android") {
                // Access android properties
                // e.g.
                const averageColor = colors.average
                updateColors(colors)
                // alert(JSON.stringify(colors));
            } else {
                const colors = {
                    background: "rgb(128, 127, 128)",
                    detail: "rgb(128, 127, 128)",
                    secondary: "rgb(128, 127, 128)",
                    primary: "rgb(128, 127, 128)",
                }
                updateColors(colors)
            }
        }

    }

    componentDidMount = async () => {
        const { uri, ready } = this.props;
        this.setState({
            uri,
            ready
        })
        if (ready) {
            this.processWallpaper()
        }
        // alert(uri)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.uri !== this.state.uri) {
            this.setState({
                uri: prevState.uri
            })
            if (this.props.stopLoading === true) {
                null
            } else {
                this.processWallpaper()
            }

        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        //   updateMusic_URI
        if (nextProps.uri !== prevState.uri) {
            return { uri: nextProps.uri };
        }

        else return null;
    }

    render() {
        const { wallPaper, path, downloaded } = this.state
        const {
            style, alt_uri, ready, ref, animation, delay,
            easing, useNativeDriver, onLoaded, resizeMode,
            onPress, onLongPress, duration, isStatic, musicCOver,
            returnColor, updateColors, FCMode, blurRadius
        } = this.props;
        // musicCOver={true} rgb(29, 24, 246)
        //                     returnColor={true}
        //                     updateColors={updateColors}
        const offlineImage = downloaded ? wallPaper : alt_uri
        const source = ready ? offlineImage : alt_uri
        const loading_ = downloaded ? false : true
        const loading = ready ? loading_ : false
        // const offlineScreenmode = Personalisations._.DB.DarkMode
        // const color_ = offlineScreenmode === "true" ? "white" : "black"
        const color_ = "black"

        const Additional_style = {tintColor: downloaded ? null : color_};

        const loadedanim = animation ? animation : "bounceIn";
        const fixedanim = loading ? fadeIn : loadedanim;
        const animmmm = ready ? fixedanim : loadedanim
        const animated = isStatic === "true" ? null : animmmm

        const loadedDelay = delay ? delay : 500;
        const fixedDelay = loading ? 0 : loadedDelay;
        const delay_ = ready ? fixedDelay : loadedDelay

        const loadedDuration = duration ? duration : null;
        const fixedDuration = loading ? null : loadedDuration;
        const duration_ = ready ? fixedDuration : loadedDuration
        if (onPress || onLongPress) {
            return (
                <TouchableOpacity
                    onPress={() => { onPress ? onPress(path) : null }}
                    onLongPress={() => { onLongPress ? onLongPress(path) : null }}
                    style={[style, { overflow: "hidden" }]}
                >
                    <X.Image
                        animation={animated}
                        delay={delay_}
                        easing={easing ? easing : "ease-in-out"}
                        duration={duration_}
                        useNativeDriver={useNativeDriver ? useNativeDriver : true}
                        iterationCount={1}
                        style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: style.borderRadius ? style.borderRadius : null,
                            // tintColor: downloaded ? null : color_
                        }}
                        source={source}
                        // ref={ref ? ref : null}
                        onLoaded={onLoaded ? onLoaded : null}
                        resizeMode={resizeMode ? resizeMode : null}
                        blurRadius={blurRadius ? blurRadius : 0}
                    />
                    {
                        loading ?
                            <View
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    backgroundColor: "rgba(0,0,0,0.3)",

                                    justifyContent: "center", alignItems: "center",
                                    borderRadius: style.borderRadius ? style.borderRadius : null,
                                }}
                            >
                                {/* <ActivityIndicator key="loading" color="white" /> */}
                                <Progress.Circle
                                    size={30}
                                    indeterminate={this.state.indeterminate}
                                    progress={this.state.downloadProgress}
                                    thickness={3}
                                    color={"rgba(255,255,255,0.7)"}
                                    strokeCap="round"
                                // borderWidth={7}
                                />
                            </View>
                            :
                            null
                    }
                </TouchableOpacity>
            )
        } else if (musicCOver) {
            return (
                <X.View
                    animation={loadedanim}
                    delay={delay_}
                    duration={duration_}
                    easing={easing ? easing : "ease-in-out"}
                    useNativeDriver={useNativeDriver ? useNativeDriver : true}
                    style={[style, { overflow: "hidden", backgroundColor: downloaded ? null : "rgba(235, 237, 239, 0.7)" }]}
                >
                    <X.Image
                        style={{
                            height: "100%", width: "100%",
                            tintColor: downloaded ? null : "rgba(84,84,86,0.2)",
                            transform: downloaded ? [{ scale: 1 }] : [{ scale: 0.7 }],
                            borderWidth: 0, borderColor: "rgba(255,255,255,0)",
                        }}
                        source={source}
                        // ref={ref ? ref : null}
                        onLoaded={onLoaded ? onLoaded : null}
                        resizeMode={resizeMode ? resizeMode : null}
                        onError={() => {this.setState({ downloaded: false });}}
                        blurRadius={blurRadius ? blurRadius : 0}
                    />
                    {
                        loading ?
                            <View
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    backgroundColor: "rgba(0,0,0,0.3)",

                                    justifyContent: "center", alignItems: "center",
                                    borderRadius: style.borderRadius ? style.borderRadius : null,
                                }}
                            >
                                {/* <ActivityIndicator key="loading" color="white" /> */}
                                <Progress.Circle
                                    size={30}
                                    indeterminate={this.state.indeterminate}
                                    progress={this.state.downloadProgress}
                                    thickness={3}
                                    color={"rgba(255,255,255,0.7)"}
                                    strokeCap="round"
                                // borderWidth={7}
                                />
                            </View>
                            :
                            null
                    }
                </X.View>
            )
        } else if (FCMode) {
            return (
                <X.View
                    animation={animated}
                    delay={delay_}
                    duration={duration_}
                    easing={easing ? easing : "ease-in-out"}
                    useNativeDriver={useNativeDriver ? useNativeDriver : true}
                    iterationCount={1}
                    style={[style, { overflow: "hidden" }]}
                >
                    <Image
                        style={[style, { width: "100%", height: "100%", borderWidth: 0, borderColor: "rgba(255,255,255,0)", }]}
                        source={source}
                        // ref={ref ? ref : null}
                        onLoaded={onLoaded ? onLoaded : null}
                        resizeMode={resizeMode ? resizeMode : null}
                        blurRadius={blurRadius ? blurRadius : 0}
                    />
                    {
                        loading ?
                            <View
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    justifyContent: "center", alignItems: "center",
                                    borderRadius: style.borderRadius ? style.borderRadius : null,
                                }}
                            >
                                {/* <ActivityIndicator key="loading" color="white" /> */}
                                <Progress.Circle
                                    size={30}
                                    indeterminate={this.state.indeterminate}
                                    progress={this.state.downloadProgress}
                                    thickness={3}
                                    color={"rgba(255,255,255,0.7)"}
                                    strokeCap="round"
                                // borderWidth={7}
                                />
                            </View>
                            :
                            null
                    }
                </X.View>
            )
        } else {
            return (
                <View style={[style, { overflow: "hidden", justifyContent: "center", alignItems: "center" }]}>
                    <X.Image
                        animation={animated}
                        delay={delay_}
                        duration={duration_}
                        easing={easing ? easing : "ease-in-out"}
                        useNativeDriver={useNativeDriver ? useNativeDriver : true}
                        iterationCount={1}
                        style={[
                            style, {
                                position: "absolute", top: 0, left: 0,
                                margin: 0, marginLeft: 0, marginRight: 0,
                                marginTop: 0, marginBottom: 0,
                                marginHorizontal: 0, marginVertical: 0,
                                marginEnd: 0, marginStart: 0,
                                borderWidth: 0, borderColor: "rgba(255,255,255,0)",
                                // tintColor: downloaded ? null : color_,
                            }
                        ]}
                        source={source}
                        // ref={ref ? ref : null}
                        onLoaded={onLoaded ? onLoaded : null}
                        resizeMode={resizeMode ? resizeMode : null}
                        blurRadius={blurRadius ? blurRadius : 0}
                    />
                    {
                        loading ?
                            <View
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    borderRadius: style.borderRadius ? style.borderRadius : null,
                                    justifyContent: "center", alignItems: "center"
                                }}
                            >
                                {/* <ActivityIndicator key="loading" color="white" /> */}
                                <Progress.Circle
                                    size={30}
                                    indeterminate={this.state.indeterminate}
                                    progress={this.state.downloadProgress}
                                    thickness={3}
                                    color={"rgba(255,255,255,0.7)"}
                                    strokeCap="round"
                                // borderWidth={7}
                                />
                            </View>
                            :
                            null
                    }
                </View>
            )
        }

    }
}

