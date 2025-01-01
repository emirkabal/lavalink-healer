const { exec } = require("child_process");
const args = process.argv.slice(2);

const generate = async () => {
  return new Promise((resolve, reject) => {
    exec(
      "docker run quay.io/invidious/youtube-trusted-session-generator",
      (error, stdout, stderr) => {
        if (error) {
          console.error(
            "An error occurred while generating poToken and visitorData"
          );
          console.error(stderr);
          reject(error);
        }
        const visitorData = stdout.match(/visitor_data: (.*)/)[1];
        const poToken = stdout.match(/po_token: (.*)/)[1];
        resolve({ visitorData, poToken });
      }
    );
  });
};

if (args.length === 0) {
  console.error("Please provide a lavalink url");
  process.exit(1);
}

const handle = async () => {
  const url = args[0];
  const password = args[1];
  console.log("Lavalink URL: " + url);
  console.log("Generating poToken and visitorData...");
  const generated = await generate();

  const res = await fetch(url + "/youtube", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: password,
    },
    body: JSON.stringify(generated),
  }).catch((err) => {
    console.error("An error occurred while sending the request");
    console.error(err);
    process.exit(1);
  });

  console.log("Response status code: " + res.status);
};

handle();
