安装goctl

```Vue
go install github.com/zeromicro/go-zero/tools/goctl@latest
CopyErrorOK!
```

安装protoc

```Vue
goctl env check --install --verbose --force
CopyErrorOK!
go get -u github.com/zeromicro/go-zero@latest
CopyErrorOK!
```

goland安装goctl插件

快速创建一个api服务

```Vue
goctl api new apiCopyErrorOK!
```

然后修改一下user/api/internal/logic/apilogic.go文件

```Vue
func (l *ApiLogic) Api(req *types.Request) (resp *types.Response, err error) {
  // todo: add your logic here and delete this line

  return &types.Response{Message: "枫枫"}, nil
}
CopyErrorOK!
```

快速创建一个rpc服务

```Vue
goctl rpc new rpcCopyErrorOK!
```

然后在user的api目录运行

```Vue
go run api.goCopyErrorOK!
```

访问 127.0.0.1:8888/from/me 能看到数据就说明环境安装好了

## 参考文档

环境搭建 https://blog.csdn.net/xwh3165037789/article/details/131577365

官方文档 https://go-zero.dev/docs/tasks/installation/goctl