#include <FontInfo.h>
#include <GlobalParams.h>
#include <PDFDoc.h>
#include <PDFDocFactory.h>
#include <goo/GooString.h>
#include <nan.h>

static const char* fontTypeNames[] = {
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

class FontsWorker : public Nan::AsyncWorker {
  public:
    std::string filename;
    std::vector<FontInfo*> fonts;

    FontsWorker(std::string filename, Nan::Callback* callback)
    : Nan::AsyncWorker(callback, "nan:pdffonts.FontsWorker") {
      this->filename = filename;
    }

    // It is not safe to access V8, or V8 data structures here, so everything
    // we need for input and output should go on `this`.
    void Execute () {
      // Convert the file name into a string poppler can understand
      GooString gooFilename(filename.c_str());

      // Open PDF
      std::unique_ptr<PDFDoc> doc(PDFDocFactory().createPDFDoc(gooFilename, nullptr, nullptr));

      // Make sure it's a valid PDF
      if (!doc->isOk()) {
        this->SetErrorMessage("file is not a valid PDF");
        return;
      }

      // Load fonts
      FontInfoScanner scanner(doc.get(), 0);
      this->fonts = scanner.scan(doc->getNumPages());
    }

    // Executed when the async work is complete. This function will be run
    // inside the main event loop so it is safe to use V8 again.
    void HandleOKCallback () {
      Nan::HandleScope scope;

      v8::Local<v8::Array> fontArray = Nan::New<v8::Array>(fonts.size());

      for (int i = 0; i < (int)fonts.size(); ++i) {
        FontInfo* font = (FontInfo*)this->fonts[i];
        const Ref fontRef = font->getRef();

        v8::Local<v8::Object> fontObj = Nan::New<v8::Object>();
        v8::Local<v8::Context> context = Nan::GetCurrentContext();

        if (font->getName() == NULL) {
          fontObj->Set(context, Nan::New("name").ToLocalChecked(), Nan::Null());
        } else {
          fontObj->Set(context, Nan::New("name").ToLocalChecked(), Nan::New(font->getName()->c_str()).ToLocalChecked());
        }

        fontObj->Set(context, Nan::New("type").ToLocalChecked(), Nan::New(fontTypeNames[font->getType()]).ToLocalChecked());
        fontObj->Set(context, Nan::New("encoding").ToLocalChecked(), Nan::New(font->getEncoding()->c_str()).ToLocalChecked());
        fontObj->Set(context, Nan::New("embedded").ToLocalChecked(), Nan::New(font->getEmbedded()));
        fontObj->Set(context, Nan::New("subset").ToLocalChecked(), Nan::New(font->getSubset()));
        fontObj->Set(context, Nan::New("unicode").ToLocalChecked(), Nan::New(font->getToUnicode()));

        // Invalid object generation number should set object metadata to null
        // Logic taken from pdffonts.cc
        // See: https://cgit.freedesktop.org/poppler/poppler/tree/utils/pdffonts.cc?id=eb1291f86260124071e12226294631ce685eaad6#n207
        if (fontRef.gen >= 100000) {
          fontObj->Set(context, Nan::New("object").ToLocalChecked(), Nan::Null());
        } else {
          // PDF object reference metadata
          // For context see: http://www.printmyfolders.com/understanding-pdf
          v8::Local<v8::Object> objectObj = Nan::New<v8::Object>();

          objectObj->Set(context, Nan::New("number").ToLocalChecked(), Nan::New(fontRef.num));
          objectObj->Set(context, Nan::New("generation").ToLocalChecked(), Nan::New(fontRef.gen));

          fontObj->Set(context, Nan::New("object").ToLocalChecked(), objectObj);
        }

        fontArray->Set(context, i, fontObj);
        delete font;
      }

      v8::Local<v8::Value> argv[] = {
        Nan::Null(),
        fontArray
      };

      callback->Call(2, argv, async_resource);
    }
};

NAN_METHOD(Fonts) {
  if (info.Length() < 2) {
    return Nan::ThrowError(Nan::New("expected 2 arguments").ToLocalChecked());
  }

  // Validate that arguments are correct
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::New("expected arg 0: string filename").ToLocalChecked());
  }

  if(!info[1]->IsFunction()) {
    return Nan::ThrowError(Nan::New("expected arg 1: function callback").ToLocalChecked());
  }

  // Start the async worker
  Nan::AsyncQueueWorker(new FontsWorker(
    std::string(*Nan::Utf8String(info[0])),
    new Nan::Callback(info[1].As<v8::Function>())
  ));
}

NAN_MODULE_INIT(Init) {
  // Set globalParams once. globalParams is a global variable and is referenced
  // by poppler in various methods.
  //
  // NOTE: This object is not explicitly cleaned up because the nan API makes it
  // difficult to determine when a module can be cleaned up. Because it is
  // initialized once and has a small memory footprint there is not as much of a
  // concern around memory leaks.
  if (globalParams == NULL) {
    // globalParams = new GlobalParams();
    globalParams = std::unique_ptr<GlobalParams>(new GlobalParams);
  }

  Nan::SetMethod(target, "fonts", Fonts);
}

NODE_MODULE(pdffonts, Init)
