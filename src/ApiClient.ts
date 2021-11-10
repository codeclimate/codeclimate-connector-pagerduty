import { URL } from "url";
import * as https from "https";

export class ResponseError extends Error {
 constructor(message: string) {
  super(message);
  this.name = ResponseError.name;
  Object.setPrototypeOf(this, ResponseError.prototype);
 }
}
export class NotFoundError extends ResponseError {
 constructor(message: string) {
  super(message);
  this.name = NotFoundError.name;
  Object.setPrototypeOf(this, NotFoundError.prototype);
 }
}
export class UnauthorizedError extends ResponseError {
 constructor(message: string) {
  super(message);
  this.name = UnauthorizedError.name;
  Object.setPrototypeOf(this, UnauthorizedError.prototype);
 }
}
export class ServerError extends ResponseError {
 constructor(message: string) {
  super(message);
  this.name = ServerError.name;
  Object.setPrototypeOf(this, ServerError.prototype);
 }
}

const BASE_URL = "https://api.pagerduty.com";
const VELOCITY_HOST_NAME = "velocity.codeclimate.com";

export class ApiClient {
 constructor(public apiToken: string) {}

 post(path: string, record: any): any {
  const options = {
   hostname: VELOCITY_HOST_NAME,
   port: 443,
   path: path,
   method: "POST",
   headers: {
    Authorization: `token ${this.apiToken}`,
    "Content-Type": "application/vnd.api+json",
   },
  };

  const buildRecord = JSON.stringify({
   data: {
    type: "events",
    attributes: {
     sourcePayload: record,
    },
   },
  });

  const req = https.request(options, (res) => {
   res.on("data", (d) => {
    process.stdout.write(d);
   });
   res.on("error", (err) => {
    console.log("Error: ", err.message);
   });
  });

  req.write(buildRecord);
  req.end();
 }

 // returns a promise that will resolve to a parsed JSON object
 get(path: string, params?: object): Promise<object> {
  return new Promise((resolve, reject) => {
   https
    .get(
     this.resolveUrl(path, params),
     {
      method: "GET",
      headers: {
       Accept: "application/vnd.pagerduty+json;version=2",
       Authorization: `Token token=${this.apiToken}`,
       "Content-Type": "application/json",
      },
     },
     (resp) => {
      if (resp.statusCode && resp.statusCode >= 500) {
       reject(new ServerError("Server error"));
      } else if (resp.statusCode === 401) {
       reject(new UnauthorizedError("Unauthorized"));
      } else if (resp.statusCode === 404) {
       reject(new NotFoundError("Not found"));
      } else if (resp.statusCode !== 200) {
       reject(new ResponseError(`Did not expect ${resp.statusCode} response`));
      }

      let bodyStr = "";

      resp.on("data", (chunk) => (bodyStr += chunk));
      resp.on("end", () => {
       if (resp.statusCode === 200) {
        resolve(JSON.parse(bodyStr));
       }
      });
     }
    )
    .on("error", (err) => {
     reject(new ResponseError(err.toString()));
    });
  });
 }

 private resolveUrl(path: string, params?: object): URL {
  let url = new URL(path, BASE_URL);

  if (params) {
   Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
   });
  }

  return url;
 }
}
