load("@io_bazel_rules_sass//sass:sass.bzl", "sass_binary")
load("@npm_angular_bazel//:index.bzl", "ng_module")

sass_binary(
    name = "home_styles",
    src = "home.component.scss",
)

ng_module(
    name = "home",
    srcs = glob(["*.ts"]),
    assets = [
        ":home_styles",
        "home.component.html",
    ],
    deps = [
        "@npm//@angular/core",
        "@npm//@angular/common",
        "@npm//@angular/router",
    ],
    tsconfig = "//public/bazel-angular-prerender:tsconfig",
    visibility = ["//public/bazel-angular-prerender:__subpackages__"],
)
