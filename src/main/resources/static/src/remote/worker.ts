import { MessageAction, ActionData } from "./message";
declare var onconnect: ((event:MessageEvent)=>void)|undefined;

onconnect ??= ()=>{}

export {};