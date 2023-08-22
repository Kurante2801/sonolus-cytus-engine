# Sonolus Cytus Engine

Made for [Sonolus](https://sonolus.com/) using [sonolus.js-template-ts-eslint-prettier](https://github.com/Sonolus/sonolus.js-template-ts-eslint-prettier)

Skin available at [Kurante2801/sonolus-cytus2-skin](https://github.com/Kurante2801/sonolus-cytus2-skin). Tutorial mode not included, no ETA.

## Custom Resources

### Skin Sprites

| Name                              |
| --------------------------------- |
| `Cytus Tap Up`                    |
| `Cytus Tap Down`                  |
| `Cytus Hold Up`                   |
| `Cytus Hold Down`                 |
| `Cytus Hold Bar`                  |
| `Cytus Hold Bar Up`               |
| `Cytus Hold Bar Down`             |
| `Cytus Long Hold`                 |
| `Cytus Long Hold Bar`             |
| `Cytus Hold Indicator Background` |
| `Cytus Long Hold Indicator`       |
| `Cytus Drag Up`                   |
| `Cytus Drag Down`                 |
| `Cytus Drag Child Up`             |
| `Cytus Drag Child Down`           |
| `Cytus Drag Tap Up`               |
| `Cytus Drag Tap Down`             |
| `Cytus Drag Tap Child Up`         |
| `Cytus Drag Tap Child Down`       |
| `Cytus Flick Up`                  |
| `Cytus Flick Down`                |
| `Cytus Flick Arrow`               |

## Module functions

### `cytus2toLevelData(chart)`

Converts a Cytus 2 Source to Sonolus Level Data

-   `chart`: [Cytus2Source](lib/src/c2/index.cts)

## Prerequisites

-   [Node.js](https://nodejs.org) (16+)

## Recommended Setup

-   [Visual Studio Code](https://code.visualstudio.com)
-   [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Get Started

To get this template, run (change `my-project` to desired name):

```
npx degit Sonolus/sonolus.js-template-ts-eslint-prettier my-project
```

To install dependencies, run in project directory:

```
npm i
```

## Start Dev Server

Run in project directory:

```
npm run dev:play
```

```
npm run dev:tutorial
```

A dev server will be up and running. You can connect to it using Sonolus app and play test the level.

Changes made to the project will be automatically detected and trigger rebuild.

Temporary files and extraction artifacts can be found in `.dev`.

## Type Check

Run in project directory:

```
npm run type-check
```

## Lint

Run in project directory:

```
npm run lint
```

## Fix Linting Issues

Run in project directory:

```
npm run lint-fix
```

## Build

Run in project directory:

```
npm run build
```

Build artifacts can be found in `dist`.
