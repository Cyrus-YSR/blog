## go-zero原生操作mysql

#### 代码生成

v1/model/user.sql

```sql
CREATE TABLE user
(
    id        bigint AUTO_INCREMENT,
    username  varchar(36) NOT NULL,
    password  varchar(64) default '',
    UNIQUE name_index (username),
    PRIMARY KEY (id)
) ENGINE = InnoDB COLLATE utf8mb4_general_ci;CopyErrorOK!
```

生成go代码

```go
goctl model mysql ddl --src user.sql --dir .CopyErrorOK!
```

生成的go代码，自动为我们生成了增删改查的代码

我们如何使用呢？

### 代码使用

在config里面写上mysql配置

```go
package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
  rest.RestConf
  Mysql struct {
    DataSource string
  }
  Auth struct {
    AccessSecret string
    AccessExpire int64
  }
}
CopyErrorOK!
```

配置文件

```go
Name: users
Host: 0.0.0.0
Port: 8888
Mysql:
  DataSource: root:root@tcp(127.0.0.1:3306)/zero_db?charset=utf8mb4&parseTime=True&loc=Local
Auth:
  AccessSecret: dfff1234
  AccessExpire: 3600CopyErrorOK!
```

先在依赖注入的地方创建连接

v1/api/internal/svc/servicecontext.go

```go
package svc

import (
  "github.com/zeromicro/go-zero/core/stores/sqlx"
  "go_test/v1/api/internal/config"
  "go_test/v1/model"
)

type ServiceContext struct {
  Config     config.Config
  UsersModel model.UserModel
}

func NewServiceContext(c config.Config) *ServiceContext {
  mysqlConn := sqlx.NewMysql(c.Mysql.DataSource)
  return &ServiceContext{
    Config:     c,
    UsersModel: model.NewUserModel(mysqlConn),
  }
}
CopyErrorOK!
```

> 为了简单，我就直接在登录逻辑里面，写逻辑了

```go
func (l *LoginLogic) Login(req *types.LoginRequest) (resp string, err error) {
  // 增
  l.svcCtx.UsersModel.Insert(context.Background(), &model.User{
    Username: "枫枫",
    Password: "123456",
  })

  // 查
  user, err := l.svcCtx.UsersModel.FindOne(context.Background(), 1)
  fmt.Println(user, err)
  // 查
  user, err = l.svcCtx.UsersModel.FindOneByUsername(context.Background(), "枫枫")
  fmt.Println(user, err)

  // 改
  l.svcCtx.UsersModel.Update(context.Background(), &model.User{
    Username: "枫枫1",
    Password: "1234567",
    Id:       1,
  })
  user, err = l.svcCtx.UsersModel.FindOne(context.Background(), 1)
  fmt.Println(user, err)
  // 删
  l.svcCtx.UsersModel.Delete(context.Background(), 1)
  user, err = l.svcCtx.UsersModel.FindOne(context.Background(), 1)
  fmt.Println(user, err)
  return
}CopyErrorOK!
```

## 结合gorm
以上情况，差不多是直接使用原生sql进行查询的

其实大部分场景，结合gorm会更加高效

当然也可以使用其他的orm

直接编写model文件

因为直接编写sql文件再转换，会有些地方有问题

```go
package model

import "gorm.io/gorm"

type UserModel struct {
  gorm.Model
  Username string `gorm:"size:32" json:"username"`
  Password string `gorm:"size:64" json:"password"`
}
CopyErrorOK!
```

在common里面写上gorm的连接语句

common/init_db/init_gorm.go

```go
package init_db

import (
  "fmt"
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

// InitGorm gorm初始化
func InitGorm(MysqlDataSource string) *gorm.DB {
  db, err := gorm.Open(mysql.Open(MysqlDataSource), &gorm.Config{})
  if err != nil {
    panic("连接mysql数据库失败, error=" + err.Error())
  } else {
    fmt.Println("连接mysql数据库成功")
  }
  return db
}
CopyErrorOK!
```

然后在context里面进行注入

```go
package svc

import (
  "go_test/common/init_db"
  "go_test/v1/api/internal/config"
  "go_test/v1/model"
  "gorm.io/gorm"
)

type ServiceContext struct {
  Config config.Config
  DB     *gorm.DB
}

func NewServiceContext(c config.Config) *ServiceContext {
  mysqlDb := init_db.InitGorm(c.Mysql.DataSource)
  mysqlDb.AutoMigrate(&model.User{})
  return &ServiceContext{
    Config: c,
    DB:     mysqlDb,
  }
}
CopyErrorOK!
```

使用就很简单了，和gorm是一模一样的

```go
func (l *LoginLogic) Login(req *types.LoginRequest) (resp string, err error) {
  var user models.UserModel
  err = l.svcCtx.DB.Take(&user, "username = ? and password = ?", req.Username, req.Password).Error
  if err != nil {
    return "", errors.New("登录失败")
  }
  return user.Username, nil
}CopyErrorOK!
```

## 参考文档

sqlx使用 https://blog.csdn.net/Mr_XiMu/article/details/131658247