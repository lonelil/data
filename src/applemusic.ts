import { ofetch } from "ofetch";

const apple = ofetch.create({
  baseURL: "https://beta.music.apple.com",
});

const home = (await apple("/")) as string;

const index_js_path = home.match(
  /\/assets\/index-legacy-[a-f0-9]+\.js/
)?.[0] as string;

console.log("got index.js path", index_js_path);

const index_js = await apple(index_js_path, {
  parseResponse(responseText) {
    return responseText;
  },
});

const token = index_js.match(/(?=eyJh)(.*?)(?=")/)?.[0];

if (token) {
  console.log("got token", token);

  Bun.write("./data/applemusic.txt", token);
} else {
  console.log("no token found");
}
