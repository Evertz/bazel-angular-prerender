load("@io_bazel_rules_sass//sass:sass.bzl", "sass_binary", "sass_library")
load("@npm_angular_bazel//:index.bzl", "ng_module")
load("@npm_bazel_typescript//:defs.bzl", "ts_config", "ts_devserver", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "history_server", "rollup_bundle", "nodejs_binary")
load("@build_bazel_rules_nodejs//internal/web_package:web_package.bzl", "web_package")

ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
    deps = [],
    visibility = ["//public/bazel-angular-prerender:__subpackages__"],
)

ts_config(
    name = "tsconfig_node",
    src = "tsconfig.node.json",
    deps = [],
)

sass_library(
    name = "app_theme",
    srcs = ["_app.theme.scss"],
)

sass_binary(
    name = "app_styles",
    src = "app.component.scss",
)

sass_library(
    name = "angular_material_theming",
    srcs = [
        "@npm//node_modules/@angular/material:_theming.scss",
    ]
)

sass_binary(
    name = "global_app_styles",
    src = "styles.scss",
    deps = [
        ":app_theme",
        ":angular_material_theming",
    ]
)

ng_module(
    name = "server_module",
    srcs = ["app.module.server.ts"],
    deps = [
        ":bazel-angular-prerender",
        "@npm//@angular/core",
        "@npm//@angular/router",
        "@npm//@angular/forms",
        "@npm//@angular/material",
        "@npm//@angular/platform-server",
    ],
    tsconfig = ":tsconfig",
)

ts_library(
    name = "prerender",
    srcs = ["prerender.ts"],
    deps = [
        ":server_module",
        "@npm//@angular/core",
        "@npm//@angular/platform-server",
        "@npm//@types/node"
    ],
    tsconfig = "tsconfig_node",
)

nodejs_binary(
    name = "prerender_bin",
    data = [
        ":prerender",
        "amd-loader.js",
        "@npm//zone.js",
        "@npm//tslib",
        "@npm//@angular/router",
        "@npm//@angular/forms",
        "@npm//@angular/material",
        "@npm//@angular/platform-server",
    ],
    entry_point = "evertz/public/bazel-angular-prerender/prerender.js"
)

genrule(
    name = "prerender_index",
    cmd = "$(location :prerender_bin) $(location index.dev.html) $@",
    outs = ["index.prerender.html"],
    srcs = [
        "index.dev.html",
    ],
    tools = [
        ":prerender_bin"
    ],
    output_to_bindir = 1
)

ng_module(
    name = "bazel-angular-prerender",
    srcs = glob(["*.ts"], exclude = ["app.module.server.ts", "prerender.ts"]),
    assets = [
        ":app_styles",
        "app.component.html",
    ],
    deps = [
        "//public/bazel-angular-prerender/home",
        "@npm//@angular/core",
        "@npm//@angular/common",
        "@npm//@angular/router",
        "@npm//@angular/platform-browser",
        "@npm//@angular/animations",
        "@npm//@angular/material",
        "@npm//@angular/forms",
        "@npm//@angular/cdk",
    ],
    tsconfig = ":tsconfig",
)

ts_devserver(
    name = "devserver",
    # serve these files rooted at /
    additional_root_paths = [
        "npm/node_modules/zone.js/dist",
    ],
    data = [],
    entry_module = "evertz/public/bazel-angular-prerender/main",
    index_html = "index.dev.html",
    scripts = [
        "@npm//node_modules/tslib:tslib.js",
        "//3rdparty/rxjs_shims:rxjs_umd_modules",
        ":require.config.js",
    ],
    # Serve these files in addition to the JavaScript bundle
    static_files = [
        ":global_app_styles",
        "@npm//node_modules/zone.js:dist/zone.min.js",
    ],
    deps = [
        ":bazel-angular-prerender",
    ],
    tags = ["manual"],
)

rollup_bundle(
    name = "bundle",
    # These Angular routes may be lazy-loaded at runtime.
    # So we tell Rollup that it can put them in separate JS chunks
    # (code-splitting) for faster application startup.
    # In the future, we could automatically gather these from statically
    # analyzing the Angular sources.
    additional_entry_points = [],
    entry_point = "evertz/public/bazel-angular-prerender/main",
    deps = [
        ":bazel-angular-prerender",
        "@npm//@angular/core",
        "@npm//@angular/common",
        "@npm//@angular/router",
        "@npm//@angular/forms",
        "@npm//@angular/platform-browser",
        "@npm//@angular/animations",
        "@npm//@angular/material",
        "@npm//@angular/cdk",
        "@npm//@angular/flex-layout",
        "@npm//rxjs",
    ],
)

web_package(
    name = "prodapp",
    additional_root_paths = [
        "npm/node_modules/systemjs/dist",
        "npm/node_modules/zone.js/dist",
    ],
    # do not sort
    assets = [
        ":global_app_styles",
        "@npm//node_modules/zone.js:dist/zone.min.js",
        "@npm//node_modules/systemjs:dist/system.js",
        ":bundle.min.js",
    ],
    data = [
        ":bundle",
    ],
    index_html = ":prerender_index",
)

history_server(
    name = "prodserver",
    data = [
        ":prodapp",
    ],
    templated_args = ["public/bazel-angular-prerender/prodapp"],
)
