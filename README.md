# copyFile
nodejs脚本，运行后把电脑任意路径的文件复制到任意目标文件，省去手工寻找目录的时间，并留下日志文件
1.安装node环境
2.执行npm install fs-extra date-fns 安装依赖
3.config.json里修改
  source_folder(需要复制的源文件路径) 
  target_folder(目标路径)
  例：
  {
    "source_folder": "C:\\Users\\xxx\\Desktop\\dir",
    "target_folder": "D:\\targetdir"
  }
