在插入一条记录到数据库的时候，我希望做点事情

```go
type Student struct {
  ID     uint   `gorm:"size:3"`
  Name   string `gorm:"size:8"`
  Age    int    `gorm:"size:3"`
  Gender bool
  Email  *string `gorm:"size:32"`
}

func (user *Student) BeforeCreate(tx *gorm.DB) (err error) {
  email := fmt.Sprintf("%s@qq.com", user.Name)
  user.Email = &email
  return nil
}
```