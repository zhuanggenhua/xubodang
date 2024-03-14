import fs, { Stats } from "fs-extra";
import path from "path";

//symlink同步
export const symlink = async (source: string, target: string) => {
  const src = path.resolve(__dirname, source);
  const dst = path.resolve(__dirname, target);
  console.log(src, dst);

// 检查dst路径是否是一个符号链接，并且该符号链接指向src路径
if (
  (await fs
    .lstat(dst)
    .then((v) => v.isSymbolicLink())
    .catch(() => false)) &&
  (await fs.readlink(dst)) === src
) {
  console.log("同步成功！");
} else {
  // 创建软连接，将 dst 指向 src
  fs.symlink(src, dst)
    .then(() => {
      console.log("同步成功！");
    })
    .catch((e) => {
      console.log("同步失败！", e);
    });
}
};

//copy同步
export const copyCommon = async (source: string, target: string) => {
  const src = path.resolve(__dirname, source);
  const dst = path.resolve(__dirname, target);
  console.log(src, dst);

  // clean
  await fs.remove(dst);

  //create
  await fs.ensureDir(dst);

  // copy
  await fs.copy(src, dst);
  console.log("同步成功！");
};

const main = async () => {
  // 快捷方式
  await symlink(`../common`, `../../../../client/assets/scripts/common`);
  console.log("同步common文件");
  await symlink(`./auto-gen-ws`, `../../../../client/assets/scripts/proto`);
  console.log("同步proto文件");

};

main();
