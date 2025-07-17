import { loginWithQR,loginWithAuthToken, Client } from "@evex/linejs";
import {FileStorage} from "@evex/linejs/storage"
import {renderANSI}from "uqr"
import {consola} from "consola"
import "@std/dotenv/load"

const storage = new FileStorage("mybot.json");

// IF文なんかねぇよ
const client = await storage.get("AuthToken")
	? await loginWithAuthToken(String(await storage.get("AuthToken")), {
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
await client.base.storage.set("AuthToken", client.base.authToken || "");

console.log(`ログインしたのは${client.base.profile?.displayName} (${client.base.profile?.mid})`);

console.log(client.base.authToken||"Auth Tokenがなかったよ!!")

const mids = await client.base.talk.getAllContactIds({
  syncReason: "INTERNAL",
});

// Use getContacts instead of getContactsV3
const contacts = await client.base.talk.getContacts({ mids });
contacts.forEach(contact => {
	contact.profileId
})

//ChannelIdがわからん!!!
const chaannelToken = await client.base.channel.approveChannelAndIssueChannelToken()

const a = await client.base.fetch(`https://legy-jp.line-apps.com/hm/api/v1/home/profile.json?profileId=${contacts[0].profileId}&styleMediaVersion=v3&profileBannerRevision=436&timelineVersion=v57&storyVersion=v13&homeId=${contacts[0].mid}&getPostCount=false`,{
	headers:{
		"x-line-global-config":"discover.enable=true; follow.enable=true;",
		"x-lal":"ja_JP",
		"X-Line-ChannelToken":chaannelToken.channelAccessToken,
		"X-Line-Application":client.base.request.systemType,
		"X-Line-Mid":client.base.profile?.mid||"",
	}
})

console.log(await a.text())

// console.log(`友達の数: ${friends.length}`);

// console.log(await client.base.talk.getContacts({mids:[friends[0].mid]}))

// friends.forEach(async (friend) => {
// 	const user = await client.getUser(friend.mid);
// 	console.log(`友達: ${user.raw} (${user.mid})`);
// });
// // 参加中のチャットルーム一覧を取得  
// const chats = await client.fetchJoinedChats();  
// console.log(`参加中のチャット数: ${chats.length}`);  

// // 各チャットの情報を表示  
// chats.forEach(chat => {  
//     console.log(`チャット名: ${chat.name}, ${chat.mid||""},${chat.raw.picturePath||""}`);  
// });

// const selected = await consola.prompt("チャットルームを選んでください。",{type:"select",options:chats.map(chat=>({label:chat.name,value:chat.mid}))})

// const chat = await client.getChat(selected);
// console.log(`選択したチャット: ${chat.name} (${chat.mid})`);
// const inputtext = await consola.prompt("メッセージを入力してください。") as string
// await chat.sendMessage(inputtext).catch((err) => {
// 	chat.sendMessage({text:inputtext,e2ee:true}).catch((err) => {
// 		console.error("メッセージの送信に失敗しました:", err);
// 	})
// })
// client.on("message", async (message) => {
// 	console.log(message);
// 	message.raw.contentType
// 	if (message.text === "!ping") {
// 		const ping = Date.now() - Number(message.raw.createdTime)
// 		await message.react("NICE");
// 		await message.reply("pong!\n Ping: " + ping + "ms");
// 	}
// });

// Deno.addSignalListener("SIGINT", () => {
// 	console.log("SIGINT received, shutting down...");
// 	client.listeners.clear()
// 	Deno.exit();
// });

// client.listen({ talk: true,square:true });