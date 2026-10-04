import os
import cv2
import torch
import numpy as np

from model import DeepfakeXception


# ============================================================
# CONFIGURATION
# ============================================================

NUM_FRAMES = 15
IMG_SIZE = 224

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "models",
    "best_xception_attention_fft.pth"
)


# Your notebook uses:
#
# real = 0
# fake = 1

CLASS_NAMES = {
    0: "REAL",
    1: "FAKE"
}


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("========================================")
print("Deepfake Detection Inference")
print("========================================")
print("Device:", device)
print("Model:", MODEL_PATH)


# ============================================================
# LOAD MODEL
# ============================================================

model = DeepfakeXception()

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=True
)

model.load_state_dict(
    checkpoint
)

model.to(device)

model.eval()

print("Model loaded successfully.")
print("========================================")


# ============================================================
# VIDEO FRAME EXTRACTION
# ============================================================

def extract_frames(video_path):

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError(
            f"Could not open video: {video_path}"
        )

    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    frames = []

    # Same behavior as your notebook
    if total_frames <= 0:

        cap.release()

        return torch.zeros(
            NUM_FRAMES,
            3,
            IMG_SIZE,
            IMG_SIZE
        )

    # Same frame sampling method as training
    frame_ids = np.linspace(
        0,
        max(total_frames - 1, 0),
        NUM_FRAMES,
        dtype=int
    )

    for frame_id in frame_ids:

        cap.set(
            cv2.CAP_PROP_POS_FRAMES,
            int(frame_id)
        )

        success, frame = cap.read()

        if not success:

            frame = np.zeros(
                (
                    IMG_SIZE,
                    IMG_SIZE,
                    3
                ),
                dtype=np.uint8
            )

        else:

            # OpenCV:
            # BGR -> RGB

            frame = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )

            # Same resolution as training
            frame = cv2.resize(
                frame,
                (
                    IMG_SIZE,
                    IMG_SIZE
                )
            )

        # Same normalization as training
        frame = frame.astype(
            np.float32
        ) / 255.0

        # HWC -> CHW

        frame = torch.tensor(
            frame,
            dtype=torch.float32
        ).permute(
            2,
            0,
            1
        )

        frames.append(frame)

    cap.release()

    return torch.stack(frames)


# ============================================================
# PREDICT VIDEO
# ============================================================

def predict_video(video_path):

    # ------------------------------------
    # Extract 15 frames
    # ------------------------------------

    video_tensor = extract_frames(
        video_path
    )

    # Current shape:
    #
    # [15, 3, 224, 224]

    # Add batch dimension:
    #
    # [1, 15, 3, 224, 224]

    video_tensor = video_tensor.unsqueeze(0)

    video_tensor = video_tensor.to(
        device
    )

    # ------------------------------------
    # Model inference
    # ------------------------------------

    with torch.no_grad():

        outputs = model(
            video_tensor
        )

        # Convert logits to probabilities

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        # Select highest probability

        predicted_class = torch.argmax(
            probabilities,
            dim=1
        ).item()

    # ------------------------------------
    # Results
    # ------------------------------------

    prediction = CLASS_NAMES[
        predicted_class
    ]

    real_probability = (
        probabilities[0][0].item() * 100
    )

    fake_probability = (
        probabilities[0][1].item() * 100
    )

    confidence = (
        probabilities[0][predicted_class].item()
        * 100
    )

    return {
        "prediction": prediction,

        "confidence": round(
            confidence,
            2
        ),

        "probabilities": {
            "real": round(
                real_probability,
                2
            ),

            "fake": round(
                fake_probability,
                2
            )
        },

        "frames_analyzed": NUM_FRAMES
    }