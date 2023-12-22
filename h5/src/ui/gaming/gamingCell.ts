import { CommonCell } from "Common/CommonCell";
import { GamingManager } from "Manager/GamingManager";
import { numberbg } from "./gaming";

@m4m.reflect.node2DComponent
export class gamingCell extends CommonCell {
    private nowClass: numberbg;
    public setCellClass(value: any) {
        this.nowClass = value;
    }
    public onPlay() {

    }
    //选中当前cell 时的fun
    public selectFun(selectbool: boolean) {
        super.selectFun(selectbool);
    }
    public setData(value: any): void {
        this.cellData.data = value;
        if (value) {
            if (value.name.num.toString().length == 1) {
                value.name.num = "0" + value.name.num;
            }
            this.nowClass.deathnumber_lab.alivenumber_lab.label.text = value.name.num.toString();
            this.nowClass.deathnumber_lab.label.text = value.name.num.toString();
            if(value.type == true){
               this.nowClass.deathnumber_lab.alivenumber_lab.transform.visible = false;
               this.nowClass.deathnumber_lab.transform.visible = true;
            }else{
                this.nowClass.deathnumber_lab.alivenumber_lab.transform.visible = true;
                this.nowClass.deathnumber_lab.transform.visible = true;
            }
            this.nowClass.transform.visible = true;
        } else {
            this.nowClass.transform.visible = false;
        }
    }
}