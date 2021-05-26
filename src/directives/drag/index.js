export const drag = {
  inserted(el, binding) {
    el.setAttribute("draggable", true);
    el.data = binding.value;
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", JSON.stringify(el.data));
    });
  },
  componentUpdated(el, binding) {
    el.data = binding.value;
  },
};

export const drop = {
  inserted(el, binding) {
    let lastenter = null;
    el.addEventListener("dragover", event => {
      event.preventDefault();
    });

    el.addEventListener("dragenter", event => {
      lastenter = event.target;
      el.classList.add("isDrag");
    });
    el.addEventListener("dragleave", event => {
      if (lastenter === event.target){
        el.classList.remove("isDrag");
      }
    });
    el.addEventListener("drop", event => {
      event.preventDefault();
      el.classList.remove("isDrag");
      const dragData = event.dataTransfer.getData("text/plain");
      if (!dragData) return;
      binding.value(JSON.parse(dragData));
    });
  },
};

/**
* @description 在视图内任意移动某个元素 v-moveEl="value""  value为计算属性
* @param {Object} binding.value.disable 是否移动
* @param {Function} binding.value.callBack 移动结束回调
*/
export const moveEl = {
  inserted(el, binding) {
    if (!binding.value.enable) return;
    el.onmousedown = (downEvent) => {
      const oldClient = {
        clientX: downEvent.clientX,
        clientY: downEvent.clientY,
      }
      const elx = downEvent.clientX - el.offsetLeft;
      const ely = downEvent.clientY - el.offsetTop;
      document.onmousemove = (moveEvent) => {
        let l = moveEvent.clientX - elx;
        let t = moveEvent.clientY - ely;
        el.style.left = l + "px";
        el.style.top = t + "px";
      }
      document.onmouseup = (upEvent) => {
        const newClient = {
          clientX: upEvent.clientX,
          clientY: upEvent.clientY,
        }
        document.onmousemove = null;
        document.onmouseup = null;
        binding.value.mouseup(oldClient, newClient);
      }
    }
  }

}