# web monkey test

提供web端页面随机测试的扩展

使用：导入dist文件夹到chrome扩展，配置完参数后，右键运行monkey

![image-20220213223944163](https://raw.githubusercontent.com/KingZhang/kingzhang.github.io/blog/source/assets/img/image-20220213223944163.png)


## 扩展配置
### 元素模式

通过元素移动触发 `输入`、 `点击`、 `双击`等事件，具体配置如下：

* 测试事件：触发元素事件，单击、双击、输入等

* 测试元素：

  * tabindex元素：带有tabindex属性的元素

  * input、textare、a、select等元素

  * 自定义测试元素

* 遮罩元素：由于测试过程中可能会出现一些遮罩页面，比如dialog等，此时页面可触发事件的元素只有和遮罩元素同个级别的元素，因此需要配置页面可能出现的遮罩元素，以便该场景下找到可触发事件的元素

* 隐藏元素：启动测试时隐藏对应元素，以做到聚焦测试，比如隐藏菜单栏等

  

![image-20220506231906773](https://raw.githubusercontent.com/KingZhang/kingzhang.github.io/blog/source/assets/img/image-20220506231906773.png)





### 鼠标模式

通过模拟鼠标事件进行测试，该模式随机性比较强，触发全场景的概率很低。



![image-20220506232401581](https://raw.githubusercontent.com/KingZhang/kingzhang.github.io/blog/source/assets/img/image-20220506232401581.png)



### 公共配置

* 隐藏元素： 可以设置测试时需要隐藏的元素，通过id或者class定位
* 测试时长：默认无停止时间



## 分析视图

通过分析视图可以查看内存占用及测试时长



![image-20220506232225820](https://raw.githubusercontent.com/KingZhang/kingzhang.github.io/blog/source/assets/img/image-20220506232225820.png)




## 开发
构建 `npm run start`
导入dist文件夹到chrome扩展



## TODO

* 错误记录



