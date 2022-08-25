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
        "-std=c++17",
        "-fexceptions"
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
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "conditions": [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            'OTHER_CFLAGS': [
              "<!@(pkg-config --cflags poppler)",
              "<!@(dirname -- `pkg-config --cflags poppler`)",
              "-stdlib=libc++",
              "-std=c++17"
            ],
            "OTHER_LDFLAGS": [
              "-liconv"
            ]
          },
        }],
        ['OS!="win"', {
          'cflags_cc+': [
            '-std=c++17',
          ],
        }],
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