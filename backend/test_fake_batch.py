import os
from inference import predict_video

FAKE_DIR = r"I:\Research\Deepfake Detection program\dataset\fake"

files = [
    f for f in os.listdir(FAKE_DIR)
    if f.lower().endswith((".mp4", ".avi", ".mov"))
]

files = files[:10]

correct = 0


print("TESTING FAKE VIDEOS")


for file in files:

    path = os.path.join(FAKE_DIR, file)

    result = predict_video(path)

    prediction = result["prediction"]

    if prediction == "FAKE":
        correct += 1

    print(
        f"{file:20} -> "
        f"{prediction:5} | "
        f"Fake: {result['probabilities']['fake']:.2f}% | "
        f"Real: {result['probabilities']['real']:.2f}%"
    )

print("\n========================================")
print(f"Correct: {correct}/{len(files)}")
print(f"Fake detection rate: {100 * correct / len(files):.2f}%")
print("========================================")