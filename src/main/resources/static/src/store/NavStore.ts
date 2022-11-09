import { defineStore } from "pinia";
import { BreadCrumbItem } from "@cmx";

class NavStore{
    public listNavData = Array<BreadCrumbItem>();

    public pushNavItem = (item: BreadCrumbItem)=>{
        this.listNavData.push(item);
    }

    public popNavItems = (item: BreadCrumbItem)=>{
        
    }
}


export const useNavStore = defineStore(NavStore.name, ()=>{ return new NavStore() });