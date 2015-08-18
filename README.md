angular-engageform
==================

4screens angular client for engage form

# Installation

You can install this package with `bower`.

```shell
bower install 4screens-engageform
```

# Development

Preparation of the working environment.

```shell
npm install -g gulp bower tsd
npm install
bower install
tsd reinstall --save --overwrite
```

Copy builded module to needed path after any changes (copy after any changes)

```shell
gulp publish --path *path*
```

# Distribute

Release of a new version of the package.

```shell
gulp release --bump
```
