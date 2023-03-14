import {
  createRouter,
  RouteRecordRaw,
  Router,
  createWebHistory,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: '/Analyzor',
    meta: {
      hidden: true
    }
  },
  {
    path: "/Analyzor",
    name: "Analyzor",
    component: () => import('@/views/Analyzor/taskGroup.vue'),
    meta: {
      hidden: false,
      title: "分析结果",
      icon: "tenancy"
    },
    children: [
      {
        path: 'aggregation',
        name: 'Aggregation',
        component: () => import('@/views/Analyzor/aggregation.vue'),
        meta: {
          hidden: true,
          title: '计数&极值'
        },
        children: [
          {
            path: ':id',
            name: 'AnalyzorDetail',
            component: () => import('@/views/Analyzor/analyzorDetail.vue'),
            meta: {
              hidden: true,
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'group-aggregation',
        name: 'Group-aggregation',
        component: () => import('@/views/Analyzor/group-aggregation.vue'),
        meta: {
          hidden: 'true',
          title: '数值分布'
        },
        children: [
          {
            path: ':id',
            name: 'AnalyzorDetailG',
            component: () => import('@/views/Analyzor/analyzorDetailG.vue'),
            meta: {
              hidden: true,
              title: '详情'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/TaskManager',
    name: 'TaskManager',
    component: () => import("@/views/TaskManager/index.vue"),
    meta: {
      hidden: false,
      title: "任务管理",
      icon: "task"
    },
    children: [
      {
        path: ':id',
        name: 'TaskDetail',
        component: () => import("@/views/TaskManager/detail.vue"),
        meta: {
          hidden: true,
          title: '详情'
        }
      }
    ]
  },
  {
    path: '/NewAnalyzor',
    name: 'NewAnalyzor',
    component: () => import("@/views/NewAnalyzor/index.vue"),
    meta: {
      hidden: false,
      title: "创建新任务",
      icon: "add_box"
    },
    children: [
      {
        path: 'dataSheet',
        name: 'DataSheet',
        component: () => import("@/views/NewAnalyzor/detection/dataSheet.vue"),
        meta: {
          hidden: true,
          title: "选择指标"
        },
        children: [
          {
            path: ':id',
            name: 'DataField',
            component: () => import("@/views/NewAnalyzor/detection/dataField.vue"),
            meta: {
              hidden: true,
              title: "摘要"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login.vue"),
    meta: {
      hidden: true,
      title: "登录"
    },
  },
  {
    // vue-router@4的变化，舍弃*通配符
    // 官方文档：https://next.router.vuejs.org/zh/guide/migration/index.html#%E5%88%A0%E9%99%A4%E4%BA%86-%EF%BC%88%E6%98%9F%E6%A0%87%E6%88%96%E9%80%9A%E9%85%8D%E7%AC%A6%EF%BC%89%E8%B7%AF%E7%94%B1
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/404.vue"),
    meta: {
        hidden: true
      }
  },
];
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
