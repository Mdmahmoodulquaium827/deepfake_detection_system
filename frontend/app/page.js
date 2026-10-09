"use client";

import VideoUpload from "../components/VideoUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl text-center">

        {/* Header */}
        <h1 className="text-5xl font-bold">
          Deepfake Detector
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          AI-powered video deepfake detection
        </p>

        {/* Upload / Analysis */}
        <div className="mt-12">
          <VideoUpload />
        </div>

      </div>
    </main>
  );
}