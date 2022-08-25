#include <napi.h>
#include <FontInfo.h>
#include <GlobalParams.h>
#include <PDFDoc.h>
#include <PDFDocFactory.h>
#include <goo/GooString.h>
#include <cpp/poppler-version.h>

// https://github.com/scribusproject/scribus/blob/41d56c1dcaa4964ab2bddb4b0af45c208536a319/scribus/plugins/import/pdf/importpdfconfig.h#L12-L16 
#define POPPLER_VERSION_ENCODE(major, minor, micro) (	\
	  ((major) * 10000)				\
	+ ((minor) *   100)				\
	+ ((micro) *     1))
#define POPPLER_ENCODED_VERSION POPPLER_VERSION_ENCODE(POPPLER_VERSION_MAJOR, POPPLER_VERSION_MINOR, POPPLER_VERSION_MICRO)

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

class FontsWorker : public Napi::AsyncWorker {
  public:
    std::vector<FontInfo*> fonts;
    std::string filename;

    FontsWorker(Napi::Function &callback, std::string filename)
        : Napi::AsyncWorker(callback), filename(filename) {}
    ~FontsWorker() {}

    // It is not safe to access V8, or V8 data structures here, so everything
    // we need for input and output should go on `this`.
    void Execute () {
      // Convert the file name into a string poppler can understand
      GooString gooFilename(filename.c_str());

      // Open PDF
      std::unique_ptr<PDFDoc> doc(PDFDocFactory().createPDFDoc(gooFilename, {}, {}));

      // Make sure it's a valid PDF
      if (!doc->isOk()) {
        SetError("file is not a valid PDF");
        return;
      }

      // Load fonts
      FontInfoScanner scanner(doc.get(), 0);
      this->fonts = scanner.scan(doc->getNumPages());
    }

    // Executed when the async work is complete. This function will be run
    // inside the main event loop so it is safe to use V8 again.
    void OnOK() {
      Napi::Array fontArray = Napi::Array::New(Env(), fonts.size());

      for (int i = 0; i < (int)fonts.size(); ++i) {
        FontInfo* font = (FontInfo*)this->fonts[i];
        const Ref fontRef = font->getRef();

        // Create a JS font object
        Napi::Object fontObj = Napi::Object::New(Env());

        if (!font->getName()) {
          fontObj.Set("name", Env().Null());
        } else {
          fontObj.Set("name", font->getName()->c_str());
        }

#if POPPLER_ENCODED_VERSION >= POPPLER_VERSION_ENCODE(21, 10, 0)
        fontObj.Set("encoding", font->getEncoding().c_str());
#else
        fontObj.Set("encoding", font->getEncoding()->c_str());
#endif

        fontObj.Set("type", fontTypeNames[font->getType()]);
        fontObj.Set("embedded", font->getEmbedded());
        fontObj.Set("subset", font->getSubset());
        fontObj.Set("unicode", font->getToUnicode());

        // Invalid object generation number should set object metadata to null
        // Logic taken from pdffonts.cc
        // See: https://cgit.freedesktop.org/poppler/poppler/tree/utils/pdffonts.cc?id=eb1291f86260124071e12226294631ce685eaad6#n207
        if (fontRef.gen >= 100000) {
          fontObj.Set("object", Env().Null());
        } else {
          // PDF object reference metadata
          // For context see: http://www.printmyfolders.com/understanding-pdf
          Napi::Object objectObj = Napi::Object::New(Env());

          objectObj.Set("number", fontRef.num);
          objectObj.Set("generation", fontRef.gen);

          fontObj.Set("object", objectObj);
        }

        fontArray[i] = fontObj;

        delete font;
      }

      Callback().Call({Env().Undefined(), fontArray});
    }
};

Napi::Value Fonts(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError::New(env, "expected 2 arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  // Validate that arguments are correct
  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "expected arg 0: string filename")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  if(!info[1].IsFunction()) {
    Napi::TypeError::New(env, "expected arg 1: function callback")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const std::string filename = std::string(info[0].As<Napi::String>());
  Napi::Function callback = info[1].As<Napi::Function>(); 

  FontsWorker* fontWorker = new FontsWorker(callback, filename);
  fontWorker->Queue();

  return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  if (globalParams == NULL) {
    globalParams = std::unique_ptr<GlobalParams>(new GlobalParams);
  }

  exports.Set("fonts", Napi::Function::New(env, Fonts));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
