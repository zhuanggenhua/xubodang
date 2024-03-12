import { ApiFunc, ProtoPathEnum } from "./enum";

/***
 * 根据消息类型获取生成coder需要的path
 */
export const getProtoPathByApiFunc = (
  name: ApiFunc,
  type: "req" | "res"
) => {
  //小于gap是api，否则是msg
  if (name < ApiFunc.gap) {
    return ProtoPathEnum[name][type];
  } else {
    return ProtoPathEnum[name];
  }
};

export const deepClone = (obj: any) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const res: Record<string, any> = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key]);
    }
  }

  return res;
};
