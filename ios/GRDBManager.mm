#import <GRDBManagerSpec/GRDBManagerSpec.h>
#import <ReactCommon/RCTTurboModule.h>

// Hand-declared interface instead of importing the full -Swift.h umbrella.
// Must match GRDBManagerImpl's @objc selectors exactly.
@interface GRDBManagerImpl : NSObject
- (instancetype)init;
- (void)openDatabase:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)closeDatabase:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)isDatabaseOpen:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)executeQuery:(NSString *)query
          parameters:(NSDictionary *)parameters
            resolver:(RCTPromiseResolveBlock)resolve
            rejecter:(RCTPromiseRejectBlock)reject;
- (void)executeRawQuery:(NSString *)query
                resolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject;
@end

@interface GRDBManager : NSObject <NativeGRDBManagerSpec>
@property (nonatomic, strong) GRDBManagerImpl *impl;
@end

@implementation GRDBManager

RCT_EXPORT_MODULE(GRDBManager)

- (instancetype)init {
  if (self = [super init]) {
    _impl = [GRDBManagerImpl new];
  }
  return self;
}

- (void)openDatabase:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl openDatabase:resolve rejecter:reject];
}

- (void)closeDatabase:(nonnull RCTPromiseResolveBlock)resolve
                reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl closeDatabase:resolve rejecter:reject];
}

- (void)isDatabaseOpen:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl isDatabaseOpen:resolve rejecter:reject];
}

- (void)executeQuery:(nonnull NSString *)query
          parameters:(nonnull NSDictionary *)parameters
             resolve:(nonnull RCTPromiseResolveBlock)resolve
              reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl executeQuery:query parameters:parameters resolver:resolve rejecter:reject];
}

- (void)executeRawQuery:(nonnull NSString *)query
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl executeRawQuery:query resolver:resolve rejecter:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeGRDBManagerSpecJSI>(params);
}

@end
