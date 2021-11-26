import { getRectangleFrame } from "./format";
import { uniqWith, isEqual } from "lodash";

export const formatFrameData = (frameData) => {
  // 处理frame数据
  let frameList = [];
  const frameStyles = {
    roi: {
      strokeStyle: '#3e96d7',
      fillStyle: 'rgba(62, 150, 215, .4)',
      coordSys: "percentage"
    }
  }
  if (frameData && Array.isArray(frameData)) {
    frameList = frameData.map((l) => {
      const setStyle = (l.label && frameStyles[l.label]) || {};
      return {
        strokeStyle: '#E04949',
        fillStyle: 'rgba(224, 73, 73, 0.3)',
        vertices: l.vertices,
        coordSys: 'absolute',
        lineWidth: 2,
        ...setStyle
      };
    });
  } else {
    console.warn('缺失参数frameData');
  }
  return frameList;
}

export const getDrawingOrigin = (draweData) => {

  let drawObj = {};
  let frameList = [];
  let pointList = [];

  draweData?.length && draweData.map(item => {
    if (item.type === "POLYGON"){
      frameList.push(item);
    }else if (item.type === "RECTANGLE") {
      const rectangleItem = getRectangleFrame(item);
      frameList.push(rectangleItem);
    }else if (item.type === "POINT_PAIR" || item.type === "POINT") {
      pointList.push(item);
    }
  });

  // 1.检测框的数据
  if (frameList.length) {
    drawObj.frame = formatFrameData(frameList);
  }

  // 2.点线数据
  if (pointList.length) {
    let lines = [];
    let points = [];
    pointList.map((point) => {
      //  线
      if (point.type === "POINT_PAIR" && point.vertices.length) {
        lines.push({
          strokeStyle: "#E04949",
          fillStyle: "#E04949",
          line: point.vertices,
          coordSys: "absolute",
          lineWidth: 2
        });
      }
      //  点
      if (point.type === "POINT" && point.vertices.length) {
        const vertexs = point.vertices;
        vertexs.map(vertice => {
          vertice && points.push({
            strokeStyle: "#E04949",
            fillStyle: "#E04949",
            point: vertice,
            coordSys: "absolute",
            lineWidth: 2
          });
        })
      }
    });
    lines.length && (drawObj.line = lines);
    points.length && (drawObj.point = uniqWith(points, isEqual));
  }
  return drawObj;
}