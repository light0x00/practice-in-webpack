此例演示 对于同步导入公共模块  的重用方式

最终结果是 common 由于满足分分割条件 

    1. 满足 cacheGroup.default 设置的条件minChunk,被>=2个分割前的chunk(entry1和entry2)所引用 
        > 需要注意chunk是指构建之后产生的单独的js文件,包含 我们手动设置的entry(就是未分割前的chunk),在分割之后产生的新的js文件
    2. 满足 splitChunks.* (如 minSize、maxSize) 设置的条件

所以被输出到一个单独的chunk