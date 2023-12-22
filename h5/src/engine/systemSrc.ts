// var System = {};
// export class SystemSrc {
//   public static models = {};
//   public static haveModels = {};
//   public static boolImport = false;

//   public static CheckFuill(key) {
//     return key != "____imports____" && key != "____config____" && key != "____ready____";
//   };
//   public static register(_path, arrs, callback) {
//     // console.log(_path);
//     let self = this;
//     if (!self.models[_path])
//       self.models[_path] = {};
//     let result = callback(function (pOrName, cls) {
//       if (typeof (pOrName) == "object") {
//         for (let k in pOrName) {
//           if (self.CheckFuill(k))
//             self.models[_path][k] = pOrName[k];
//         }
//       } else
//         self.models[_path][pOrName] = cls;
//     }, "");
//     self.models[_path].____imports____ = arrs;
//     self.models[_path].____config____ = result;
//   }


//   public static delete(_path) {

//     if (_path && typeof (_path)) {
//       let index = _path.indexOf("__usercode__/");
//       if (index != -1) {
//         _path = _path.substring(index);
//         // console.log(`delete ${_path}`);
//         delete this.models[_path];
//       }
//     }
//   }
//   public static init() {
//     this.haveModels = {};
//     for (let key in this.models) {
//       let fails = [];
//       this.modelInit(key, [], fails);
//       for (let item of fails) {
//         let __fails = [];
//         this.modelInit(item, [], __fails);
//       }
//     }
//     delete this.haveModels;
//   }
//   public static pathToName(_path) {
//     let idx = _path.lastIndexOf("/");
//     if (idx != -1)
//       _path = _path.substring(idx + 1);
//     return _path;
//   }
//   public static modelInit(key, paths, fails) {
//     let model = this.models[key];
//     this.haveModels[key] = model;
//     paths.push(key);
//     let lastModels = [];
//     for (let i = 0, len = model.____imports____.length; i < len; ++i) {
//       let ckey = model.____imports____[i];
//       let cmodel = this.models[ckey];
//       if (!cmodel) continue;
//       if (paths.lastIndexOf(ckey) == -1 && !cmodel.____ready____)
//         this.modelInit(ckey, paths, fails);
//       else if (!cmodel.____ready____)
//         lastModels.push(ckey);
//       this.handleIndex(key, ckey, model, cmodel, paths, fails);
//       model.____config____.setters[i](cmodel);
//     }
//     if (!model.____ready____) {
//       try {
//         model.____config____.execute();
//         model.____ready____ = true;
//       } catch (e) {
//         fails.push(key);
//       }
//     }
//   }

//   public static handleIndex(key, ckey, model, cmodel, paths, fails) {
//     if (key.endsWith("index")) {
//       {
//         let nckey = this.pathToName(ckey);
//         if ("default" in cmodel)
//           model[nckey] = cmodel["default"];
//         else {
//           if (!(ckey in cmodel))
//             this.modelInit(ckey, paths, fails);
//           for (const ck in cmodel) {
//             if (!this.CheckFuill(ck))
//               continue;
//             if (!(ck in cmodel)) {
//               this.modelInit(ck, paths, fails);
//               for (let k in cmodel) {
//                 if (!this.CheckFuill(k))
//                   continue;
//                 model[k] = cmodel[k];
//               }
//             } else
//               model[ck] = cmodel[ck];
//           }
//         }
//       }
//     }
//   }
//   public static get(fullpath) {
//     let result = [];
//     let model = this.models[fullpath];
//     if (model)
//       for (let key in model) {
//         if (this.CheckFuill(key))
//           result.push(model[key]);
//       }
//     return result;
//   }
//   public static import = function (_path) {
//     // if (window.wx) {
//     //   console.warn("微信不支持此方法 请手动使用 require");
//     //   return;
//     // }
//     return new Promise((resolve, reason) => {
//       let script = document.createElement("script");
//       script.id = `sysmodel_${_path}`;
//       script.src = _path;
//       script.onload = function () {
//         resolve(null);
//       };
//       script.onerror = function (e) {
//         reason(e);
//       };
//       document.head.appendChild(script);

//     });
//   }
// }
// window["System"] = System;