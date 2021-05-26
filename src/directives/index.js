import { drag, drop } from "./drag";
import { loadmore } from "./loadmore";
import { menu } from "./menu";
import { imagelazy } from './imagelazy';

const objs = {
  drag,
  drop,
  menu,
  loadmore,
  imagelazy
}

const directives = {
  install(Vue) {
    Object.keys(objs).map(key => {
      Vue.directive(key, objs[key]);
    });
  }
}
export default directives;