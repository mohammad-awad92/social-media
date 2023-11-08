class Logger {
  log(message, env = { DEV: true }, outStream = console.log) {
    if (env[process.env.NODE_ENV]) outStream(`(logged at (${Date()}) : `);
    outStream(message);
  }
}
export default new Logger();
