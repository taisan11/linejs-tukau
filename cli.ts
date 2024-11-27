import { Client } from "@evex/linejs";
import {renderANSI}from "uqr"
import { FileStorage } from "@evex/linejs/storage";
import "@std/dotenv/load"

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
	let now_ui_type = "TOP"
  Deno.stdin.setRaw(true,{cbreak:true});
  const buffer = new Uint8Array(1024);
  const decoder = new TextDecoder();
  
  while (true) {
    const n = await Deno.stdin.read(buffer);
    if (n === null) break; // 入力がない場合
  
    const input = decoder.decode(buffer.subarray(0, n));
    console.log(input + "aaa");
  
    // 特殊キーの判定 (エスケープシーケンス)
    if (input === '\x1b') {
      console.log("ESCキーが押されました");
    } else if (input === '\x1b[A') {
      console.log("上矢印キーが押されました");
    } else if (input === '\x1b[B') {
      console.log("下矢印キーが押されました");
    } else if (input === '\x1b[C') {
      console.log("右矢印キーが押されました");
    } else if (input === '\x1b[D') {
      console.log("左矢印キーが押されました");
    } else {
      console.log("その他のキー:", input);
    }
  }
  const stdin = Deno.stdin.readable
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