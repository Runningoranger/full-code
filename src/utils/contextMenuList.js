
import { getBase64FromCanvas, downloadFile } from "./download";

// 菜单构造器
function constructorFn(moduleCode, routerName, label) {
  return {
    moduleCode,
    routerName,
    label,
    onClick(params) {

      this.$router.push({
        name: routerName,
        query: {
          ...params
        }
      });
    }
  };
}
// 右键&截图 下载
function download(moduleCode = "download", label = "下载") {
  return {
    moduleCode,
    label,
    onClick(params) {
      let width, height, base64;

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = params.src;
  
      image.onload = () => {
        width = image.width;
        height = image.height;
        base64 = getBase64FromCanvas(image, width, height);
  
        let filename = new Date().getTime().toString();
        downloadFile(filename, base64);
      };
    },
  }
}

//  入库
function storage(moduleCode = "SENSECAMPUS000105", routerName = "library", label = "入库") {
  return constructorFn(moduleCode, routerName, label);
}

function retrivalMenu(moduleCode, routerName, label) {
  return constructorFn(moduleCode, routerName, label)
}

// 子菜单
const getRetrieval = (retrivalMenu) => {
  return {  
    moduleCode: "SC0033",
    label: "检索",
    menu: [
      retrivalMenu("SC0019", "intelligentHome", "智能检索"),
      retrivalMenu("SC0039", "offlineSearchHome", "离线检索"),
      retrivalMenu("SC0002", "faceHome", "人脸检索"),
      retrivalMenu("SC0013", "bodyHome", "行人检索"),
      retrivalMenu("SC0016", "vehicleHome", "车辆检索"),
      retrivalMenu("SC0014", "integrationHome", "融合检索" ),
      retrivalMenu("SC0021", "identityHome", "身份检索"),
      retrivalMenu("SC0017", "archivesHome", "档案检索"),
    ],
  };
};
//  菜单公共部分
const getPublicMenus = (modulesType, retrivalMenu) => {
  const DEFAULT = retrivalMenu("SC0003", "control-tasks-task", "布控");
  const publicMenus = {
    FACE: retrivalMenu("SC0002", "faceHome", "人脸检索"),
    PEDESTRIAN: retrivalMenu("SC0013", "bodyHome", "行人检索"),
    VEHICLE: retrivalMenu("SC0016", "vehicleHome", "车辆检索"),
    PORTRAIT: retrivalMenu("SC0021", "identityHome", "身份检索"),
    INTEGRATION: retrivalMenu("SC0014", "integrationHome","融合检索"),
    INTELLIGENT: retrivalMenu("SC0019", "intelligentHome", "智能检索"),
    OFFLINE: retrivalMenu("SC0039", "offlineSearchHome", "离线检索"),
    ARCHIVES: retrivalMenu("SC0017", "archivesHome", "档案检索"),
  };
  const pub = publicMenus[modulesType];
  const resMenu = pub ? [pub] : [];
  return [...resMenu, DEFAULT];
};

//  右键菜单
const FACE = [...getPublicMenus("FACE", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const PEDESTRIAN = [...getPublicMenus("PEDESTRIAN", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const VEHICLE = [...getPublicMenus("VEHICLE", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const PORTRAIT = [...getPublicMenus("PORTRAIT", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const INTEGRATION = [...getPublicMenus("INTEGRATION", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const INTELLIGENT = [...getPublicMenus("INTELLIGENT", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const OFFLINE = [...getPublicMenus("OFFLINE", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];
const ARCHIVES = [...getPublicMenus("ARCHIVES", retrivalMenu), getRetrieval(retrivalMenu), storage(), download()];

const CONTEXTMENUS = {
  FACE,
  PEDESTRIAN,
  VEHICLE,
  PORTRAIT,
  INTEGRATION,
  INTELLIGENT,
  ARCHIVES,
  OFFLINE,
};

export default CONTEXTMENUS;
