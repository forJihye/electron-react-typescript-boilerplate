import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config"
import './modules/window-printer';
import resolution from './modules/resolution';
import main from "./renderer";

const isDev = process.env.NODE_ENV;

resolution.init(document.getElementById('app') as HTMLDivElement, SCREEN_WIDTH, SCREEN_HEIGHT);
if (isDev) resolution.setMode('contain');

main();
