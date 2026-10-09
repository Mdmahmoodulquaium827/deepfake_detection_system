
"use client";

export default function PredictionResult({ result }) {
  if (!result) return null;

  const isFake = result.prediction === "FAKE";

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            DEEPFAKE RESULT
          </h2>
        </div>

        {/* Prediction */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${
              isFake
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            <span>{isFake ? "⚠️" : "✅"}</span>
            {isFake ? "FAKE VIDEO" : "REAL VIDEO"}
          </div>
        </div>

        {/* Confidence */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">
            Confidence
          </p>

          <p className="text-4xl font-bold text-gray-800">
            {result.confidence.toFixed(1)}%
          </p>
        </div>

        {/* Real Probability */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">
              Real
            </span>

            <span className="font-semibold text-gray-700">
              {result.real_probability.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{
                width: `${result.real_probability}%`,
              }}
            />
          </div>
        </div>

        {/* Fake Probability */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">
              Fake
            </span>

            <span className="font-semibold text-gray-700">
              {result.fake_probability.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-700"
              style={{
                width: `${result.fake_probability}%`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
