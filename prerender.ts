// shim AMD loading in Node so we don't have to build two versions of the bundle
import './amd-loader';

// MatRipple captures this as an input due to the decorator metadata that's needed
// doesn't seem to make a different here, so just define it
(global as any).HTMLElement = {};

import 'zone.js/dist/zone-node';

import { readFileSync, writeFileSync } from 'fs';

import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';

// @ts-ignore
import { AppPrerenderModuleNgFactory } from './app.module.server.ngfactory';

const indexPath = process.argv[2];
const outputPath = process.argv[3];

const index = readFileSync(indexPath, { encoding: 'utf8' }).toString();

enableProdMode();

renderToHtml('/index.html');

function renderToHtml(url: string): void {
  renderModuleFactory(AppPrerenderModuleNgFactory, { url, document: index })
    .then(html => writeFileSync(outputPath, html, { encoding: 'utf8' }));
}
