/**
 * A simple logger that writes to stderr instead of stdout
 * This prevents interference with MCP stdio transport which uses stdout
 */
export class Logger {
  private static instance: Logger;
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private write(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message} ${args
      .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
      .join(' ')}`;

    // Write to stderr to avoid interfering with stdio transport
    process.stderr.write(logMessage + '\n');
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      this.write('DEBUG', message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    this.write('INFO', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.write('WARN', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.write('ERROR', message, ...args);
  }
}

// Export a default instance for convenience
export const logger = Logger.getInstance();
