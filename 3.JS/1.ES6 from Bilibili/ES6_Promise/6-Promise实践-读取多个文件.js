//引入 fs 模块
const fs = require("fs");

// fs.readFile('./resources/为学.md', (err, data1)=>{
//     fs.readFile('./resources/插秧诗.md', (err, data2)=>{
//         fs.readFile('./resources/观书有感.md', (err, data3)=>{
//             let result = data1 + '\r\n' +data2  +'\r\n'+ data3;
//             console.log(result);
//         });
//     });
// });

//使用 promise 实现
const p = new Promise((resolve, reject) => {
    fs.readFile("./resource/为学.md", (err, data) => {
        // if (err) reject(err);
        resolve(data);
    });
});

p.then(value => {
    return new Promise((resolve, reject) => {
        fs.readFile("./resource/插秧诗.md", (err, data) => {
            resolve([value, data]);
        });
    });
},err=>console.log(err + 'qwe')).then(value => {
    console.log(value, typeof value, 'shiwo')
    return new Promise((resolve, reject) => {
        fs.readFile("./resources/观书有感.md", (err, data) => {
            //压入
            if(value)  value.push(data);
            console.log(data.toString())
            resolve(value);
        });
    })
}).then(value => {
    if(value) console.log(value.join('\r\n'));
}).catch(err => console.log(err));