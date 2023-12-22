namespace m4m.framework
{
    export class F14RefBaseData implements F14ElementData
    {

        public beLoop:boolean = false;
        public refdataName:string;
        public refData:F14EffectData;
        
        public localPos:math.vector3=new math.vector3();
        public localEuler:math.vector3=new math.vector3();
        public localScale:math.vector3=new math.vector3(1,1,1);

        parse(json: any, assetmgr: assetMgr, assetbundle: string) {
            this.beLoop=json.beLoop;
            this.refdataName=json.F14EffectData;
            m4m.math.vec3FormJson(json.localPos,this.localPos);
            m4m.math.vec3FormJson(json.localEuler,this.localEuler);
            m4m.math.vec3FormJson(json.localScale,this.localScale);
        }

    }
}

