const fs = require('fs-extra');
const path = require('path');
const { format } = require('date-fns');

// 加载配置文件
function loadConfig() {
    const configPath = path.join(__dirname, 'config.json');
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }
    } catch (error) {
        console.error('读取配置文件失败:', error.message);
    }
    
    // 默认配置
    return {
        source_folder: path.join(process.env.PUBLIC || process.env.USERPROFILE, 'Desktop', 'source_folder'),
        target_folder: path.join(process.env.PUBLIC || process.env.USERPROFILE, 'Desktop', 'target_folder')
    };
}

// 记录日志
function logMessage(level, message) {
    const logDir = path.join(__dirname, 'logs');
    fs.ensureDirSync(logDir);
    
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `[${timestamp}] ${level}: ${message}\n`;
    
    const logFile = path.join(logDir, `${format(new Date(), 'yyyy-MM-dd')}.log`);
    fs.appendFileSync(logFile, logEntry, 'utf-8');
}

// 记录成功信息
function logSuccess(message) {
    logMessage('SUCCESS', message);
}

// 记录错误信息
function logError(message) {
    logMessage('ERROR', message);
}

// 复制文件夹
async function copyFolder(source, target) {
    try {
        // 确保目标文件夹存在
        await fs.ensureDir(target);
        
        // 检查源文件夹是否存在
        if (!fs.existsSync(source)) {
            logError(`源文件夹不存在: ${source}`);
            return false;
        }
        
        // 复制文件夹内容
        await fs.copy(source, target, {
            overwrite: true,
            errorOnExist: false
        });
        
        // 记录成功信息
        logSuccess(`成功将 ${source} 复制到 ${target}`);
        return true;
    } catch (error) {
        // 记录错误信息
        logError(`复制过程中发生错误: ${error.message}`);
        return false;
    }
}

// 主函数
async function main() {
    // 加载配置
    const config = loadConfig();
    const { source_folder, target_folder } = config;
    
    // 执行复制操作
    const success = await copyFolder(source_folder, target_folder);
    
    if (success) {
        console.log(`文件夹复制成功！\n源文件夹: ${source_folder}\n目标文件夹: ${target_folder}`);
    } else {
        console.log('文件夹复制失败，请查看日志文件了解详细信息。');
    }
}

// 运行主函数
main().catch(error => {
    console.error('程序执行出错:', error.message);
    process.exit(1);
});