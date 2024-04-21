import { defineConfig } from "cypress";
import { setupServer } from "msw/node";
import { createServer } from "http";
import next from "next";
import { type MockRequest, createMock } from "./util";

const mswServer = setupServer();
mswServer.listen({
  onUnhandledRequest: "bypass",
});

async function startServer() {
  const app = next({ dev: true });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = createServer((req, res) => {
    handleNextRequests(req, res);
  });

  await new Promise((res, rej) => {
    customServer.listen(3000).once("listening", res).once("error", rej);
  });
  // dummy delay for tick
  await new Promise((res) => {
    setTimeout(res, 0);
  });
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    async setupNodeEvents(on, config) {
      await startServer();
      on("task", {
        mockMSW(p: MockRequest) {
          mswServer.use(createMock(p));
          return null;
        },
        clearMSW() {
          mswServer.resetHandlers();
          mswServer.restoreHandlers();
          return null;
        },
      });
    },
  },
});
