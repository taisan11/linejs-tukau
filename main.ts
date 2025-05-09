import { loginWithQR,loginWithAuthToken, Client } from "@evex/linejs";
import {FileStorage} from "@evex/linejs/storage"
import {renderANSI}from "uqr"
import "@std/dotenv/load"

const storage = new FileStorage("mybot.json");

// IF文なんかねぇよ
const client = Deno.env.has("AuthToken")
	? await loginWithAuthToken(Deno.env.get("AuthToken")!, {
		device: "IOSIPAD",
		storage
	})
	: await loginWithQR({
		onPincodeRequest: (pin) => {
			console.log("Pincode:", pin);
		},
		onReceiveQRUrl: (url) => {
			console.log(renderANSI(url));
		}
	}, {
		device: "IOSIPAD",
		storage
	});
await client.base.storage.set("time", Date.now());

console.log(`ログインしたのは${client.base.profile?.displayName} (${client.base.profile?.mid})`);

console.log(client.base.authToken||"Auth Tokenがなかったよ!!")


console.log(await client.base.talk.getAllContactIds());
client.base.on("")
client.on("message", async (message) => {
	console.log(message);
	message.raw.contentType
	if (message.text === "!ping") {
		const ping = Date.now() - Number(message.raw.createdTime)
		await message.react("NICE");
		await message.reply("pong!\n Ping: " + ping + "ms");
	}
});

Deno.addSignalListener("SIGINT", () => {
	console.log("SIGINT received, shutting down...");
	client.listeners.clear()
	Deno.exit();
});

client.listen({ talk: true,square:true });