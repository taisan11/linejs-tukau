import { Client } from "@evex/linejs";
import {renderANSI}from "uqr"
import { FileStorage } from "@evex/linejs/storage";
import "@std/dotenv/load"

const client = new Client({
	storage: new FileStorage("mybot.json"),
});


client.on("qrcall",(url) => {
  console.log(renderANSI(url,{ecc:"M"}))
})

client.on("pincall", (pincode) => {
	console.log(`pincode: ${pincode}`);
});

client.on("ready", async (user) => {
	console.log(`Logged in as ${user.displayName} (${user.mid});`);

	console.log(await client.getProfile());
});

client.on("update:authtoken", (authtoken) => {
	console.log("AuthToken", authtoken);
});

await client.login({
	authToken:Deno.env.get("AuthToken"),
	qr:true,
	polling:["talk","square"]
});

client.getProfile().then(console.log);
client.getAllChatMids().then(console.log);