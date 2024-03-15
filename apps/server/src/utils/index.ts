export const getTime = () => new Date().toLocaleString().split("├")[0];

export const buffer2ArrayBuffer = (buffer: Buffer) => {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};