// 文档元数据配置
export const DOCUMENTS = [
    {
        id: '1',
        title: "go语言基础",
        type:  'category',
        children:[
            {
                id: '1-1',
                title: "goroutine",
                path: "/docs/goroutine.md",
            },
            {
                id: '1-2',
                title: "GC垃圾回收",
                path: "/docs/GC.md",
            },
        ]

    },

    {
        id: '2',
        title: "gorm文档",
        type:  'category',
        children: [
            {
                id: '2-1',
                title: "1.连接",
                path: "/docs/连接.md",
            },
            {
                id: '2-2',
                title: "2.模型定义",
                path: "/docs/模型定义.md",
            },
            {
                id: '2-3',
                title: "3.单表查询",
                path: "/docs/单表查询.md",
            },
            {
                id: '2-4',
                title: "4.创建Hook",
                path: "/docs/创建Hook.md",
            },
            {
                id: '2-5',
                title: "5.高级查询",
                path: "/docs/高级查询.md",
            },
            {
                id: '2-6',
                title: "6.高级查询2",
                path: "/docs/高级查询2.md",
            },
            {
                id: '2-7',
                title: "7.一对多关系",
                path: "/docs/一对多关系.md",
            },
            {
                id: '2-8',
                title: "8.一对一关系",
                path: "/docs/一对一关系.md",
            },
            {
                id: '2-9',
                title: "9.多对多关系",
                path: "/docs/多对多关系.md",
            },
            {
                id: '2-10',
                title: "10.自定义数据类型",
                path: "/docs/自定义数据类型.md",
            },
            {
                id: '2-11',
                title: "11.事务",
                path: "/docs/事务.md",
            },
        ]

    },
    {
        id: '3',
        title: "gin框架文档",
        type:  'category',
        children: [
            {
                id: '3-1',
                title: "1.初始gin",
                path: "/docs/初始gin.md",
            },
            {
                id: '3-2',
                title: "2.响应gin",
                path: "/docs/响应gin.md",
            },
            {
                id: '3-3',
                title: "3.请求",
                path: "/docs/请求.md",
            },
            {
                id: '3-4',
                title: "4.bind绑定器",
                path: "/docs/bind绑定器.md",
            },
            {
                id: '3-5',
                title: "5.文件下载与上传",
                path: "/docs/文件下载和上传.md",
            },
            {
                id: '3-6',
                title: "6.中间件和路由",
                path: "/docs/中间件和路由.md",
            },
            {
                id: '3-7',
                title: "7.日志",
                path: "/docs/日志.md",
            },
        ]

    },
    {
        id: '4',
        title: "go-zero文档",
        type:  'category',
        children: [
            {
                id: '4-1',
                title: "1.go-zero介绍",
                path: "/docs/go-zero介绍.md",
            },
            {
                id: '4-2',
                title: "2.go-zero安装",
                path: "/docs/go-zero安装.md",
            },
            {
                id: '4-3',
                title: "3.etcd",
                path: "/docs/etcd.md",
            },
            {
                id: '4-4',
                title: "4.最简单的微服务demo",
                path: "/docs/最简单的微服务demo.md",
            },
            {
                id: '4-5',
                title: "5.api服务",
                path: "/docs/api服务.md",
            },
            {
                id: '4-6',
                title: "6.mysql操作",
                path: "/docs/mysql操作.md",
            },
            {
                id: '4-7',
                title: "7.rpc服务",
                path: "/docs/rpc服务.md",
            },
        ]
    },
    {
        id:'5',
        title: "有点忙敬请期待...",
        type:  'category',
    }
];
