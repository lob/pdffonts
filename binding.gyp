{
  "targets": [
    {
      "target_name": "pdffonts",
      "sources": [
        "src/pdffonts.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
