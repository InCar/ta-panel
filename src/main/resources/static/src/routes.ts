import { RouteRecordRaw } from 'vue-router';

import Home from './page/Home.vue';
import Analyzor from "./page/Analyzor.vue"
    import AnalyzorGroup from './page/Analyzor/Group.vue';
    import TaskOne from "./page/Analyzor/TaskOne.vue";
import TaskManager from './page/TaskManager.vue';
    import TaskPage from "./page/TaskManager/TaskPage.vue";
import NewAnalyzor from './page/NewAnalyzor.vue';
import About from "./page/About.vue";
    import About0 from "./page/About/About_0.vue";
    import AboutDev from "./page/About/About_dev.vue";

const ToDo = ()=>import('./page/todo.vue');

export const routes: ReadonlyArray<RouteRecordRaw> = [
    { path: '/', component: Home },
    { path: '/Analyzor', component: Analyzor, meta: { topLevel: true, title: "分析结果", icon: "tenancy" },
        children: [
            { path: ':group', component: AnalyzorGroup },
            { path: ':group/:taskId', component: TaskOne }
        ]
    },
    { path: '/TaskManager', component: TaskManager, meta: { topLevel: true, title: "任务管理", icon: "task"},
        children: [ { path: ':taskId', component: TaskPage } ]
    },
    { path: '/NewAnalyzor', component: NewAnalyzor, meta: { topLevel: true, title: "创建新任务", icon: "add_box" } },
    { path: '/About', component: About, meta: { topLevel: true, title: "About", icon: "info" },
        children: [
            { path: '', name: 'About', component: About0 },
            { path: 'dev', component: AboutDev },
        ]
    },
    { path: '/ToDo', component: ToDo }
];