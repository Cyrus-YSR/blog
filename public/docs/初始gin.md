# gin hello world

使用gin编写一个接口也是非常简单

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    router := gin.Default()
    router.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "Hello World")
    })
    router.Run(":8000") 
}
CopyErrorOK!
```

1. `router:=gin.Default()`：这是默认的服务器。使用gin的`Default`方法创建一个路由`Handler`；
2. 然后通过Http方法绑定路由规则和路由函数。不同于`net/http`库的路由函数，gin进行了封装，把`request`和`response`都封装到了`gin.Context`的上下文环境中。
3. 最后启动路由的Run方法监听端口。还可以用`http.ListenAndServe(":8080", router)`，或者自定义Http服务器配置。

# 两种启动方式

```go
// 启动方式一
router.Run(":8000")
// 启动方式二
http.ListenAndServe(":8000", router)CopyErrorOK!
```

# 修改ip为内网ip

```go
router.Run("0.0.0.0:8000")CopyErrorOK!
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func Index(context *gin.Context) {
  context.String(200, "Hello 枫枫!")
}
func main() {

  // 创建一个默认的路由
  router := gin.Default()

  // 绑定路由规则和路由函数，访问/index的路由，将由对应的函数去处理
  router.GET("/index", Index)

  // 启动监听，gin会把web服务运行在本机的0.0.0.0:8080端口上
  router.Run("0.0.0.0:8080")
  // 用原生http服务的方式， router.Run本质就是http.ListenAndServe的进一步封装
  http.ListenAndServe(":8080", router)
}
```

