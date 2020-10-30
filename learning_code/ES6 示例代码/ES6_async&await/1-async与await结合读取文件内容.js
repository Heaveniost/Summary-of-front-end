const fs = require('fs')

// 读取文件内容 
function readWeiXue() {
    return new Promise((resolve, reject) => {
        fs.readFile('./resources/为学.md', (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}
function readGuanShu() {
    return new Promise((resolve, reject) => {
        fs.readFile('./resources/观书有感.md', (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}
function readChaYang() {
    return new Promise((resolve, reject) => {
        fs.readFile('./resources/插秧诗.md', (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}

// 声明一个async函数 
async function main() {
    let weixue = await readWeiXue();
    let guanshu = await readGuanShu();
    let chayang = await readChaYang();

    console.log(weixue.toString());
    console.log(guanshu.toString());
    console.log(chayang.toString());
}

main()