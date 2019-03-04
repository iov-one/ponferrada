The [sanes-chrome-extension](iov-one/ponferrada/blob/master/packages/sanes-chrome-project) project relies on cra' react-script project. We have to maintain our own version because at the moment cra does not support multiple webpack's entry points, and the chrome extension, besides the app itself need the `backgroundscript` and ```contentscript`.

So basically for keeping in a good shape the [oza-react-scripts](iov-one/ponferrada/blob/master/packages/oza-react-scripts) project, on each release of react-scripts, we need to do:

1. Pull cra project targeting a specific release tag

```
git tag -l
git checkout tags/create-react-app@x.y.z
```

2. Copy react-scripts folder and paste in oza-react-scripts (we should remove the old files first)
3. Change `bin/react-scripts.js` to `bin/oza-react-scripts`
4. Remove the templates folder: `template` and `template-typescript`
5. Move back the `.eslintignore` and `.eslintrc.js` files
6. Update the first part of the `package.json` file:

```
{ 
  "name": "oza-react-scripts",
  "version": "0.0.0", <--- Target the actual monorepo version
  "description": "Configuration and scripts for Create React App.",
  "engines": {
    "node": ">=6"
  },
  "files": [
    "bin",
    "config",
    "lib",
    "scripts",
    "template",
    "template-typescript",
    "utils"
  ],
  "bin": {
    "oza-react-scripts": "./bin/oza-react-scripts.js"
  },
  ...
}
```

7. Update `config/webpack.config.js` with necessary changes to support multiple entry points:

Introduce content and background script as webpack's entries

```
entry: {
  main: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    isEnvDevelopment &&
      require.resolve('react-dev-utils/webpackHotDevClient'),
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ].filter(Boolean),
  contentScript: `${process.cwd()}/src/extension/contentscript.ts`,
  backgroundScript: `${process.cwd()}/src/extension/backgroundscript.ts`,
},
```

Generate output in files only by name (TODO improve it)

```
output: {
  ...
  // There will be one main bundle, and one file per asynchronous chunk.
  // In development, it does not produce real files.
  filename: isEnvProduction
    ? 'js/[name].js' // TODO 'static/js/[name].[chunkhash:8].js'
    : isEnvDevelopment && 'static/js/bundle.js',
  // There are also additional JS chunk files if you use code splitting.
  chunkFilename: isEnvProduction
    ? 'js/[name].js' // TODO 'static/js/[name].[chunkhash:8].chunk.js'
    : isEnvDevelopment && 'static/js/[name].chunk.js',
```

Do not generate chunks

```
optimiztion: {
  ...
  // Automatically split vendor and commons
  // https://twitter.com/wSokra/status/969633336732905474
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  splitChunks: {
    cacheGroups: {
      default: false,
    },
    // TODO chunks: 'all',
    // TODO name: false,
  },
  // Keep the runtime chunk separated to enable long term caching
  // https://twitter.com/wSokra/status/969679223278505985
  runtimeChunk: false, //TODO true,
}
```

Only include the app in index.html

```
plugins: [
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: paths.appHtml,
        chunks: ['main'],
      },
      ...
]
```

8. Test it

```
cd ~/path/to/project
lerna clean -y
rm -r node_modules
lerna bootstrap
```
