export const getRectangleFrame = (item) => {
  const { vertices } = item;
  if (!vertices) return { ...item, vertices: [] };
  const newItem = {
    ...item,
    vertices: [
      {
        x: vertices[0].x,
        y: vertices[0].y,
      },
      {
        x: vertices[1].x,
        y: vertices[0].y,
      },
      {
        x: vertices[1].x,
        y: vertices[1].y,
      },
      {
        x: vertices[0].x,
        y: vertices[1].y,
      },
    ],
  };
  return newItem;
}
