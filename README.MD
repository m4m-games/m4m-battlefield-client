# 目录说明
- **doc** ：项目资料目录
- **h5**  ：html5 web 项目工程   
- **tsLintHook**  ：项目tslint 钩子脚本

# 项目开始
- 1. 运行 **./tsLintHook/init.bat**  (开启git tslint 提交检测检测)
- 2. 运行 **./初始化Excel设置.bat**  (初始化 Excel转换工具 的设置)

# 快捷功能
./修复资源ID.bat      （有新美术资源添加时需要执行 ，避免资源 ID 冲突报错）
./生成Excel数据.bat   （将doc 中的excel 生成到 项目指定位置中）

# h5 发布到 微信版本
* #### 版本和CDN设置
1. 版本设置 ./wxgame/game.js    中 gameVersion 字段;
2. CDN设置 ./wxgame/game.js     中 CDNURL 字段;

* #### 游戏项目相关js文件
1. gameEvent.js、gameMain.js、gameUtil.js 文件复制到 ./wxgame/child/ 目录

* #### ui 相关 js文件
1. h5项目生成的xxxUI.js 复制到 ./wxgame/ui/ 目录下。
2. 配置 ./wxgame/game.json 中的 分包内容(subpackages)
例子：
UI名：xxx
设置为：
{
        "name":"xxx",
        "root":"ui/xxx.js"
}

* #### excel 相关 js 文件
1. h5项目生成的excelData.js 复制到 ./wxgame/excel/ 目录下。
