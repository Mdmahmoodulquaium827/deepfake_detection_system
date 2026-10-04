import os
import shutil
import uuid

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from inference import predict_video


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Deepfake Detection API",
    description="Deepfake detection using Xception + Attention + FFT",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    # Next.js development server
    allow_origins=[
        "http://localhost:3000"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = os.path.join(
    os.path.dirname(__file__),
    "uploads"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# ALLOWED VIDEO TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov",
    ".mkv"
}


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "message": "Deepfake Detection API is running"
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model-info")
def model_info():

    return {
        "model": "Xception + Attention + FFT",
        "frames": 15,
        "image_size": "224x224",
        "classes": [
            "REAL",
            "FAKE"
        ]
    }


# ============================================================
# VIDEO PREDICTION
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # ------------------------------------
    # Check filename
    # ------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No video file was provided."
        )


    # ------------------------------------
    # Check extension
    # ------------------------------------

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported video format. "
                "Allowed formats: MP4, AVI, MOV, MKV."
            )
        )


    # ------------------------------------
    # Generate unique filename
    # ------------------------------------

    unique_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )


    try:

        # --------------------------------
        # Save uploaded video
        # --------------------------------

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # --------------------------------
        # Run model
        # --------------------------------

        result = predict_video(
            file_path
        )


        # --------------------------------
        # Return prediction
        # --------------------------------

        return {
            "success": True,
            **result
        }


    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Error while processing video: "
                + str(e)
            )
        )


    finally:

        # --------------------------------
        # Delete uploaded video
        # --------------------------------

        if os.path.exists(file_path):

            try:
                os.remove(file_path)

            except Exception:
                pass