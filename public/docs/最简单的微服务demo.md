这节课，务必跟着教程走，先将demo成功跑起来

这个demo是一个用户微服务，一个视频微服务

视频微服务需要提供一个http接口，用户查询一个视频的信息，并且把关联用户id的用户名也查出来

那么用户微服务就要提供一个方法，根据用户id返回用户信息

## 用户微服务

1. 编写rpc的proto文件

user/rpc/user.proto

```Protocol
syntax = "proto3";

package user;

option go_package = "./user";

message IdRequest {
  string id = 1;
}

message UserResponse {
  // 用户id
  string id = 1;
  // 用户名称
  string name = 2;
  // 用户性别
  bool gender = 3;
}

service User {
  rpc getUser(IdRequest) returns(UserResponse);
}

// goctl rpc protoc user/rpc/user.proto --go_out=user/rpc/types --go-grpc_out=user/rpc/types --zrpc_out=user/rpc/
CopyErrorOK!
```

1. 生成代码

```go
goctl rpc protoc user/rpc/user.proto --go_out=user/rpc/types --go-grpc_out=user/rpc/types --zrpc_out=user/rpc/CopyErrorOK!
```

1. 在 `user/rpc/internal/logic/getuserlogic.go` 填写必要的逻辑

```go
func (l *GetUserLogic) GetUser(in *user.IdRequest) (*user.UserResponse, error) {
  // todo: add your logic here and delete this line
  return &user.UserResponse{
    Id:     in.Id,
    Name:   "湖南省，长沙市",
    Gender: true,
  }, nil
}
CopyErrorOK!
```

## video微服务

1. 创建api

video/api/video.api

```go
type (
  VideoReq {
    Id string `path:"id"`
  }

  VideoRes {
    Id   string `json:"id"`
    Name string `json:"name"`
  }
)
service video {
  @handler getVideo
  get /api/videos/:id (VideoReq) returns (VideoRes)
}

// goctl api go -api video/api/video.api -dir video/api/CopyErrorOK!
```

1. 生成代码

```go
goctl api go -api video/api/video.api -dir video/api/CopyErrorOK!
```

1. 添加user rpc配置

因为要在video里面调用user的rpc服务

video/api/internal/config/config.go

```go
package config

import (
  "github.com/zeromicro/go-zero/rest"
  "github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
  rest.RestConf
  UserRpc zrpc.RpcClientConf
}
CopyErrorOK!
```

1. 完善服务依赖

video/api/internal/svc/servicecontext.go

```go
package svc

import (
  "github.com/zeromicro/go-zero/zrpc"
  "go_test/user/rpc/userclient"
  "go_test/video/api/internal/config"
)

type ServiceContext struct {
  Config  config.Config
  UserRpc userclient.User
}

func NewServiceContext(c config.Config) *ServiceContext {
  return &ServiceContext{
    Config:  c,
    UserRpc: userclient.NewUser(zrpc.MustNewClient(c.UserRpc)),
  }
}
CopyErrorOK!
```

1. 添加yaml配置

video/api/etc/video.yaml

```YAML
Name: video
Host: 0.0.0.0
Port: 8888
UserRpc:
  Etcd:
    Hosts:
      - 127.0.0.1:2379
    Key: user.rpcCopyErrorOK!
```

1. 完善服务依赖

video/api/internal/logic/getvideologic.go

```go
func (l *GetVideoLogic) GetVideo(req *types.VideoReq) (resp *types.VideoRes, err error) {
  // todo: add your logic here and delete this line
  user1, err := l.svcCtx.UserRpc.GetUser(l.ctx, &user.IdRequest{
    Id: "1",
  })
  if err != nil {
    return nil, err
  }
  return &types.VideoRes{
    Id:   req.Id,
    Name: user1.Name,
  }, nil
}
CopyErrorOK!
```

## 服务启动

运行user rpc

```go
go run user\rpc\user.go -f user\rpc\etc\user.yamlCopyErrorOK!
```

运行video api

```go
go run video\api\video.go -f video\api\etc\video.yamlCopyErrorOK!
```

请求

```go
curl 127.0.0.1:8888/api/videos/1

{"id":"1","name":"湖南省，长沙市"}
CopyErrorOK!
```

这样就大功告成了

## 知识回顾

回顾一下，我们做了哪些操作

1. 编写用户微服务的rpc服务的proto文件
2. 生成代码
3. 添加自己的逻辑
4. 编写视频微服务的api服务的api文件
5. 生成代码
6. 完善依赖，配置
7. 添加自己的逻辑

> 这就是使用go-zero的好处，让我们专注于业务的开发

生成并修改之后的目录

![img](https://image.fengfengzhidao.com/rj_0731/20231026152242.png)