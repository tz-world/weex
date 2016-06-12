/**
 * Created by Weex.
 * Copyright (c) 2016, Alibaba, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache Licence 2.0.
 * For the full copyright and license information,please view the LICENSE file in the root directory of this source tree.
 */

#import "WXBridgeManager.h"
#import "WXBridgeContext.h"
#import "WXLog.h"
#import "WXAssert.h"

@interface WXBridgeManager ()

@property (nonatomic, strong) WXBridgeContext   *bridgeCtx;
@property (nonatomic, strong) NSThread  *jsThread;
@property (nonatomic, assign) BOOL  stopRunning;

@end

static NSThread *WXBridgeThread;

@implementation WXBridgeManager

- (instancetype)init
{
    self = [super init];
    if (self) {
        _bridgeCtx = [[WXBridgeContext alloc] init];
        
        _jsThread = [[NSThread alloc] initWithTarget:self selector:@selector(_runLoopThread) object:nil];
        [_jsThread setName: WX_BRIDGE_THREAD_NAME];
        
        if (WX_SYS_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
            [_jsThread setQualityOfService:[[NSThread mainThread] qualityOfService]];
        } else {
            [_jsThread setThreadPriority:[[NSThread mainThread] threadPriority]];
        }

        [_jsThread start];
    }
    return self;
}

- (void)unload
{
    if (_bridgeCtx) {
        _bridgeCtx = [[WXBridgeContext alloc] init];
    }
}

#pragma mark Thread Management

- (void)_runLoopThread
{
    [[NSRunLoop currentRunLoop] addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
    
    while (!_stopRunning) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
}

#define WXPerformBlockOnBridgeThread(block) \
do{\
    dispatch_block_t pBlock = block; \
    [self _performBlockOnBridgeThread:pBlock];\
}while(0)

- (void)_performBlockOnBridgeThread:(void (^)())block
{
    if ([NSThread currentThread] == _jsThread) {
        block();
    } else {
        [self performSelector:@selector(_performBlockOnBridgeThread:)
                     onThread:_jsThread
                   withObject:[block copy]
                waitUntilDone:NO];
    }
}

#pragma mark JSBridge Management

- (void)createInstance:(NSString *)instance
              template:(NSString *)temp
               options:(NSDictionary *)options
                  data:(id)data
{
    if (!instance || !temp) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx createInstance:instance
                                  template:temp
                                   options:options
                                      data:data];
    });
}

- (void)destroyInstance:(NSString *)instance
{
    if (!instance) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx destroyInstance:instance];
    });
}

- (void)refreshInstance:(NSString *)instance
                   data:(NSDictionary *)data
{
    if (!instance) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx refreshInstance:instance data:data];
    });
}

- (void)updateState:(NSString *)instance data:(id)data
{
    if (!instance) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx updateState:instance data:data];
    });
}

- (void)executeJsFramework:(NSString *)script
{
    if (!script) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx executeJsFramework:script];
    });
}

- (void)executeJsMethod:(WXBridgeMethod *)method
{
    if (!method) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx executeJsMethod:method];
    });
}

- (void)registerModules:(NSDictionary *)modules
{
    if (!modules) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx registerModules:modules];
    });
}

- (void)registerComponents:(NSArray *)components
{
    if (!components) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx registerComponents:components];
    });
}

- (void)fireEvent:(NSString *)instanceId ref:(NSString *)ref type:(NSString *)type params:(NSDictionary *)params
{
    if (!type || !ref) {
        WXLogError(@"Event type and component ref should not be nil");
        return;
    }
    
    NSArray *args = nil;
    if (params) {
       args = @[ref, type, params];
    } else {
        args = @[ref, type];
    }
    NSMutableDictionary *methodDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                       @"fireEvent", @"method",
                                       args, @"args", nil];
    WXBridgeMethod *method = [[WXBridgeMethod alloc] initWithInstance:instanceId data:methodDict];
    [self executeJsMethod:method];
}

- (void)callBack:(NSString *)instanceId funcId:(NSString *)funcId params:(NSString *) params keepAlive:(BOOL)keepAlive {
    NSArray *args = nil;
    if (keepAlive) {
        args = @[[funcId copy], params? [params copy]:@"\"{}\"", @true];
    }else {
        args = @[[funcId copy], params? [params copy]:@"\"{}\""];
    }
    NSMutableDictionary *methodDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                       @"callback", @"method",
                                       @"jsBridge",@"module",
                                       args, @"args", nil];
    
    WXBridgeMethod *method = [[WXBridgeMethod alloc] initWithInstance:instanceId data:methodDict];
    
    [self executeJsMethod:method];
}

- (void)callBack:(NSString *)instanceId funcId:(NSString *)funcId params:(NSString *)params
{
    [self callBack:instanceId funcId:funcId params:params keepAlive:NO];
}

- (void)connectToWebSocket:(NSURL *)url
{
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx connectToWebSocket:url];
    });
}

- (void)logToWebSocket:(NSString *)flag message:(NSString *)message
{
    if (!message) return;
    
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx logToWebSocket:flag message:message];
    });
}

- (void)resetEnvironment
{
    __weak typeof(self) weakSelf = self;
    WXPerformBlockOnBridgeThread(^(){
        [weakSelf.bridgeCtx resetEnvironment];
    });
}

@end
