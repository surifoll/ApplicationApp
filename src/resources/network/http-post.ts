import { HttpClient, json } from "aurelia-fetch-client";

export class MakeAPICall {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
    this.httpClient.configure((config) => {
      config.useStandardConfiguration().withDefaults({
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "Fetch",
        },
      });
    });
  }

  post(url, payload) {
    return this.httpClient
      .fetch(url, {
        method: "post",
        body: payload,
      })
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error.json();
      });
  }
}
