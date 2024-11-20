const { generate } = require("youtube-po-token-generator");
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Please provide a lavalink url");
  process.exit(1);
}

const handle = async () => {
  const url = args[0];
  console.log("Generating poToken and visitorData...");
  const generated = await generate();

  const res = await fetch(url + "/youtube", {
    method: "POST",
    body: JSON.stringify(generated),
  }).catch((err) => {
    console.error("An error occurred while sending the request");
    console.error(err);
    process.exit(1);
  });

  const data = await res.json();
  console.log(data);
};

handle();
