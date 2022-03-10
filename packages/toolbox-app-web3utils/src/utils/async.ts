export function getPromiseWithAbort<T>(p: Promise<T>): {
  abort: (reason: any) => void;
  promise: Promise<T>;
} {
  let obj: any = {};
  //内部定一个新的promise，用来终止执行
  let p1 = new Promise(function (resolve, reject) {
    obj.abort = reject;
  });
  obj.promise = Promise.race([p, p1]);
  return obj;
}
