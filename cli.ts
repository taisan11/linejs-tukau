import { Client } from "@evex/linejs";
import { intro, outro, confirm, select, multiselect, spinner, isCancel, cancel, text } from '@clack/prompts';
import {renderANSI}from "uqr"
import { FileStorage } from "@evex/linejs/storage";
import "@std/dotenv/load"
import { toLines } from "@std/streams/unstable-to-lines";

console.log("LCC ver 1.0.0")
const client = new Client({
	storage: new FileStorage("mybot.json"),
});


client.on("qrcall",(url) => {
  console.log("Scan this QR code to login\n")
  console.log(renderANSI(url,{ecc:"M"}))
})

client.on("pincall", (pincode) => {
  console.log("Please input this pincode to login\n")
  console.log(`pincode: ${pincode}`);
});

client.on("ready", async (user) => {
	console.log(`hello!! ${user.displayName} (${user.mid});`);
	// console.log(await client.getProfile());
});

client.on("update:authtoken", (authtoken) => {
	console.log("AuthToken", authtoken);
});

client.on("end",(user) => {
    console.log(`Bye bye!!${user.displayName}`)
    Deno.exit(0)
})

client.on("message", async (message) => {
    console.log(message)
    if(message.content == "ping"){
        await message.reply("pong")
    }
    if (message.content == "!hello") {
      await client.updateProfile({ displayName: "Hello" });
    }
})

await client.login({
	authToken:Deno.env.get("AuthToken"),
	qr:true,
	polling:["talk","square"]
});