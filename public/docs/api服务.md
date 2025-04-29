## api语法

api文件就是对这个服务所有api的描述

服务名，函数名，路径，请求方法，请求参数，响应参数

我们以用户管理的两个重要接口为例，去编写它的api文件

```go
type LoginRequest {
  UserName string `json:"userName"`
  Password string `json:"password"`
}

type Response {
  Code int    `json:"code"`
  Data string `json:"data"`
  Msg  string `json:"msg"`
}

type UserInfo {
  UserName string `json:"userName"`
  Addr     string `json:"addr"`
  Id       uint   `json:"id"`
}

type UserInfoResponse {
  Code int      `json:"code"`
  Data UserInfo `json:"data"`
  Msg  string   `json:"msg"`
}

service users {
  @handler login
  post /api/users/login (LoginRequest) returns (Response)
  
  @handler userInfo
  get /api/users/info returns (UserInfoResponse)
}

// goctl api go -api v1.api -dir .CopyErrorOK!
```

通过这个示例，我们发现实际操作起来还是有些问题

1. 响应如何封装？
2. 统一api前缀
3. 用户信息接口应该要进行jwt验证
4. api文档

### 响应封装

不把code，data，msg写在api里面，我们通过封装统一响应

在统一响应里面去加上code data msg

```go
type LoginRequest {
  UserName string `json:"userName"`
  Password string `json:"password"`
}

type UserInfoResponse {
  UserName string `json:"userName"`
  Addr     string `json:"addr"`
  Id       uint   `json:"id"`
}

service users {
  @handler login
  post /login (LoginRequest) returns (string)
  
  @handler userInfo
  get /info returns (UserInfoResponse)
}

// goctl api go -api v1.api -dir .
CopyErrorOK!
```

在common/response/enter.go中

```go
package response

import (
  "github.com/zeromicro/go-zero/rest/httpx"
  "net/http"
)

type Body struct {
  Code uint32      `json:"code"`
  Msg  string      `json:"msg"`
  Data interface{} `json:"data"`
}

// Response http返回
func Response(r *http.Request, w http.ResponseWriter, resp interface{}, err error) {
  if err == nil {
    //成功返回
    r := &Body{
      Code: 0,
      Msg:  "成功",
      Data: resp,
    }
    httpx.WriteJson(w, http.StatusOK, r)
    return
  }
  //错误返回
  errCode := uint32(10086)
  // 可以根据错误码，返回具体错误信息
  errMsg := "服务器错误"

  httpx.WriteJson(w, http.StatusBadRequest, &Body{
    Code: errCode,
    Msg:  errMsg,
    Data: nil,
  })

}
CopyErrorOK!
```

修改一下handler的响应逻辑

```go
l := logic.NewLoginLogic(r.Context(), svcCtx)
resp, err := l.Login(&req)
response.Response(r, w, resp, err)CopyErrorOK!
```

然后完善逻辑即可

```go
func (l *LoginLogic) Login(req *types.LoginRequest) (resp string, err error) {
  // todo: add your logic here and delete this line
  fmt.Println(req.UserName, req.Password)
  return "xxxx.xxxx.xxx", nil
}
CopyErrorOK!
```

#### 模板定制化

当然官方提供了修改模板的方式，避免每次生成都要去改

https://go-zero.dev/docs/tutorials/customization/template

先全局搜一下 `handler.tpl`这个文件

如果没有就先用这个命令生成

```go
goctl template initCopyErrorOK!
```

修改为：

```go
package handler

import (
    "net/http"
    "github.com/zeromicro/go-zero/rest/httpx"
    "go_test/common/response"
    {{.ImportPackages}}
)

func {{.HandlerName}}(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        {{if .HasRequest}}var req types.{{.RequestType}}
        if err := httpx.Parse(r, &req); err != nil {
            httpx.Error(w, err)
            return
        }{{end}}

        l := logic.New{{.LogicType}}(r.Context(), svcCtx)
        {{if .HasResp}}resp, {{end}}err := l.{{.Call}}({{if .HasRequest}}&req{{end}})
        {{if .HasResp}}response.Response(r, w, resp, err){{else}}response.Response(r, w, nil, err){{end}}

    }
}CopyErrorOK!
```

### api前缀

对于用户服务而言，api的前缀都是 /api/users

```go
@server (
    prefix: /api/users
)
service users {
    @handler login
    post /login (LoginRequest) returns (string)

    @handler userInfo
    get /info returns (UserInfoResponse)
}
CopyErrorOK!
```

### jwt及验证

```go
type LoginRequest {
  UserName string `json:"userName"`
  Password string `json:"password"`
}

type UserInfoResponse {
  UserName string `json:"userName"`
  Addr     string `json:"addr"`
  Id       uint   `json:"id"`
}

@server(
  prefix: /api/users
)
service users {
  @handler login
  post /login (LoginRequest) returns (string)
}


@server(
  jwt: Auth
  prefix: /api/users
)
service users {
  @handler userInfo
  get /info returns (UserInfoResponse)
}CopyErrorOK!
```

