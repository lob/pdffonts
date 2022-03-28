{
  "targets": [
    {
      "target_name": "pdffonts",
      "sources": [
        "src/pdffonts.cc"
      ],
      "libraries": [
        "<!@(pkg-config --libs poppler)"
      ],
      "cflags": [
        "<!@(pkg-config --cflags poppler)"
      ],
      "xcode_settings": {
        "OTHER_CFLAGS": [
          "<!@(pkg-config --cflags poppler)"
        ],
        "OTHER_LDFLAGS": [
          "-liconv"
        ],
        "CLANG_CXX_LANGUAGE_STANDARD": "c++17"
      },
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "configurations": {
        "Debug": {
          "cflags": [
            "--coverage"
          ],
          "ldflags": [
            "--coverage"
          ],
          "xcode_settings": {
            "OTHER_CFLAGS": [
              "--coverage"
            ],
            "OTHER_LDFLAGS": [
              "--coverage"
            ]
          }
        }
      }
    }
  ]
}
