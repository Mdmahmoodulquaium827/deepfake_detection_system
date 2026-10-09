"use client";

export default function PredictionResult({ result }) {
  if (!result) {
    return null;
  }

  const isFake = result.prediction === "FAKE";

  return (
    <div className="mt-10 w-full max-w-4xl space-y-6">

      {/* =====================================================
          VIDEO CLASSIFICATION
      ====================================================== */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl">

        <div className="mb-8 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Video Classification
          </p>

          <h2
            className={`mt-4 text-5xl font-extrabold ${
              isFake
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {result.prediction}
          </h2>

          <p className="mt-2 text-lg text-slate-300">
            {isFake
              ? "Potentially Manipulated"
              : "Likely Authentic"}
          </p>

        </div>

        {/* Confidence */}

        <div className="mb-7">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-slate-400">
              Prediction Confidence
            </span>

            <span
              className={`text-2xl font-bold ${
                isFake
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {result.confidence}%
            </span>

          </div>

          <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-800">

            <div
              className={`h-full rounded-full ${
                isFake
                  ? "bg-gradient-to-r from-red-600 to-red-400"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-400"
              }`}
              style={{
                width: `${result.confidence}%`,
              }}
            />

          </div>

        </div>

        {/* Real / Fake */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">

            <p className="text-sm text-slate-400">
              Real Probability
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {result.probabilities?.real}%
            </p>

          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">

            <p className="text-sm text-slate-400">
              Fake Probability
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {result.probabilities?.fake}%
            </p>

          </div>

        </div>

        {/* Frames / Unseen */}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center">

            <p className="text-sm text-slate-400">
              Frames Analyzed
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {result.frames_analyzed}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center">

            <p className="text-sm text-slate-400">
              Video Type
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              New / Unseen
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          TRAINED MODEL PERFORMANCE
      ====================================================== */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl">

        <div className="mb-7 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Trained Model Performance
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Performance measured during model training and validation
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Validation Accuracy */}

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">

            <p className="text-sm text-slate-400">
              Validation Accuracy
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              92.00%
            </p>

          </div>

          {/* Validation Error */}

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">

            <p className="text-sm text-slate-400">
              Validation Error
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-400">
              8.00%
            </p>

          </div>

          {/* Training Accuracy */}

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">

            <p className="text-sm text-slate-400">
              Training Accuracy
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-400">
              99.94%
            </p>

          </div>

          {/* Learning Rate */}

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">

            <p className="text-sm text-slate-400">
              Learning Rate
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              0.0001
            </p>

          </div>

        </div>

        {/* Architecture */}

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-800/60 p-6 text-center">

          <p className="text-sm text-slate-400">
            Model Architecture
          </p>

          <p className="mt-3 text-lg font-bold text-white">
            Xception + Attention + FFT
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Feature Fusion
          </p>

        </div>

      </div>

    </div>
  );
}