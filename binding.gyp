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
      'cflags_cc': [ 
       "-std=c++17"
      ],
      "xcode_settings": {
        "OTHER_CFLAGS": [
          "<!@(pkg-config --cflags poppler)",
          "-std=c++17"
        ],
        "OTHER_LDFLAGS": [
          "-liconv"
        ],
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
