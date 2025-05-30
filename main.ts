import { loginWithQR,loginWithAuthToken, Client } from "@evex/linejs";
import {FileStorage} from "@evex/linejs/storage"
import {renderANSI}from "uqr"
import {consola} from "consola"
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

// 参加中のチャットルーム一覧を取得  
const chats = await client.fetchJoinedChats();  
console.log(`参加中のチャット数: ${chats.length}`);  

// 各チャットの情報を表示  
chats.forEach(chat => {  
    console.log(`チャット名: ${chat.name}, ${chat.mid||""},${chat.raw.picturePath||""}`);  
});

const selected = await consola.prompt("チャットルームを選んでください。",{type:"select",options:chats.map(chat=>({label:chat.name,value:chat.mid}))})

const chat = await client.getChat(selected);
console.log(`選択したチャット: ${chat.name} (${chat.mid})`);
const inputtext = await consola.prompt("メッセージを入力してください。") as string
await chat.sendMessage(inputtext).catch((err) => {
	chat.sendMessage({text:inputtext,e2ee:true}).catch((err) => {
		console.error("メッセージの送信に失敗しました:", err);
	})
})
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