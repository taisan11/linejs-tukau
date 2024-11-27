// Deno.stdin.setRaw(true,{cbreak:true});

const bufferSize = 16;
const buf = new Uint8Array(bufferSize);

let output = "";
let count = 0;

while (true) {
  const nread = await Deno.stdin.read(buf);

  if (nread === null) {
    console.log("nread is null");
    console.log("Exit");
    break;
  }

  // Ctrl + C を押したら終了
  if (buf && buf[0] === 0x03) {
    console.log("Ctrl+C");
    console.log("Exit");
    break;
  }

  // Enterキーを押した場合、outputのテキストを表示して処理を終了
  if (buf && buf[0] === 13) {
    console.log("Ouput: ", output);
    break;
  }
  // 上上↓↓左右左右BAを入力した場合、ゴールと表示する。
    if (buf && buf[0] === 38) {
        console.log("↑");
        count++;
    }
    if (buf && buf[0] === 40) {
        console.log("↓");
        count++;
    }
    if (buf && buf[0] === 37) {
        console.log("←");
        count++;
    }
    if (buf && buf[0] === 39) {
        console.log("→");
        count++;
    }
    if (count === 10) {
        console.log("ゴール");
        break;
    }
  count = 0
}

// Deno.stdin.setRaw(false,{cbreak:false});