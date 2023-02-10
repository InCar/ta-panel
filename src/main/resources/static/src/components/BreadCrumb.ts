import { Ref } from "vue";

export interface BreadCrumbItem{
    text: Ref<string>;
    data?: any;
}