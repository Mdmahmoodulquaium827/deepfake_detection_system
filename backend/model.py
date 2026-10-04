import torch
import torch.nn as nn
import timm


class AttentionBlock(nn.Module):
    def __init__(self, feature_dim):
        super().__init__()

        self.attention = nn.Sequential(
            nn.Linear(feature_dim, 512),
            nn.Tanh(),
            nn.Linear(512, 1)
        )

    def forward(self, x):
        # x shape:
        # [batch, frames, feature_dim]

        scores = self.attention(x)

        # Softmax across frames
        weights = torch.softmax(scores, dim=1)

        # Weighted sum of frame features
        return (weights * x).sum(dim=1)


class FFTBranch(nn.Module):
    def __init__(self, input_dim):
        super().__init__()

        self.fc = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),

            nn.Linear(512, 256),
            nn.ReLU(),

            nn.Linear(256, 128)
        )

    def forward(self, x):
        # x:
        # [batch, frames, feature_dim]

        fft = torch.abs(
            torch.fft.fft(
                x,
                dim=-1
            )
        )

        fft = fft.mean(dim=1)

        return self.fc(fft)


class DeepfakeXception(nn.Module):

    def __init__(self):
        super().__init__()

        # IMPORTANT:
        # This is the exact backbone used during training.
        #
        # During deployment we use pretrained=False because
        # we load the complete trained state_dict immediately after
        # creating the architecture.

        self.backbone = timm.create_model(
            "legacy_xception",
            pretrained=False,
            num_classes=0
        )

        self.feature_dim = 2048

        # Attention branch
        self.attention = AttentionBlock(
            self.feature_dim
        )

        # FFT branch
        self.fft_branch = FFTBranch(
            self.feature_dim
        )

        # Feature fusion
        self.fusion = nn.Sequential(
            nn.Linear(2176, 512),

            nn.BatchNorm1d(512),

            nn.ReLU(),

            nn.Dropout(0.4),

            nn.Linear(512, 256),

            nn.BatchNorm1d(256),

            nn.ReLU(),

            nn.Dropout(0.3)
        )

        # Final classifier
        self.classifier = nn.Sequential(
            nn.Linear(256, 128),

            nn.ReLU(),

            nn.Dropout(0.5),

            nn.Linear(128, 2)
        )

    def forward(self, x):

        # Input:
        # [B, T, C, H, W]
        #
        # B = batch
        # T = 15 frames
        # C = 3
        # H = 224
        # W = 224

        B, T, C, H, W = x.shape

        # Convert:
        #
        # [B, T, C, H, W]
        #
        # to:
        #
        # [B*T, C, H, W]

        x = x.view(
            B * T,
            C,
            H,
            W
        )

        # Xception feature extraction
        features = self.backbone(x)

        # Restore temporal dimension
        #
        # [B*T, 2048]
        #
        # ->
        #
        # [B, T, 2048]

        features = features.view(
            B,
            T,
            self.feature_dim
        )

        # Attention
        attention_feature = self.attention(
            features
        )

        # FFT
        fft_feature = self.fft_branch(
            features
        )

        # Concatenate:
        #
        # attention = 2048
        # fft       = 128
        #
        # total = 2176

        fused = torch.cat(
            [
                attention_feature,
                fft_feature
            ],
            dim=1
        )

        # Fusion network
        fused = self.fusion(fused)

        # Final classification
        return self.classifier(fused)