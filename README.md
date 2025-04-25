# Obsidian Sources

> 轻松从自定义源安装 Obsidian 插件

## 介绍

Obsidian Sources 是一个为 Obsidian 知识管理软件设计的插件，允许用户从自定义源安装插件，而不仅仅局限于官方插件市场。这对于以下场景特别有用：

-   需要使用内部开发或未在官方市场发布的插件
-   希望访问测试版或预发布版本的插件
-   在网络受限环境中，可以通过自托管的插件源获取插件
-   组织内部共享定制插件

## 功能特点

-   **自定义插件源管理**：添加、编辑和删除自定义插件源
-   **源元数据同步**：从所有配置的源获取最新的插件信息
-   **插件浏览与安装**：查看所有可用插件并一键安装
-   **自动重载**：安装后自动启用新插件，无需重启 Obsidian

## 使用指南

### 添加自定义源

1. 打开 Obsidian 设置
2. 找到 "Sources" 插件设置
3. 点击 "管理源列表" 按钮
4. 点击 "添加源" 按钮
5. 输入源的 URL 地址（必须返回符合特定格式的 JSON）
6. 点击 "保存" 按钮

### 更新源元数据

1. 在 "Sources" 插件设置面板中
2. 点击 "更新" 按钮刷新所有源的元数据

### 浏览和安装插件

1. 在 "Sources" 插件设置面板中
2. 点击 "显示插件" 按钮
3. 在弹出的模态框中查看所有可用插件
4. 点击插件旁边的 "安装" 按钮即可安装对应插件

## 源格式

自定义源必须以 JSON 格式提供插件列表。这个 JSON 需要是一个数组，每个元素包含以下字段：

| 字段    | 类型   | 描述                       |
| ------- | ------ | -------------------------- |
| name    | 字符串 | 插件显示名称               |
| id      | 字符串 | 插件唯一标识符             |
| version | 字符串 | 插件版本号                 |
| url     | 字符串 | 指向插件 ZIP 包的 URL 链接 |

### 示例源 JSON 格式

```json
[
	{
		"name": "示例插件",
		"id": "example-plugin",
		"version": "1.0.0",
		"url": "https://example.com/plugins/example-plugin.zip"
	},
	{
		"name": "另一个插件",
		"id": "another-plugin",
		"version": "0.5.2",
		"url": "https://example.com/plugins/another-plugin.zip"
	}
]
```

ZIP 文件应包含已编译的插件，结构与 Obsidian 插件目录相同，必须包含`manifest.json`文件。

## 致谢

-   感谢 [TfTHacker](https://github.com/TfTHacker) 的 [Obsidian BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件，本项目在实现插件安装部分参考了其代码
