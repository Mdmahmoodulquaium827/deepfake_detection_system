import torch

from model import DeepfakeXception


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


print("Device:", device)


model = DeepfakeXception()


checkpoint = torch.load(
    "models/best_xception_attention_fft.pth",
    map_location=device,
    weights_only=True
)


model.load_state_dict(
    checkpoint
)


model.to(device)

model.eval()


print()
print("==============================")
print("MODEL LOADED SUCCESSFULLY")
print("==============================")
print("Parameters:", len(checkpoint))