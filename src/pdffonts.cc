#include <FontInfo.h>
#include <GlobalParams.h>
#include <PDFDoc.h>
#include <PDFDocFactory.h>
#include <goo/GooString.h>
#include <nan.h>

using namespace v8;

static const char *fontTypeNames[] = {
  "unknown",
  "Type 1",
  "Type 1C",
  "Type 1C (OT)",
  "Type 3",
  "TrueType",
  "TrueType (OT)",
  "CID Type 0",
  "CID Type 0C",
  "CID Type 0C (OT)",
  "CID TrueType",
  "CID TrueType (OT)"
};

NAN_METHOD(Fonts) {
  // ensure a file name is passed in
  if (info.Length() < 1) {
    Nan::ThrowError("file name is required");
    return;
  }

  // convert the file name into a string poppler can understand
  String::Utf8Value cmd(info[0]);
  std::string s = std::string(*cmd);
  GooString *filename = new GooString(s.c_str());

  // read config file
  globalParams = new GlobalParams();

  // open PDF
  PDFDoc *doc = PDFDocFactory().createPDFDoc(*filename, NULL, NULL);

  // make sure it's a valid PDF
  if (!doc->isOk()) {
    Nan::ThrowError("file is not a valid PDF");
    return;
  }

  // load fonts
  FontInfoScanner scanner(doc, 0);
  GooList *fonts = scanner.scan(doc->getNumPages());

  // construct Node array of object with font information
  Local<v8::Array> fontArray = Nan::New<v8::Array>(fonts->getLength());

  for (int i = 0; i < fonts->getLength(); ++i) {
    FontInfo *font = (FontInfo *)fonts->get(i);
    const Ref fontRef = font->getRef();

    Local<v8::Object> fontObj = Nan::New<v8::Object>();
    Local<v8::Object> objectObj = Nan::New<v8::Object>();

    fontObj->Set(Nan::New("name").ToLocalChecked(), Nan::New(font->getName()->getCString()).ToLocalChecked());
    fontObj->Set(Nan::New("type").ToLocalChecked(), Nan::New(fontTypeNames[font->getType()]).ToLocalChecked());
    fontObj->Set(Nan::New("encoding").ToLocalChecked(), Nan::New(font->getEncoding()->getCString()).ToLocalChecked());
    fontObj->Set(Nan::New("embedded").ToLocalChecked(), Nan::New(font->getEmbedded()));
    fontObj->Set(Nan::New("subset").ToLocalChecked(), Nan::New(font->getSubset()));
    fontObj->Set(Nan::New("unicode").ToLocalChecked(), Nan::New(font->getToUnicode()));

    objectObj->Set(Nan::New("number").ToLocalChecked(), Nan::New(fontRef.num));
    objectObj->Set(Nan::New("generation").ToLocalChecked(), Nan::New(fontRef.gen));
    fontObj->Set(Nan::New("object").ToLocalChecked(), objectObj);

    fontArray->Set(i, fontObj);
    delete font;
  }

  // memory cleanup
  delete filename;
  delete globalParams;
  delete doc;
  delete fonts;

  info.GetReturnValue().Set(fontArray);
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("fonts").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(Fonts)).ToLocalChecked());
}

NODE_MODULE(pdffonts, Init)
