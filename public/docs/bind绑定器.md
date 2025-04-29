gin中的bind可以很方便的将 前端传递 来的数据与 `结构体` 进行 `参数绑定` ，以及参数校验

# 参数绑定

在使用这个功能的时候，需要给结构体加上Tag `json` `form` `uri` `xml` `yaml`

## Must Bind

不用，校验失败会改状态码

## Should Bind

可以绑定json，query，param，yaml，xml

如果校验不通过会返回错误

### ShouldBindJSON

```go
package main

import "github.com/gin-gonic/gin"

type UserInfo struct {
  Name string `json:"name"`
  Age  int    `json:"age"`
  Sex  string `json:"sex"`
}

func main() {
  router := gin.Default()
  router.POST("/", func(c *gin.Context) {

    var userInfo UserInfo
    err := c.ShouldBindJSON(&userInfo)
    if err != nil {
      c.JSON(200, gin.H{"msg": "你错了"})
      return
    }
    c.JSON(200, userInfo)

  })
  router.Run(":80")
}
CopyErrorOK!
```

### ShouldBindQuery

绑定查询参数

tag对应为form

```go
// ?name=枫枫&age=21&sex=男
package main

import (
  "fmt"
  "github.com/gin-gonic/gin"
)

type UserInfo struct {
  Name string `json:"name" form:"name"`
  Age  int    `json:"age" form:"age"`
  Sex  string `json:"sex" form:"sex"`
}

func main() {
  router := gin.Default()

  router.POST("/query", func(c *gin.Context) {

    var userInfo UserInfo
    err := c.ShouldBindQuery(&userInfo)
    if err != nil {
      fmt.Println(err)
      c.JSON(200, gin.H{"msg": "你错了"})
      return
    }
    c.JSON(200, userInfo)

  })
  router.Run(":80")
}
CopyErrorOK!
```

### ShouldBindUri

绑定动态参数

tag对应为uri

```go
// /uri/fengfeng/21/男

package main

import (
  "fmt"
  "github.com/gin-gonic/gin"
)

type UserInfo struct {
  Name string `json:"name" form:"name" uri:"name"`
  Age  int    `json:"age" form:"age" uri:"age"`
  Sex  string `json:"sex" form:"sex" uri:"sex"`
}

func main() {
  router := gin.Default()

  router.POST("/uri/:name/:age/:sex", func(c *gin.Context) {

    var userInfo UserInfo
    err := c.ShouldBindUri(&userInfo)
    if err != nil {
      fmt.Println(err)
      c.JSON(200, gin.H{"msg": "你错了"})
      return
    }
    c.JSON(200, userInfo)

  })

  router.Run(":80")
}

CopyErrorOK!
```

### ShouldBind

会根据请求头中的content-type去自动绑定

form-data的参数也用这个，tag用form

默认的tag就是form

#### 绑定form-data、x-www-form-urlencode

```go
package main

import (
  "fmt"
  "github.com/gin-gonic/gin"
)

type UserInfo struct {
  Name string `form:"name"`
  Age  int    `form:"age"`
  Sex  string `form:"sex"`
}

func main() {
  router := gin.Default()
  
  router.POST("/form", func(c *gin.Context) {
    var userInfo UserInfo
    err := c.ShouldBind(&userInfo)
    if err != nil {
      fmt.Println(err)
      c.JSON(200, gin.H{"msg": "你错了"})
      return
    }
    c.JSON(200, userInfo)
  })

  router.Run(":80")
}

CopyErrorOK!
```

# bind绑定器

需要使用参数验证功能，需要加binding tag

## 常用验证器

```go
// 不能为空，并且不能没有这个字段
required： 必填字段，如：binding:"required"  

// 针对字符串的长度
min 最小长度，如：binding:"min=5"
max 最大长度，如：binding:"max=10"
len 长度，如：binding:"len=6"

// 针对数字的大小
eq 等于，如：binding:"eq=3"
ne 不等于，如：binding:"ne=12"
gt 大于，如：binding:"gt=10"
gte 大于等于，如：binding:"gte=10"
lt 小于，如：binding:"lt=10"
lte 小于等于，如：binding:"lte=10"

// 针对同级字段的
eqfield 等于其他字段的值，如：PassWord string `binding:"eqfield=Password"`
nefield 不等于其他字段的值


- 忽略字段，如：binding:"-"CopyErrorOK!
```

