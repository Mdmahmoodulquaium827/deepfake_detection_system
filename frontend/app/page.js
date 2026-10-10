"use client";

import { useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // ============================================================
  // VIDEO SELECTION
  // ============================================================

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];

    if (selectedVideo) {
      setVideo(selectedVideo);
      setResult(null);
      setError("");
      setStatus("");
    }
  };

  // ============================================================
  // ANALYZE VIDEO
  // ============================================================

  const analyzeVideo = async () => {
    if (!video) {
      setError("Please select a video first.");
      return;
    }

    // Reset
    setLoading(true);
    setResult(null);
    setError("");
    setStatus("Uploading video...");

    try {
      // --------------------------------------------------------
      // Create FormData
      // --------------------------------------------------------

      const formData = new FormData();

      // IMPORTANT:
      // This must match FastAPI:
      //
      // file: UploadFile = File(...)
      //

      formData.append("file", video);

      console.log("Sending video:", video.name);
      console.log("Video size:", video.size);
      console.log("Sending request to FastAPI...");

      setStatus("Sending video to the detection server...");

      // --------------------------------------------------------
      // Send request to FastAPI
      // --------------------------------------------------------

      const response = await fetch(
        "http://192.168.0.104:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Response status:", response.status);

      // --------------------------------------------------------
      // Read response
      // --------------------------------------------------------

      const data = await response.json();

      console.log("Backend response:", data);

      // --------------------------------------------------------
      // Check response
      // --------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction failed."
        );
      }

      // --------------------------------------------------------
      // Store backend result
      // --------------------------------------------------------

      setResult(data);

      setStatus("Analysis completed successfully.");

    } catch (err) {

      console.error("Prediction error:", err);

      setError(
        err.message ||
        "Unable to connect to the prediction server."
      );

      setStatus("");

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          Deepfake Detector
        </h1>

        <p className="text-gray-500 mt-3">
          Upload a video to determine whether it is real or fake.
        </p>

      </div>


      {/* ======================================================
          UPLOAD CARD
          ====================================================== */}

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Video
        </label>


        {/* File input */}

        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            cursor-pointer
            text-black
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-lg
            file:border-0
            file:bg-slate-800
            file:text-white
          "
        />


        {/* ==================================================
            SELECTED VIDEO
            ================================================== */}

        {video && (

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">

            <p className="text-sm text-gray-500">
              Selected video:
            </p>

            <p className="font-semibold text-gray-800 truncate">
              {video.name}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Size: {(video.size / (1024 * 1024)).toFixed(2)} MB
            </p>

          </div>

        )}


        {/* ==================================================
            ANALYZE BUTTON
            ================================================== */}

        <button
          onClick={analyzeVideo}
          disabled={loading}
          className="
            w-full
            mt-6
            bg-black
            text-white
            py-3
            rounded-lg
            font-semibold
            hover:bg-gray-800
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            transition
          "
        >

          {loading
            ? "Analyzing Video..."
            : "Analyze Video"}

        </button>

      </div>


      {/* ======================================================
          STATUS
          ====================================================== */}

      {loading && (

        <div className="w-full max-w-xl mx-auto mt-8">

          <div className="
            bg-blue-50
            border
            border-blue-200
            rounded-xl
            p-6
            text-center
          ">

            {/* Spinner */}

            <div
              className="
                inline-block
                w-10
                h-10
                border-4
                border-blue-200
                border-t-blue-600
                rounded-full
                animate-spin
              "
            />

            <p className="mt-4 font-semibold text-blue-700">
              Analyzing Video
            </p>

            <p className="text-sm text-blue-600 mt-2">
              Extracting 15 frames and running the deepfake model...
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Because the model is currently running on CPU,
              this may take some time.
            </p>

          </div>

        </div>

      )}


      {/* ======================================================
          STATUS MESSAGE
          ====================================================== */}

      {!loading && status && !result && (

        <div className="
          w-full
          max-w-xl
          mx-auto
          mt-8
          bg-green-50
          border
          border-green-200
          text-green-700
          rounded-xl
          p-4
          text-center
        ">

          {status}

        </div>

      )}


      {/* ======================================================
          ERROR
          ====================================================== */}

      {!loading && error && (

        <div className="
          w-full
          max-w-xl
          mx-auto
          mt-8
        ">

          <div className="
            bg-red-50
            border
            border-red-200
            text-red-700
            rounded-xl
            p-5
            text-center
          ">

            <p className="font-bold">
              Prediction Error
            </p>

            <p className="text-sm mt-2">
              {error}
            </p>

          </div>

        </div>

      )}


      {/* ======================================================
          DEEPFAKE RESULT
          ====================================================== */}

      {!loading && result && (

        <div className="w-full max-w-xl mx-auto mt-8">

          <div className="
            bg-white
            rounded-2xl
            shadow-lg
            border
            border-gray-200
            p-8
          ">

            {/* ----------------------------------------------
                TITLE
            ---------------------------------------------- */}

            <div className="text-center mb-6">

              <h2 className="
                text-2xl
                font-bold
                text-gray-800
              ">
                DEEPFAKE RESULT
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Analysis of: {video?.name}
              </p>

            </div>


            {/* ----------------------------------------------
                PREDICTION
            ---------------------------------------------- */}

            <div className="text-center mb-7">

              <div
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-7
                  py-3
                  rounded-full
                  text-xl
                  font-bold

                  ${
                    result.prediction === "FAKE"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }
                `}
              >

                <span>
                  {result.prediction === "FAKE"
                    ? "⚠️"
                    : "✅"}
                </span>

                {result.prediction === "FAKE"
                  ? "FAKE VIDEO"
                  : "REAL VIDEO"}

              </div>

            </div>


            {/* ----------------------------------------------
                CONFIDENCE
            ---------------------------------------------- */}

            <div className="text-center mb-8">

              <p className="text-gray-500 text-sm">
                Confidence
              </p>

              <p className="text-5xl font-bold text-gray-800 mt-1">

                {Number(result.confidence).toFixed(2)}%

              </p>

            </div>


            {/* ----------------------------------------------
                REAL PROBABILITY
            ---------------------------------------------- */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <span className="
                  font-semibold
                  text-gray-700
                ">
                  Real
                </span>

                <span className="
                  font-semibold
                  text-gray-700
                ">
                  {Number(result.real_probability).toFixed(2)}%
                </span>

              </div>


              <div className="
                w-full
                h-4
                bg-gray-200
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    bg-green-500
                    rounded-full
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${result.real_probability}%`,
                  }}
                />

              </div>

            </div>


            {/* ----------------------------------------------
                FAKE PROBABILITY
            ---------------------------------------------- */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <span className="
                  font-semibold
                  text-gray-700
                ">
                  Fake
                </span>

                <span className="
                  font-semibold
                  text-gray-700
                ">
                  {Number(result.fake_probability).toFixed(2)}%
                </span>

              </div>


              <div className="
                w-full
                h-4
                bg-gray-200
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    bg-red-500
                    rounded-full
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${result.fake_probability}%`,
                  }}
                />

              </div>

            </div>


            {/* ----------------------------------------------
                FRAMES ANALYZED
            ---------------------------------------------- */}

            <div className="
              border-t
              border-gray-200
              pt-5
              mt-6
              text-center
            ">

              <p className="text-sm text-gray-500">
                Frames Analyzed
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-800
                mt-1
              ">
                {result.frames_analyzed}
              </p>

            </div>


            {/* ----------------------------------------------
                RAW RESULT - DEBUG
            ---------------------------------------------- */}

            <div className="
              mt-6
              bg-gray-50
              rounded-lg
              p-4
            ">

              <p className="
                text-xs
                font-semibold
                text-gray-500
                mb-2
              ">
                Backend Response
              </p>

              <pre className="
                text-xs
                text-gray-700
                overflow-auto
              ">
                {JSON.stringify(result, null, 2)}
              </pre>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}