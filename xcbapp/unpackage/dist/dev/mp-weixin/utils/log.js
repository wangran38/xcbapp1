"use strict";
function saveLog(...args) {
  const message = args.map(
    (arg) => typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(" ");
  try {
    const timeStr = (/* @__PURE__ */ new Date()).toLocaleString();
    const logEntry = `[${timeStr}] ${message}
`;
    const logPath = "_doc/jpush_log.txt";
    plus.io.requestFileSystem(
      plus.io.PRIVATE_DOC,
      (fs) => {
        fs.root.getFile(
          logPath,
          {
            create: true
          },
          (fileEntry) => {
            fileEntry.createWriter(
              (writer) => {
                writer.onwrite = () => {
                };
                writer.onerror = (err) => {
                };
                writer.seek(writer.length || 0);
                writer.write(logEntry);
              },
              (err) => {
              }
            );
          },
          (err) => {
          }
        );
      },
      (err) => {
      }
    );
  } catch (e) {
  }
}
exports.saveLog = saveLog;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/log.js.map
