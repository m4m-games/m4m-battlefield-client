namespace m4m.framework
{
    @assetF(AssetTypeEnum.Shader)
    export class AssetFactory_Shader implements IAssetFactory
    {
        //#region 废弃de参考代码
        // newAsset(): shader
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: shader, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new ResourceState();
        //     if(state.resstateFirst==null)
        //     {
        //         state.resstateFirst=state.resstate[filename];
        //     }
        //     m4m.io.loadText(url,
        //         (txt, err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(err, onstate, state))
        //                     return;

        //                 var _shader = new shader(filename);
        //                 // try
        //                 // {
        //                 //     _shader.parse(assetMgr, JSON.parse(txt));
        //                 // }
        //                 // catch (e)
        //                 // {
        //                 //     console.error("error  filename :" + filename);
        //                 //     throw new Error("shader on parse");
        //                 // }
        //                 this.parseShader(_shader,assetMgr,txt,filename);

        //                 assetMgr.setAssetUrl(_shader, url);
        //                 assetMgr.mapShader[filename] = _shader;
        //                 state.resstate[filename].state = 1;//完成
        //                 onstate(state);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         });
        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: shader, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {
        //         let filename = getFileName(url);
        //         let name = filename.substring(0, filename.indexOf("."));

        //         state.resstate[filename] = new ResourceState();
        //         if(state.resstateFirst==null)
        //         {
        //             state.resstateFirst=state.resstate[filename];
        //         }
        //         let txt = respack[filename];
        //         state.resstate[filename].state = 1;//完成
        //         var _shader = new shader(filename);
        //         // try
        //         // {
        //         //     _shader.parse(assetMgr, JSON.parse(txt));
        //         // }
        //         // catch (e)
        //         // {
        //         //     console.error("error  filename :" + filename);
        //         //     throw new Error("shader on parse");
        //         // }
        //         this.parseShader(_shader,assetMgr,txt,filename);

        //         assetMgr.setAssetUrl(_shader, url);
        //         assetMgr.mapShader[filename] = _shader;
        //         onstate(state);
        //     });
        // }
        //#endregion

        private TryParseMap = {};
        private parseShader(sd : shader , assetMgr: assetMgr , txt : string , filename : string){
            try
            {
                sd.parse(assetMgr, JSON.parse(txt));
            }
            catch (e)
            {
                if(!this.TryParseMap[filename] ) 
                    this.TryParseMap[filename]  = 0;

                if( this.TryParseMap[filename]  < 3){  //可以尝试三次
                    this.TryParseMap[filename] ++;
                    this.parseShader(sd,assetMgr,txt,filename);                    
                }else{
                    throw new Error(`shader on parse , filename :${filename}   :\n${txt}` );
                }
            }
        }

        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            // if(assetmgr.mapShader[filename]!=null)            
            //     console.error(`##shader重复设置:${filename}`);                
            
            // assetmgr.setAssetUrl(_shader, url);
            var _shader = new shader(filename);
            this.parseShader(_shader,assetmgr,txt,filename);            
            assetmgr.mapShader[filename] = _shader;
            // console.warn(`@@ shader :${filename} 加载成功`);
            return _shader;
        }
    }
}