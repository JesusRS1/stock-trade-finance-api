import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from './logging.js';
import { endOfDayTool } from './endOfDay.js';
import { newsTool } from './news.js';
import { forexPricesTool } from './forexPrices.js';
import { forexTopTool } from './forexTop.js';
import { fundamentalsDefinitionsTool } from './fundamentalsDefinitions.js';
import { fundamentalsStatementsTool } from './fundamentalsStatements.js';
import { fundamentalsDailyTool } from './fundamentalsDaily.js';
import { fundamentalsMetaTool } from './fundamentalsMeta.js';
import { dividendsDistributionsTool } from './dividendsDistributions.js';
import { dividendsYieldTool } from './dividendsYield.js';
import { splitsTool } from './splits.js';
import { TiingoToolDefinition } from './types.js';

const tiingoTools: TiingoToolDefinition[] = [
  endOfDayTool,
  newsTool,
  forexPricesTool,
  forexTopTool,
  fundamentalsDefinitionsTool,
  fundamentalsStatementsTool,
  fundamentalsDailyTool,
  fundamentalsMetaTool,
  dividendsDistributionsTool,
  dividendsYieldTool,
  splitsTool,
];

export const registerTiingoTools = (server: McpServer): void => {
  tiingoTools.forEach((tool) => {
    try {
      server.tool(tool.name, tool.description, tool.inputSchemaShape, async (input) => {
        try {
          const result = await tool.handler(input);
          // Format the response according to MCP specification
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          // Handle errors gracefully by returning them in the proper format
          logger.error(`Error in tool ${tool.name}:`, error);
          return {
            content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
          };
        }
      });
      // Use our logger instead of console.log to avoid interfering with stdio transport
      logger.debug(`Registered Tiingo tool: ${tool.name}`);
    } catch (error) {
      // For fatal errors during tool registration, log the error
      logger.error(`Failed to register Tiingo tool ${tool.name}:`, error);
    }
  });
};
