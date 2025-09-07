import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTiingoTools } from './tools/index.js';
import { logger } from './tools/logging.js';

const main = async () => {
  const server = new McpServer({
    name: 'mcp-tiingo',
    version: '1.0.0',
    description: 'MCP Server exposing Tiingo API endpoints as tools.',
  });

  // Register Tiingo tools
  registerTiingoTools(server);

  logger.info('Starting MCP Tiingo Server...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(`Server "mcp-tiingo" connected via stdio.`);
};

main().catch((error) => {
  logger.error('Failed to start MCP server:', error);
  process.exit(1);
});
