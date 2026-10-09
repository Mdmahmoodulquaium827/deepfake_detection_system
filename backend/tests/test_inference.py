from inference import predict_video

VIDEO_PATH = r"I:\Research\Deepfake Detection program\dataset\fake\019_018.mp4"

result = predict_video(VIDEO_PATH)


print("PREDICTION RESULT")

print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}")
print(f"Real Probability: {result['probabilities']['real']}")
print(f"Fake Probability: {result['probabilities']['fake']}")
print(f"Frames Analyzed: {result['frames_analyzed']}")