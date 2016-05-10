#include <nan.h>

using namespace v8;

NAN_METHOD(Hello) {
  info.GetReturnValue().Set(Nan::New("world").ToLocalChecked());
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("hello").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(Hello)).ToLocalChecked());
}

NODE_MODULE(pdffonts, Init)
