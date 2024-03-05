import "reflect-metadata";

/***
 * IOC容器
 */
const IOCContainer = new Map();

/***
 * 通过反射获取注入类型，同一进程内返回同一单例（当然也可以自行定制业务）
 */
export const Inject: PropertyDecorator = (target: Object, propertyKey: string | symbol) => {
  const ctor = Reflect.getMetadata("design:type", target, propertyKey);
  let instance = IOCContainer.get(ctor.name);
  if (!instance) {
    instance = new ctor(target.constructor.name);
    IOCContainer.set(ctor.name, instance);
  }
  (target as any)[propertyKey] = instance;
};
