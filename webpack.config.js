export const resolve = {
    fallback: {
        "util": require.resolve("util/"),
        "http": require.resolve("stream-http"),
        "https": "./node_modules/https-browserify",
        "zlib": "./node_modules/browserify-zlib"
    }
};