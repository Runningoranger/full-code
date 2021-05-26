function imageLoad(el, imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  image.onload = () => {
    el.src = imageSrc;
    io.unobserve(el); //  停止观察
  };
}
const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      //  isIntersecting = true 表示目标可见
      setTimeout(() => {
        imageLoad(entry.target, entry.target.data_src);
      }, 100);
    }
  });
};

const options = {};

let io = new IntersectionObserver(callback, options);

export const imagelazy = {
  inserted(el, binding) {
    el.data_src = binding.value;
    io.observe(el); // 观察对象
  },
  unbind() {
    io.disconnect(); // 断开连接
  },
};
