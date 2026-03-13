"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { uploadVideoToDB } from "@/lib/api";

const Dashboard = dynamic(() => import("@uppy/react/dashboard"), {
  ssr: false,
});

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "video_unsigned";

export default function VideoUploader({
  chapterId,
  token,
  onUploadSuccess,
  setIsAddingVideo,
}: {
  chapterId: number;
  token: string;
  onUploadSuccess: (video: App.Video) => void;
  setIsAddingVideo: (isAddingVideo: boolean) => void;
}) {
  const uppyRef = useRef<Uppy | null>(null);
  const onSuccessRef = useRef(onUploadSuccess);
  const [, forceRender] = useState({});

  // keep latest callback
  useEffect(() => {
    onSuccessRef.current = onUploadSuccess;
  }, [onUploadSuccess]);

  useEffect(() => {
    if (uppyRef.current) return;

    const uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        allowedFileTypes: ["video/*"],
        maxNumberOfFiles: 10,
      },
    });

    uppy.use(XHRUpload, {
      endpoint: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      fieldName: "file",
      formData: true,
      allowedMetaFields: ["upload_preset", "folder"],
    });
    uppy.on("upload-progress", () => {
      setIsAddingVideo(true);
    });

    uppy.on("file-added", (file) => {
      uppy.setFileMeta(file.id, {
        upload_preset: UPLOAD_PRESET,
        folder: "videos",
      });
    });

    uppy.on("upload-success", async (_, response) => {
      const r = response.body as any;
      console.log("Upload success: ", r);

      const res = await uploadVideoToDB(token, chapterId, {
        title: r.original_filename,
        url: r.secure_url,
        provider: "Cloudinary",
        publicId: r.public_id,
        description: "",
        duration: Math.floor(r.duration / 60),
      });
      setIsAddingVideo(false);
      onSuccessRef.current(res.video);
    });

    uppyRef.current = uppy;

    // 🔑 force one render AFTER uppy is ready
    forceRender({});

    return () => {
      uppy.destroy();
      uppyRef.current = null;
    };
  }, [chapterId, token]);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold">Upload Videos</h2>

      {uppyRef.current && (
        <Dashboard
          uppy={uppyRef.current}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails
          className="w-[100%]"
          note="Max file size: 100MB"
        />
      )}
    </div>
  );
}
