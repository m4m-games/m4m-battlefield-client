
#目录介绍
bin：编译产生的文件会全部放进去。根据编译指令 放入release或者debug当中
lib：引擎常用的库或者外部引入的库
platform：不同平台的相关配置文件，key文件等等信息。
res：实际项目所用的资源文件
src：项目代码目录

### unity导出的原始美术资源
http://git.cafegame.cn:7990/scm/lig/happy-art.git
美术资源工作流：
1.unity导出放置到 happy-art 
2.工具转换好原始美术资源（检验资源）
3.资源copy到 res目录 
    
###art：美术文件
res/art/
		font：	字体文件
		role：	角色模型文件（有的时候地形也可以是一个role文件，比如你站在巨人身上，巨人可以播放各种动作从而带动你）
		scene：	场景文件
		fx ： 	特效资源文件
		ui：	ui的各种文件
		atlas：	图集资源
### 其他资源文件
res/
	shaders：	项目渲染shader资源
	TESTAsset：	新版实验性项目美术资源（特效不支持）
	ExcelData：	配置数据

###engine：引擎相关的资源

tools：相关相关的工具，在这个目录当中直接支持python，lua，nodejs的脚本直接运行。（脚本运行会自动绑定快捷键或者在ui界面双击运行）

###src：项目代码目录
Data ： 数据配置读取类工程集目录（拆分js）
engine ： 引擎源码
event ： 项目事件数据和类型工程
game ： 游戏逻辑主工程
gameUtil ： 游戏项目通用代码工程
ui ：项目UI工程集目录