import { ofetch } from "ofetch";

const apple = ofetch.create({
  baseURL: "https://beta.maps.apple.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
  },
});

const home = (await apple("/")) as string;

const token = home.match(/(?=eyJh)(.*?)(?=")/)?.[0];

if (token) {
  console.log("got token", token);

  Bun.write("./data/applemaps.txt", token);
} else {
  console.log("no token found");
}
