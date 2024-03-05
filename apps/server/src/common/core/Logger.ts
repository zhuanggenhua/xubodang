import chalk from "chalk";

enum LogLevel {
  Info,
  Warn,
  Error,
  Fatal,
}

const getLogLevelString = (level: LogLevel) => LogLevel[level];

/***
 * 日志模块
 */
export class Logger {
  private log(text: string) {
    console.log(text);
    //TODO 这里可以把日志存进日志数据库（如HBase + ES）后续做数据分析
  }

  /***
   * 常规日志
   */
  info(...args: any[]) {
    const text = chalk.blue(`[${getLogLevelString(LogLevel.Info)}]:`, ...args);
    this.log(text);
  }

  /***
   * 不影响业务的警告，例如某些缓存失效
   */
  warn(...args: any[]) {
    const text = chalk.yellow(`[${getLogLevelString(LogLevel.Warn)}]:`, ...args);
    this.log(text);
  }

  /***
   * 某个业务异常了，例如角色补血，数据库更新HP失败
   */
  error(...args: any[]) {
    const text = chalk.red(`[${getLogLevelString(LogLevel.Error)}]:`, ...args);
    this.log(text);
  }

  /***
   * 程序完全崩溃，常用于项目初始化，保证各个服务启动正常
   */
  fatal(...args: any[]) {
    const text = chalk.red(`[${getLogLevelString(LogLevel.Fatal)}]:`, ...args);
    this.log(text);
  }
}
