import {analyze} from './engine.js';
self.onmessage=({data})=>{
  self.postMessage(analyze(data.game,data.options).move);
};
