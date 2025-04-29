### <font style="color:rgb(6, 6, 7);">1. </font>**<font style="color:rgb(6, 6, 7);">Docker 安装</font>**
+ **<font style="color:rgb(6, 6, 7);">安装 Docker：</font>**<font style="color:rgb(6, 6, 7);"> 安装方式因操作系统而异。在 Linux 上，通常可以通过包管理器安装（如 </font>`apt`<font style="color:rgb(6, 6, 7);">、</font>`yum`<font style="color:rgb(6, 6, 7);"> 等）。</font>
+ **<font style="color:rgb(6, 6, 7);">检查 Docker 是否安装成功：</font>**

```bash
docker --version
```

---

### <font style="color:rgb(6, 6, 7);">2.</font><font style="color:rgb(6, 6, 7);"> </font>**<font style="color:rgb(6, 6, 7);">镜像相关命令</font>**
+ **<font style="color:rgb(6, 6, 7);">搜索镜像：</font>**

```bash
docker search [镜像名称]
```

<font style="color:rgb(6, 6, 7);">例如：</font>`docker search ubuntu`

+ **<font style="color:rgb(6, 6, 7);">拉取镜像：</font>**

```bash
docker pull [镜像名称]
```

<font style="color:rgb(6, 6, 7);">例如：</font>`docker pull ubuntu:20.04`

+ **<font style="color:rgb(6, 6, 7);">列出本地镜像：</font>**

```bash
docker images
```

+ **<font style="color:rgb(6, 6, 7);">删除镜像：</font>**

```bash
docker rmi [镜像ID或名称]
```

<font style="color:rgb(6, 6, 7);">例如：</font>`docker rmi ubuntu:20.04`

+ **<font style="color:rgb(6, 6, 7);">构建镜像：</font>**

```bash
docker build -t [镜像名称] [Dockerfile路径]
```

<font style="color:rgb(6, 6, 7);">例如：</font>`docker build -t my-app .`

---

### <font style="color:rgb(6, 6, 7);">3.</font><font style="color:rgb(6, 6, 7);"> </font>**<font style="color:rgb(6, 6, 7);">容器相关命令</font>**
+ **<font style="color:rgb(6, 6, 7);">运行容器：</font>**

```bash
docker run [选项] [镜像名称]
```

<font style="color:rgb(6, 6, 7);">常用选项：</font>

    - `-d`<font style="color:rgb(6, 6, 7);">：后台运行容器。</font>
    - `-it`<font style="color:rgb(6, 6, 7);">：交互式模式（分配一个伪终端）。</font>
    - `-p`<font style="color:rgb(6, 6, 7);">：端口映射（格式为 </font>`宿主机端口:容器端口`<font style="color:rgb(6, 6, 7);">）。</font>
    - `-v`<font style="color:rgb(6, 6, 7);">：挂载卷（格式为 </font>`宿主机路径:容器路径`<font style="color:rgb(6, 6, 7);">）。</font>
    - `--name`<font style="color:rgb(6, 6, 7);">：指定容器名称。</font>

<font style="color:rgb(6, 6, 7);">示例：</font>

```bash
docker run -it ubuntu:20.04 /bin/bash
docker run -d -p 80:80 --name my-web nginx
```

+ **<font style="color:rgb(6, 6, 7);">列出正在运行的容器：</font>**

```bash
docker ps
```

+ **<font style="color:rgb(6, 6, 7);">列出所有容器（包括停止的）：</font>**

```bash
docker ps -a
```

+ **<font style="color:rgb(6, 6, 7);">进入运行中的容器：</font>**

```bash
docker exec -it [容器ID或名称] /bin/bash
```

+ **<font style="color:rgb(6, 6, 7);">停止容器：</font>**

```bash
docker stop [容器ID或名称]
```

+ **<font style="color:rgb(6, 6, 7);">启动容器：</font>**

```bash
docker start [容器ID或名称]
```

+ **<font style="color:rgb(6, 6, 7);">删除容器：</font>**

```bash
docker rm [容器ID或名称]
```

+ **<font style="color:rgb(6, 6, 7);">删除所有已停止的容器: </font>**

```bash
docker container prune
```

---

### <font style="color:rgb(6, 6, 7);">4.</font><font style="color:rgb(6, 6, 7);"> </font>**<font style="color:rgb(6, 6, 7);">网络相关命令</font>**
+ **<font style="color:rgb(6, 6, 7);">查看网络：</font>**

```bash
docker network ls
```

+ **<font style="color:rgb(6, 6, 7);">创建自定义网络：</font>**

```bash
docker network create [网络名称]
```

+ **<font style="color:rgb(6, 6, 7);">删除网络：</font>**

```bash
docker network rm [网络名称]
```

---

### <font style="color:rgb(6, 6, 7);">5.</font><font style="color:rgb(6, 6, 7);"> </font>**<font style="color:rgb(6, 6, 7);">数据卷相关命令</font>**
+ **<font style="color:rgb(6, 6, 7);">创建数据卷：</font>**

```bash
docker volume create [数据卷名称]
```

+ **挂载数据卷（使用-v 或者 --mount 选项挂载数据卷）：**

启动一个容器，并将 my_volume 挂载到容器的 /data 目录：

```bash
docker run -d -v my_volume:/data --name my_container nginx
```

或者使用 --mount：

```bash
docker run -d --mount source=my_volume,target=/data --name my_container nginx
```

+ **<font style="color:rgb(6, 6, 7);">查看数据卷：</font>**

```bash
docker volume ls
```

+ **查看特定数据卷的详情：**

```bash
docker volume inspect my_volume
```

+ **<font style="color:rgb(6, 6, 7);">删除数据卷(删除前确保没有容器在使用该卷，如果my_container正在使用my_volume，停止并移出该容器）：</font>**

```bash
docker stop my_container
docker rm my_container
docker volume rm [数据卷名称]
```

+ **<font style="color:rgb(6, 6, 7);">清理未使用的数据卷：</font>**

```bash
docker volume prune
```

![](https://cdn.nlark.com/yuque/0/2025/png/46259103/1743484084814-e0941bb3-23c9-4231-b70e-5fc29469386c.png)

---

### <font style="color:rgb(6, 6, 7);">6. 查看日志及</font>**<font style="color:rgb(6, 6, 7);">其他常用命令</font>**
+ **<font style="color:rgb(6, 6, 7);">查看日志：</font>**

```bash
docker logs [容器ID或名称]
```

+ **查看实时更新的日志：**

```bash
docker logs -f [容器ID或名称]
```

+ **查看最新几行的日志：**

```bash
docker logs --tail 10 my-container
```

+ **指定时间范围，可以使用****<font style="background-color:#D8DAD9;"> --since</font>**** 和 ****<font style="background-color:#D8DAD9;">--until</font>**** 参数：**

```bash
docker logs --since="2021-01-01T00:00:00" --until="2021-01-01T01:00:00" my-container
```

+ **<font style="color:rgb(6, 6, 7);">查看容器的详细信息：</font>**

```bash
docker inspect [容器ID或名称]
```

+ **<font style="color:rgb(6, 6, 7);">清理所有未使用的资源（镜像、容器、网络、数据卷）：</font>**

```bash
docker system prune
```

	

