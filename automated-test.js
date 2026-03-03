/**
 * GTD Focus - Automated Test Suite
 * 
 * 使用方法:
 * 1. 打开 https://noelyang.github.io/gtd_app/
 * 2. 打开浏览器控制台 (F12)
 * 3. 复制粘贴整个脚本到控制台
 * 4. 按回车运行
 * 5. 查看测试结果
 */

const GTDTestSuite = {
    results: {
        passed: 0,
        failed: 0,
        total: 0
    },

    // 测试工具函数
    assert(condition, testName, details = '') {
        this.results.total++;
        if (condition) {
            this.results.passed++;
            console.log(`✅ PASS: ${testName}`);
            if (details) console.log(`   ${details}`);
        } else {
            this.results.failed++;
            console.error(`❌ FAIL: ${testName}`);
            if (details) console.error(`   ${details}`);
        }
    },

    // 测试 1: 检查核心元素存在
    testCoreElements() {
        console.group('📋 测试 1: 核心元素检查');
        
        this.assert(
            document.getElementById('quickAddForm') !== null,
            '快速添加表单存在',
            'ID: quickAddForm'
        );
        
        this.assert(
            document.getElementById('quickAddInput') !== null,
            '快速添加输入框存在',
            'ID: quickAddInput'
        );
        
        this.assert(
            document.getElementById('taskList') !== null,
            '任务列表存在',
            'ID: taskList'
        );
        
        this.assert(
            document.getElementById('inboxCount') !== null,
            'Inbox 计数器存在',
            'ID: inboxCount'
        );
        
        console.groupEnd();
    },

    // 测试 2: 检查应用初始化
    testAppInitialization() {
        console.group('🚀 测试 2: 应用初始化检查');
        
        this.assert(
            typeof app !== 'undefined',
            'app 对象已定义',
            '全局 app 变量存在'
        );
        
        this.assert(
            app && typeof app.addTask === 'function',
            'app.addTask 方法存在',
            '添加任务功能可用'
        );
        
        this.assert(
            app && typeof app.render === 'function',
            'app.render 方法存在',
            '渲染功能可用'
        );
        
        this.assert(
            app && Array.isArray(app.tasks),
            'app.tasks 数组存在',
            '任务数据存储可用'
        );
        
        console.groupEnd();
    },

    // 测试 3: 事件绑定检查
    testEventBinding() {
        console.group('🎯 测试 3: 事件绑定检查');
        
        const form = document.getElementById('quickAddForm');
        this.assert(
            form !== null,
            '表单元素找到',
            ''
        );
        
        // 检查是否有事件监听器
        const events = getEventListeners ? getEventListeners(form) : null;
        if (events) {
            this.assert(
                events.submit && events.submit.length > 0,
                'submit 事件已绑定',
                `监听器数量：${events.submit.length}`
            );
        } else {
            console.warn('⚠️ 无法检查事件监听器 (getEventListeners 不可用)');
            console.log('💡 请手动测试：在输入框输入文字并按回车');
        }
        
        console.groupEnd();
    },

    // 测试 4: 添加任务功能测试
    async testAddTask() {
        console.group('➕ 测试 4: 添加任务功能');
        
        const input = document.getElementById('quickAddInput');
        const form = document.getElementById('quickAddForm');
        
        if (!input || !form) {
            this.assert(false, '跳过测试', '输入框或表单不存在');
            console.groupEnd();
            return;
        }
        
        // 记录初始任务数
        const initialCount = app ? app.tasks.length : 0;
        console.log(`📊 初始任务数：${initialCount}`);
        
        // 模拟输入
        const testTitle = `Test Task ${Date.now()}`;
        input.value = testTitle;
        this.assert(
            input.value === testTitle,
            '输入框值设置成功',
            `值：${testTitle}`
        );
        
        // 模拟提交
        const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
        });
        
        try {
            form.dispatchEvent(submitEvent);
            
            // 等待一小段时间让事件处理完成
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 检查输入框是否清空
            this.assert(
                input.value === '',
                '输入框已清空',
                `当前值："${input.value}"`
            );
            
            // 检查任务是否添加
            const newCount = app ? app.tasks.length : 0;
            console.log(`📊 添加后任务数：${newCount}`);
            
            this.assert(
                newCount > initialCount,
                '任务数增加',
                `从 ${initialCount} 增加到 ${newCount}`
            );
            
            // 检查最后一个任务
            if (app && app.tasks.length > 0) {
                const lastTask = app.tasks[0];
                this.assert(
                    lastTask.title === testTitle,
                    '任务标题正确',
                    `标题：${lastTask.title}`
                );
                
                this.assert(
                    lastTask.category === 'inbox',
                    '任务分类正确',
                    `分类：${lastTask.category}`
                );
            }
            
        } catch (error) {
            this.assert(false, '提交失败', error.message);
        }
        
        console.groupEnd();
    },

    // 测试 5: WebDAV 模态框测试
    testWebDAVModal() {
        console.group('☁️ 测试 5: WebDAV 模态框检查');
        
        this.assert(
            document.getElementById('syncModal') !== null,
            'Sync 模态框存在',
            'ID: syncModal'
        );
        
        this.assert(
            document.getElementById('webdavUrl') !== null,
            'WebDAV URL 输入框存在',
            'ID: webdavUrl'
        );
        
        this.assert(
            document.getElementById('webdavUser') !== null,
            '用户名输入框存在',
            'ID: webdavUser'
        );
        
        this.assert(
            document.getElementById('webdavPass') !== null,
            '密码输入框存在',
            'ID: webdavPass'
        );
        
        this.assert(
            document.getElementById('testWebDAVBtn') !== null,
            '测试连接按钮存在',
            'ID: testWebDAVBtn'
        );
        
        this.assert(
            document.getElementById('saveWebDAVBtn') !== null,
            '保存配置按钮存在',
            'ID: saveWebDAVBtn'
        );
        
        this.assert(
            document.getElementById('uploadWebDAVBtn') !== null,
            '上传按钮存在',
            'ID: uploadWebDAVBtn'
        );
        
        this.assert(
            document.getElementById('downloadWebDAVBtn') !== null,
            '下载按钮存在',
            'ID: downloadWebDAVBtn'
        );
        
        console.groupEnd();
    },

    // 测试 6: 主题切换测试
    testThemeSwitch() {
        console.group('🎨 测试 6: 主题切换检查');
        
        this.assert(
            document.getElementById('themeDropdown') !== null,
            '主题下拉菜单存在',
            'ID: themeDropdown'
        );
        
        const darkOption = document.querySelector('[data-theme="dark"]');
        const lightOption = document.querySelector('[data-theme="light"]');
        
        this.assert(
            darkOption !== null,
            'Dark 主题选项存在',
            ''
        );
        
        this.assert(
            lightOption !== null,
            'Light 主题选项存在',
            ''
        );
        
        // 检查当前主题
        const currentTheme = document.body.getAttribute('data-theme');
        this.assert(
            currentTheme === 'dark' || currentTheme === 'light',
            '当前主题设置正确',
            `当前主题：${currentTheme}`
        );
        
        console.groupEnd();
    },

    // 测试 7: 移动端布局检查
    testMobileLayout() {
        console.group('📱 测试 7: 移动端布局检查');
        
        const quickAddBottom = document.querySelector('.quick-add-bottom');
        this.assert(
            quickAddBottom !== null,
            '底部快速添加栏存在',
            'class: quick-add-bottom'
        );
        
        // 检查样式
        if (quickAddBottom) {
            const style = window.getComputedStyle(quickAddBottom);
            this.assert(
                style.position === 'fixed',
                '底部栏固定定位',
                `position: ${style.position}`
            );
            
            this.assert(
                style.bottom === '0px',
                '底部栏在底部',
                `bottom: ${style.bottom}`
            );
        }
        
        console.groupEnd();
    },

    // 测试 8: 控制台日志检查
    testConsoleLogging() {
        console.group('📝 测试 8: 调试日志检查');
        
        console.log('✅ 如果能看到这条日志，说明控制台正常工作');
        console.log('💡 以下是预期的初始化日志:');
        console.log('  - [GTD] DOMContentLoaded - Initializing app...');
        console.log('  - [GTD] Binding events...');
        console.log('  - [GTD] Quick add form event bound');
        console.log('  - [WebDAV] Module loaded');
        
        console.groupEnd();
    },

    // 运行所有测试
    async runAllTests() {
        console.clear();
        console.log('='.repeat(60));
        console.log('🧪 GTD Focus 自动化测试套件');
        console.log('='.repeat(60));
        console.log('');
        console.log('📍 测试环境:', window.location.href);
        console.log('🕐 测试时间:', new Date().toLocaleString());
        console.log('🌐 浏览器:', navigator.userAgent);
        console.log('');
        console.log('开始运行测试...');
        console.log('');
        
        const startTime = Date.now();
        
        // 运行所有测试
        this.testCoreElements();
        await this.sleep(100);
        
        this.testAppInitialization();
        await this.sleep(100);
        
        this.testEventBinding();
        await this.sleep(100);
        
        await this.testAddTask();
        await this.sleep(100);
        
        this.testWebDAVModal();
        await this.sleep(100);
        
        this.testThemeSwitch();
        await this.sleep(100);
        
        this.testMobileLayout();
        await this.sleep(100);
        
        this.testConsoleLogging();
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // 输出总结
        console.log('');
        console.log('='.repeat(60));
        console.log('📊 测试结果总结');
        console.log('='.repeat(60));
        console.log(`总测试数：${this.results.total}`);
        console.log(`✅ 通过：${this.results.passed}`);
        console.log(`❌ 失败：${this.results.failed}`);
        console.log(`⏱️ 耗时：${duration}ms`);
        console.log('');
        
        if (this.results.failed === 0) {
            console.log('🎉 所有测试通过！应用运行正常！');
        } else {
            console.log('⚠️ 有测试失败，请检查上面的错误信息');
            console.log('');
            console.log('💡 建议的修复步骤:');
            console.log('1. 检查控制台是否有 JavaScript 错误');
            console.log('2. 刷新页面重新测试');
            console.log('3. 如果问题依然存在，请报告详细的错误信息');
        }
        console.log('='.repeat(60));
    },

    // 辅助函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// 自动运行测试
console.log('🚀 GTD 测试套件已加载');
console.log('💡 运行测试：GTDTestSuite.runAllTests()');
console.log('');

// 等待页面完全加载后自动运行
if (document.readyState === 'complete') {
    setTimeout(() => GTDTestSuite.runAllTests(), 500);
} else {
    window.addEventListener('load', () => {
        setTimeout(() => GTDTestSuite.runAllTests(), 500);
    });
}
