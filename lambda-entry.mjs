import serverModule from "./dist/server/server.js";

function awsEventMethod(event) {
  return event.httpMethod || event.requestContext?.http?.method || "GET";
}

function awsEventQuery(event) {
  if (typeof event.rawQueryString === "string" && event.rawQueryString) return event.rawQueryString;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...event.queryStringParameters, ...event.multiValueQueryStringParameters })) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((vv) => params.append(k, vv));
    else params.append(k, v);
  }
  return params.toString();
}

function awsEventURL(event) {
  const hostname = event.headers?.host || event.headers?.Host || event.requestContext?.domainName || ".";
  const path = event.path || event.rawPath || "/";
  const query = awsEventQuery(event);
  const proto = (event.headers?.["X-Forwarded-Proto"] || event.headers?.["x-forwarded-proto"]) === "http" ? "http" : "https";
  return new URL(`${path}${query ? `?${query}` : ""}`, `${proto}://${hostname}`);
}

function awsEventHeaders(event) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers || {})) if (value) headers.set(key, value);
  if (event.cookies) for (const cookie of event.cookies) headers.append("cookie", cookie);
  return headers;
}

function awsEventBody(event) {
  if (!event.body) return undefined;
  if (event.isBase64Encoded) return Buffer.from(event.body, "base64");
  return event.body;
}

function awsRequest(event) {
  const method = awsEventMethod(event);
  const url = awsEventURL(event);
  const headers = awsEventHeaders(event);
  const body = method === "GET" || method === "HEAD" ? undefined : awsEventBody(event);
  return new Request(url, { method, headers, body });
}

function isTextType(contentType = "") {
  return /^text\/|\/(javascript|json|xml)|utf-?8/i.test(contentType);
}

async function toBuffer(body) {
  const chunks = [];
  for await (const chunk of body) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function awsResponseBody(response) {
  if (!response.body) return { body: "" };
  const buffer = await toBuffer(response.body);
  return isTextType(response.headers.get("content-type") || "")
    ? { body: buffer.toString("utf8") }
    : { body: buffer.toString("base64"), isBase64Encoded: true };
}

function awsResponseHeaders(response) {
  const headers = {};
  for (const [key, value] of response.headers) headers[key] = value;
  return { headers };
}

export const handler = async (event, context) => {
  const request = awsRequest(event);
  const response = await serverModule.fetch(request, {}, context);
  return {
    statusCode: response.status,
    ...awsResponseHeaders(response),
    ...(await awsResponseBody(response)),
  };
};
