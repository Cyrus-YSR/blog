### <font style="color:rgb(6, 6, 7);">1. 标记-清除算法</font>
<font style="color:rgb(6, 6, 7);">Go的垃圾回收机制采用标记-清除算法，分为两个主要阶段</font><font style="color:rgb(6, 6, 7);">：</font>

+ **<font style="color:rgb(6, 6, 7);">标记阶段</font>**<font style="color:rgb(6, 6, 7);">：从根对象（如全局变量、活跃的goroutines和栈上的变量）开始，递归地遍历所有可达对象，并将这些对象标记为活跃</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">清除阶段</font>**<font style="color:rgb(6, 6, 7);">：遍历所有对象，清除未被标记的对象（即不可达对象），并回收其占用的内存</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">2. 三色标记法</font>
<font style="color:rgb(6, 6, 7);">为了优化标记过程，Go使用了三色标记法，将对象分为三种颜色</font><font style="color:rgb(6, 6, 7);">：</font>

+ **<font style="color:rgb(6, 6, 7);">白色对象</font>**<font style="color:rgb(6, 6, 7);">：潜在的垃圾，表示还未搜索到的对象，其内存可能会被垃圾收集器回收。</font>
+ **<font style="color:rgb(6, 6, 7);">灰色对象</font>**<font style="color:rgb(6, 6, 7);">：活跃的对象，表示正在搜索但还未搜索完的对象，因为存在指向白色对象的外部指针，垃圾收集器会扫描这些对象的子对象。</font>
+ **<font style="color:rgb(6, 6, 7);">黑色对象</font>**<font style="color:rgb(6, 6, 7);">：活跃的对象，表示搜索完成的对象，包括不存在任何引用外部指针的对象以及从根对象可达的对象。</font>

<font style="color:rgb(6, 6, 7);">标记过程从根对象开始，将所有对象初始化为白色，然后从根对象出发，逐步把所有可达的对象变成灰色，再逐步将灰色对象及其可达对象标记为黑色。最终，所有白色对象都是不可达对象，即垃圾对象</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">3. 并发垃圾回收</font>
<font style="color:rgb(6, 6, 7);">Go的垃圾回收是并发的，能够在程序运行时自动进行垃圾回收，不会暂停整个程序</font><font style="color:rgb(6, 6, 7);">。具体实现如下：</font>

+ **<font style="color:rgb(6, 6, 7);">并发标记</font>**<font style="color:rgb(6, 6, 7);">：在标记阶段，GC与用户程序并发执行，以减少程序性能的影响</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">写屏障</font>**<font style="color:rgb(6, 6, 7);">：为了确保并发标记的正确性，Go使用了写屏障技术。写屏障是一种在用户程序读取对象、创建新对象以及更新对象指针时执行的一段代码，用于确保在并发标记过程中，黑色对象不会直接指向白色对象，从而维护三色不变性</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">4. 垃圾回收的触发条件</font>
<font style="color:rgb(6, 6, 7);">Go垃圾回收的触发条件主要包括以下几种</font><font style="color:rgb(6, 6, 7);">：</font>

+ **<font style="color:rgb(6, 6, 7);">内存使用量</font>**<font style="color:rgb(6, 6, 7);">：当内存使用量超过一定的阈值时，垃圾回收会被触发。Go使用环境变量</font>`GOGC`<font style="color:rgb(6, 6, 7);">来调整垃圾收集的目标百分比，默认值为100，即当已分配的内存大小与垃圾回收前的内存使用量的比例达到100%时，会触发GC</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">分配新对象</font>**<font style="color:rgb(6, 6, 7);">：在分配新的对象时，Go会检查当前的内存使用情况，并可能触发垃圾回收，以确保有足够的内存空间</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">手动触发</font>**<font style="color:rgb(6, 6, 7);">：开发者可以使用</font>`runtime.GC()`<font style="color:rgb(6, 6, 7);">函数在代码中手动触发垃圾回收</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">5. Go 1.8及之后的优化：混合写屏障</font>
<font style="color:rgb(6, 6, 7);">从Go 1.8开始，引入了混合写屏障机制</font><font style="color:rgb(6, 6, 7);">：</font>

+ **<font style="color:rgb(6, 6, 7);">初始扫描</font>**<font style="color:rgb(6, 6, 7);">：GC优先扫描栈，从栈可达的对象均被标记为黑色，此时栈上不开启插入写屏障</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">堆上扫描</font>**<font style="color:rgb(6, 6, 7);">：然后GC扫描堆上对象，开始将对象标记为灰色，之后的流程遵循三色标记，并且堆上开启屏障</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">优势</font>**<font style="color:rgb(6, 6, 7);">：这种机制遵循弱三色不变式，减少了因STW（Stop-the-World）而导致的程序停顿时间，有效提升了程序的并发性能和整体执行效率</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">6. Go GC的流程</font>
<font style="color:rgb(6, 6, 7);">Go垃圾回收的完整流程如下</font><font style="color:rgb(6, 6, 7);">：</font>

1. **<font style="color:rgb(6, 6, 7);">Stop-the-World（STW）</font>**<font style="color:rgb(6, 6, 7);">：暂停所有业务逻辑，确保初始状态的一致性</font><font style="color:rgb(6, 6, 7);">。</font>
2. **<font style="color:rgb(6, 6, 7);">标记（Mark）</font>**<font style="color:rgb(6, 6, 7);">：并发标记存活对象，标记过程与应用程序同时运行</font><font style="color:rgb(6, 6, 7);">。</font>
3. **<font style="color:rgb(6, 6, 7);">再次STW</font>**<font style="color:rgb(6, 6, 7);">：在标记阶段的最后，GC会短暂地暂停程序，重新扫描根对象和写屏障记录的变化，确保标记的准确性</font><font style="color:rgb(6, 6, 7);">。</font>
4. **<font style="color:rgb(6, 6, 7);">清理（Sweep）</font>**<font style="color:rgb(6, 6, 7);">：回收未标记的对象，清理可以并发或串行完成</font><font style="color:rgb(6, 6, 7);">。</font>

### <font style="color:rgb(6, 6, 7);">7. Go GC的特点</font>
<font style="color:rgb(6, 6, 7);">Go的垃圾回收机制具有以下特点</font><font style="color:rgb(6, 6, 7);">：</font>

+ **<font style="color:rgb(6, 6, 7);">并发性</font>**<font style="color:rgb(6, 6, 7);">：GC与程序的其他部分同时运行，不会完全阻塞程序的执行</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">非分代回收</font>**<font style="color:rgb(6, 6, 7);">：Go的GC没有像传统分代回收那样将对象分为不同代</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">可配置性</font>**<font style="color:rgb(6, 6, 7);">：开发者可以通过</font>`GOGC`<font style="color:rgb(6, 6, 7);">环境变量调整垃圾回收器的灵敏度</font><font style="color:rgb(6, 6, 7);">。</font>
+ **<font style="color:rgb(6, 6, 7);">写屏障</font>**<font style="color:rgb(6, 6, 7);">：使用混合写屏障策略，在标记阶段与程序并发运行，同时保持标记的准确性和一致性。</font>

