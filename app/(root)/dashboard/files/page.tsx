"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Files() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
  return (
    <div className="flex h-screen">
      <div className="w-72  border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Files</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-5 h-5  rounded"></div>
              <span className="text-sm">Docs</span>
            </div>
          </div>

          <Button className="w-full   ">
            <Plus className="w-4 h-4" />
            Add Files
          </Button>
        </div>

        {/* Assistant List */}
        <div className="flex-1 px-1">
          <div className="rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="font-medium">Customers.csv</div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <FileUpload onChange={handleFileUpload} />
        </div>
    </div>
  );
}
