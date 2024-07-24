import { ofetch } from "ofetch";

const page = await ofetch<string>("https://play.qobuz.com/login");

const bundle = page.match(/\/resources\/\d+\.\d+\.\d+-[a-z]\d{3}\/bundle\.js/);

const js = await ofetch<string>(`https://play.qobuz.com${bundle}`);

const prodAppIdMatch = js.match(
  /production:{api:{appId:"(\d{9})",appSecret:"(\w{32})/
);
const appId = prodAppIdMatch ? prodAppIdMatch[1] : null;

const extrasMatch = js.match(
  /name:"Europe\/Berlin",info:"([^"]+)",extras:"([^"]+)"/
);
const info = extrasMatch ? extrasMatch[1] : null;
const extras = extrasMatch ? extrasMatch[2] : null;

const seedMatch = js.match(
  /d\.initialSeed\("([^"]*)",window\.utimezone\.berlin\)/
);
const seed = seedMatch ? seedMatch[1] : null;

if (appId && info && extras && seed) {
  const step1 = `${seed}${info}${extras}`.slice(0, -44);
  const step1B64 = Buffer.from(step1).toString("base64");

  const step2 = Buffer.from(step1B64, "base64").toString("utf-8");

  const step3 = Buffer.from(step2, "base64").toString("utf-8");

  const secret = step3;
  console.log(`app_id: ${appId}, secret: ${secret}`);

  Bun.write(
    "./data/qobuz.json",
    JSON.stringify({
      app_id: appId,
      secret,
    })
  );
}
