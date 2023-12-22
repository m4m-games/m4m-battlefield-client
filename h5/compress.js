const fs = require("fs");
const child_process = require("child_process");
const path = require("path");

let _path = "test2/js/libs";

function compress(_path) {
    let cwd = process.cwd();
    let tpath = path.normalize(`${cwd}/${_path}`);
    console.log(`开始压缩:` + tpath);
    if (_path.indexOf('.js') != -1) {
        console.log(`正在压缩:${tpath}`);
        child_process.execSync(`uglifyjs ${tpath} -c -m --keep-fnames -o ${tpath}`);
    } else {
        for (let item of fs.readdirSync(_path)) {
            let fullPath = path.normalize(`${cwd}/${_path}/${item}`);
            if (!fs.statSync(fullPath).isFile())
                continue;
            if (!item.endsWith("js")) {
                fs.unlinkSync(fullPath);
                continue;
            }
            console.log(`正在压缩:${fullPath}`);
            child_process.execSync(`uglifyjs ${fullPath} -c -m --keep-fnames -o ${fullPath}`);
        }
    }
    console.log(`压缩:${_path}完毕!`);
}

compress("./lib/node_modules/@types");
// compress("../../wxgame/gd3d.js");
// compress("../../wxgame/splitUICode.js");
// compress("../../wxgame/base.js");
// compress("../../wxgame/coordinator.js");
// compress("../../wxgame/decomp.js");
// compress("../../wxgame/downMgr.js");
// compress("../../wxgame/engineInit.js");
// compress("../../wxgame/crypotojs/RdWXBizDataCrypt.js");
// compress("../../wxgame/openDataContext/index.js");
// compress("../server/public/1/hungryshark/lib/gd3d.js");
// compress("../server/public/1/hungryshark/_bin");