转换之后，修改配置文件

AccessExpire的单位是秒

```go
Name: users
Host: 0.0.0.0
Port: 8888
Auth:
  AccessSecret: duerueudfnd235sdh
  AccessExpire: 3600CopyErrorOK!
```

jwt公共代码

```go
package jwts

import (
  "errors"
  "github.com/golang-jwt/jwt/v4"
  "time"
)

// JwtPayLoad jwt中payload数据
type JwtPayLoad struct {
  UserID   uint   `json:"user_id"`
  Username string `json:"username"` // 用户名
  Role     int    `json:"role"`     // 权限  1 普通用户  2 管理员
}

type CustomClaims struct {
  JwtPayLoad
  jwt.RegisteredClaims
}

// GenToken 创建 Token
func GenToken(user JwtPayLoad, accessSecret string, expires int64) (string, error) {
  claim := CustomClaims{
    JwtPayLoad: user,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * time.Duration(expires))),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
  return token.SignedString([]byte(accessSecret))
}

// ParseToken 解析 token
func ParseToken(tokenStr string, accessSecret string, expires int64) (*CustomClaims, error) {

  token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
    return []byte(accessSecret), nil
  })
  if err != nil {
    return nil, err
  }
  if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
    return claims, nil
  }
  return nil, errors.New("invalid token")
}

CopyErrorOK!
```

在登录成功之后签发jwt

loginlogic.go

```go
func (l *LoginLogic) Login(req *types.LoginRequest) (resp string, err error) {
  // todo: add your logic here and delete this line
  auth := l.svcCtx.Config.Auth
  token, err := jwts.GenToken(jwts.JwtPayLoad{
    UserID:   1,
    Username: "枫枫",
    Role:     1,
  }, auth.AccessSecret, auth.AccessExpire)
  if err != nil {
    return "", err
  }
  return token, err
}

CopyErrorOK!
```

然后在userinfologic里面加上必要的逻辑

```go
func (l *UserInfoLogic) UserInfo() (resp *types.UserInfoResponse, err error) {
  // todo: add your logic here and delete this line

  userId := l.ctx.Value("user_id").(json.Number)
  fmt.Printf("%v, %T, \n", userId, userId)
  username := l.ctx.Value("username").(string)
  uid, _ := userId.Int64()

  return &types.UserInfoResponse{
    UserId:   uint(uid),
    Username: username,
  }, nil
}

CopyErrorOK!
```

userinfo这个接口就已经自动加上jwt的验证了

不过这个token是需要这样加

```go
headers:{
  Authorization: "Bearer token"
}CopyErrorOK!
```

没有通过jwt的响应是401，这个需要留意一下

当然，也能修改jwt验证的响应

在main中，加上jwt验证的回调函数即可

```go
func main() {
  flag.Parse()

  var c config.Config
  conf.MustLoad(*configFile, &c)

  server := rest.MustNewServer(c.RestConf, rest.WithUnauthorizedCallback(JwtUnauthorizedResult))
  defer server.Stop()

  ctx := svc.NewServiceContext(c)
  handler.RegisterHandlers(server, ctx)

  fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
  server.Start()
}

// JwtUnauthorizedResult jwt验证失败的回调
func JwtUnauthorizedResult(w http.ResponseWriter, r *http.Request, err error) {
  fmt.Println(err) // 具体的错误，没带token，token过期？伪造token？
  httpx.WriteJson(w, http.StatusOK, response.Body{10087, "鉴权失败", nil})
}
CopyErrorOK!
```

### 生成api文档

后端对外的api，肯定要和前端进行对接

那么在go-zero里面怎么生成api接口文档呢

1. 安装goctl-swagger

```go
go install github.com/zeromicro/goctl-swagger@latestCopyErrorOK!
```

1. 生成app.json

如果没有doc目录，需要创建

```go
goctl api plugin -plugin goctl-swagger="swagger -filename app.json -host localhost:8888 -basepath /" -api v1.api -dir ./docCopyErrorOK!
```

1. 使用docker，查看这个swagger页面

```go
docker run -d --name swag -p 8087:8080 -e SWAGGER_JSON=/opt/app.json -v D:\IT\go_project3\go_test\v1\api\doc\:/opt swaggerapi/swagger-ui
CopyErrorOK!
```

可以再完善下api信息

```go
@server(
  prefix: /api/users
)
service users {
  @doc(
    summary: "用户登录"
  )
  @handler login
  post /login (LoginRequest) returns (string)
}

@server(
  jwt: Auth
  prefix: /api/users
)
service users {
  @doc(
    summary: "获取用户信息"
  )
  @handler userInfo
  get /info returns (UserInfoResponse)
}CopyErrorOK!
```

改为再重新生成一下 json

![img](https://image.fengfengzhidao.com/rj_0731/20231027153446.png)

> 但是，我发现这个swagger体验不怎么好，使用了自定义响应之后，swag这里改不了

公司项目的话，都是有自己的api平台

团队项目的话，也可以用apifox

所以，个人用swagger的话，凑活着用也不是不行