import fs from "fs-extra";
import path from "path";

// yarn dev启动
// 用 nodemon 来监视 TypeScript 文件的变化，并且当文件变化时自动重启应用
//symlink同步
export const symlinkCommon = async () => {
  const src = path.resolve(__dirname, "../Common");
  const dst = path.resolve(__dirname, "../../../client/assets/Scripts/Common");

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
export const copyCommon = async () => {
  const src = path.resolve(__dirname, "../Common");
  const dst = path.resolve(__dirname, "../../../client/assets/Scripts/Common");
  console.log(src, dst);

  // clean
  await fs.remove(dst);

  //create
  await fs.ensureDir(dst);

  // copy
  await fs.copy(src, dst);
  console.log("同步成功！");
};

export const getTime = () => new Date().toLocaleString().split("├")[0];

export const buffer2ArrayBuffer = (buffer: Buffer) => {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};