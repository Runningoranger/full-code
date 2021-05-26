import Vue from "vue";
import contextMenu from "@/features/ContextMenu";

let elCache = null;
let domCache = null;
let coordinate = {
  x: 0,
  y: 0,
  windowW: 0,
  windowH: 0,
};

const handleShowContextmenu = (el, binding) => {
  el.addEventListener("contextmenu", e => {
    if (!binding.value.imageData) {
      throw new Error("imageData is required params !!!");
    } else {
      const { src, smallSrc } = binding.value.imageData;
      if (!src || !smallSrc) {
        throw new Error("src & smallSrc is required params !!!");
      }
    }
    
    e.preventDefault();

    if (elCache && domCache) {
      document.body.removeChild(domCache);
      vm.$destroy();
    }

    document.addEventListener("click", handleRemove, true);
    window.addEventListener("scroll", handleRemove, true);
    window.addEventListener("dragstart", handleRemove, true);

    coordinate = {
      x: e.clientX,
      y: e.clientY,
      windowW: window.innerWidth,
      windowH: window.innerHeight,
    };

    vm = new Vue({
      render(h) {
        return h(contextMenu, {
          props: {
            coordinate,
            data: binding.value,
          },
        });
      },
    });

    const dom = vm.$mount().$el;
    document.body.appendChild(dom);

    elCache = el;
    domCache = dom;
  });
}

let vm;
export const menu = {
  inserted(el, binding) {
    handleShowContextmenu(el, binding);
  },
  // unbind() {
  //   document.body.removeEventListener("click", handleRemove);
  //   window.addEventListener("scroll", handleRemove, true);

  //   if (elCache && domCache) {
  //     document.body.removeChild(domCache);
  //   }
  //   domCache = null;
  //   elCache = null;
  // },
  update(el, binding) {
    handleShowContextmenu(el, binding);
  }
};

function handleRemove() {
  if (elCache && domCache) {
    document.body.removeChild(domCache);
    vm.$destroy();
  }
  elCache = null;
  domCache = null;
}
