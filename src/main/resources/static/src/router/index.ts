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
    redirect: '/analyzorResult',
    meta: {
      hidden: true
    }
  },
  {
    path: "/analyzorResult",
    name: "AnalyzorResult",
    redirect: '/taskGroup',
    component: () => import("@/views/analyzorResult/index.vue"),
    meta: {
      hidden: false,
      title: "分析结果",
      icon: "tenancy"
    },
    children: [
      {
        path: '/taskGroup',
        name: 'TaskGroup',
        component: () => import('@/views/analyzorResult/taskGroup.vue'),
        meta: {
          hidden: true
        },
        children: [
          {
            path: ':op',
            name: 'Aggregation',
            component: () => import('@/views/analyzorResult/aggregation.vue'),
            meta: {
              hidden: 'true',
              title: '计数&极值'
            }
          },
          {
            path: ':op',
            name: 'Group-aggregation',
            component: () => import('@/views/analyzorResult/group-aggregation.vue'),
            meta: {
              hidden: 'true',
              title: '数值分布'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/taskManagement',
    name: 'TaskManagement',
    component: () => import("@/views/taskManagement/index.vue"),
    meta: {
      hidden: false,
      title: "任务管理",
      icon: "task"
    },
    children: [
      {
        path: ':id',
        name: 'TaskDetail',
        component: () => import("@/views/taskManagement/detail.vue"),
        meta: {
          hidden: true,
          title: '详情'
        }
      }
    ]
  },
  {
    path: '/newTask',
    name: 'NewTask',
    component: () => import("@/views/newTask/index.vue"),
    meta: {
      hidden: false,
      title: "新建任务",
      icon: "add_box"
    },
    children: [
      {
        path: '/dataSheet',
        name: 'DataSheet',
        component: () => import("@/views/newTask/detection/dataSheet.vue"),
        meta: {
          hidden: true,
          title: "选择指标"
        },
        children: [
          {
            path: '/:id',
            name: 'DataField',
            component: () => import("@/views/newTask/detection/dataField.vue"),
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
