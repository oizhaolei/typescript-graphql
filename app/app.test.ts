import request from "supertest";
import App from "./app";

describe("Test the root path", async () => {
  const { app, server } = await App();
  test("It should response the GET method", async () => {
    const response = await request(app).get(server.graphqlPath);
    expect(response.status).toBe(200);
    expect(response.text).toEqual("text");
  });
});