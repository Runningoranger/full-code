export const getRatio = (size) => {
  return size.width / size.height;
};

export const getBenchmark = (wrapperSize, outerSize) => {
  const result = {
    type: "height",
    value: wrapperSize.height,
  };

  const isWider = getRatio(wrapperSize) > getRatio(outerSize);

  if (isWider) {
    result.type = "width";
    result.value = wrapperSize.width;
  }

  return result;
};

export const getScaleValue = (wrapperSize, benchmark) => {
  // 对象 / 比较标准
  return wrapperSize[benchmark.type] / benchmark.value;
};
