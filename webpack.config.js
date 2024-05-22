export const resolve = {
    fallback: {
        "util": require.resolve("util/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib")
    }
};