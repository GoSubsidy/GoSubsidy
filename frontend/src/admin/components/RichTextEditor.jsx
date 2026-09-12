import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write scheme description...",
}) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],

        ["bold", "italic", "underline", "strike"],

        [{ color: [] }, { background: [] }],

        [{ list: "ordered" }, { list: "bullet" }],

        [{ indent: "-1" }, { indent: "+1" }],

        [{ align: [] }],

        ["blockquote", "code-block"],

        ["link"],

        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "list",
      "bullet",
      "indent",
      "align",
      "blockquote",
      "code-block",
      "link",
    ],
    []
  );

  return (
    <div className="card shadow-sm border-0">

      <div className="card-body">

        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />

      </div>

      <style>{`
        .ql-editor{
          min-height:260px;
          font-size:15px;
        }

        .ql-toolbar{
          border-radius:8px 8px 0 0;
        }

        .ql-container{
          border-radius:0 0 8px 8px;
        }
      `}</style>

    </div>
  );
}