export const loadmore = {
  bind(el, binding) {
    let scrollTop = 0;
    let top = 0;
    let down = true;

    let dom = el.querySelector(".scroller-wrap");
    if (!dom) return;

    dom.addEventListener("scroll", function() {
      // 判断是否向下滚动
      scrollTop = this.scrollTop;
      down = top < scrollTop ? true : false;
      top = scrollTop;
      // 判断是否到底
      const sign = 10;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      if (scrollDistance <= sign && down) {
        binding.value();
      }
    });
  },
};