## gin内置验证器

```go
// 枚举  只能是red 或green
oneof=red green 

// 字符串  
contains=fengfeng  // 包含fengfeng的字符串
excludes // 不包含
startswith  // 字符串前缀
endswith  // 字符串后缀

// 数组
dive  // dive后面的验证就是针对数组中的每一个元素

// 网络验证
ip
ipv4
ipv6
uri
url
// uri 在于I(Identifier)是统一资源标示符，可以唯一标识一个资源。
// url 在于Locater，是统一资源定位符，提供找到该资源的确切路径

// 日期验证  1月2号下午3点4分5秒在2006年
datetime=2006-01-02
CopyErrorOK!
```

## 自定义验证的错误信息

当验证不通过时，会给出错误的信息，但是原始的错误信息不太友好，不利于用户查看

只需要给结构体加一个msg 的tag

```go
type UserInfo struct {
  Username string `json:"username" binding:"required" msg:"用户名不能为空"`
  Password string `json:"password" binding:"min=3,max=6" msg:"密码长度不能小于3大于6"`
  Email    string `json:"email" binding:"email" msg:"邮箱地址格式不正确"`
}
CopyErrorOK!
```

当出现错误时，就可以来获取出错字段上的msg。

- `err`：这个参数为`ShouldBindJSON`返回的错误信息
- `obj`：这个参数为绑定的结构体
- **还有一点要注意的是，validator这个包要引用v10这个版本的，否则会出错**

```go
// GetValidMsg 返回结构体中的msg参数
func GetValidMsg(err error, obj any) string {
  // 使用的时候，需要传obj的指针
  getObj := reflect.TypeOf(obj)
  // 将err接口断言为具体类型
  if errs, ok := err.(validator.ValidationErrors); ok {
    // 断言成功
    for _, e := range errs {
      // 循环每一个错误信息
      // 根据报错字段名，获取结构体的具体字段
      if f, exits := getObj.Elem().FieldByName(e.Field()); exits {
        msg := f.Tag.Get("msg")
        return msg
      }
    }
  }

  return err.Error()
}
CopyErrorOK!
```

## 自定义验证器

1. 注册验证器函数

```go
// github.com/go-playground/validator/v10
// 注意这个版本得是v10的

if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
   v.RegisterValidation("sign", signValid)
}CopyErrorOK!
```

1. 编写函数

```go
// 如果用户名不等于fengfeng就校验失败
func signValid(fl validator.FieldLevel) bool {
  name := fl.Field().Interface().(string)
  if name != "fengfeng" {
    return false
  }
  return true
}CopyErrorOK!
```

1. 使用

```go
type UserInfo struct {
  Name string `json:"name" binding:"sign" msg:"用户名错误"`
  Age  int    `json:"age" binding:""`
}CopyErrorOK!
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
  "github.com/go-playground/validator/v10"
  "reflect"
)

func GetValidMsg(err error, obj interface{}) string {
  // obj为结构体指针
  getObj := reflect.TypeOf(obj)
  // 断言为具体的类型，err是一个接口
  if errs, ok := err.(validator.ValidationErrors); ok {
    for _, e := range errs {
      if f, exist := getObj.Elem().FieldByName(e.Field()); exist {
        return f.Tag.Get("msg") //错误信息不需要全部返回，当找到第一个错误的信息时，就可以结束
      }
    }
  }
  return err.Error()
}
// 如果用户名不等于fengfeng就校验失败
func signValid(fl validator.FieldLevel) bool {
  name := fl.Field().Interface().(string)
  if name != "fengfeng" {
    return false
  }
  return true
}


func main() {
  router := gin.Default()
  router.POST("/", func(c *gin.Context) {
    type UserInfo struct {
      Name string `json:"name" binding:"sign" msg:"用户名错误"`
      Age  int    `json:"age" binding:""`
    }
    var user UserInfo
    err := c.ShouldBindJSON(&user)
    if err != nil {
      // 显示自定义的错误信息
      msg := GetValidMsg(err, &user)
      c.JSON(200, gin.H{"msg": msg})
      return
    }
    c.JSON(200, user)
  })
  // 注册
  if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
    v.RegisterValidation("sign", signValid)
  }
  router.Run(":80")
}
```