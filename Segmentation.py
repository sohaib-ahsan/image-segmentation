import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd    
from PIL import Image
import torchvision.transforms as transforms

# Define SegNetBaseBatchNorm model
class SegNetBaseBatchNorm(nn.Module):
    def __init__(self, input_channel):
        super(SegNetBaseBatchNorm, self).__init__()

        batchNorm_momentum = 0.1

        self.conv1 = nn.Conv2d(input_channel, 64, kernel_size=7, padding=3)
        self.bn1 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv2 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn2 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv3 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn3 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv4 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn4 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv_decode4 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn_decode4 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv_decode3 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn_decode3 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv_decode2 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn_decode2 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.conv_decode1 = nn.Conv2d(64, 64, kernel_size=7, padding=3)
        self.bn_decode1 = nn.BatchNorm2d(64, momentum=batchNorm_momentum)

        self.dense_softmax_inner_prod = nn.Conv2d(64, 32, kernel_size=1)

    def forward(self, x):
        # Stage 1
        x1 = F.relu(self.bn1(self.conv1(x)))
        x1p, id1 = F.max_pool2d(x1, kernel_size=2, stride=2, return_indices=True)

        # Stage 2
        x2 = F.relu(self.bn2(self.conv2(x1p)))
        x2p, id2 = F.max_pool2d(x2, kernel_size=2, stride=2, return_indices=True)

        # Stage 3
        x3 = F.relu(self.bn3(self.conv3(x2p)))
        x3p, id3 = F.max_pool2d(x3, kernel_size=2, stride=2, return_indices=True)

        # Stage 4
        x4 = F.relu(self.bn4(self.conv4(x3p)))
        x4p, id4 = F.max_pool2d(x4, kernel_size=2, stride=2, return_indices=True)

        # Stage 4d
        x4d = F.max_unpool2d(x4p, id4, kernel_size=2, stride=2)
        x41 = self.bn_decode4(self.conv_decode4(x4d))

        # Stage 3d
        x3d = F.max_unpool2d(x41, id3, kernel_size=2, stride=2)
        x31 = self.bn_decode3(self.conv_decode3(x3d))

        # Stage 2d
        x2d = F.max_unpool2d(x31, id2, kernel_size=2, stride=2)
        x21 = self.bn_decode2(self.conv_decode2(x2d))

        # Stage 1d
        x1d = F.max_unpool2d(x21, id1, kernel_size=2, stride=2)
        x12d = self.bn_decode1(self.conv_decode1(x1d))
        x11d = self.dense_softmax_inner_prod(x12d)

        return x11d

# Load the global model
global_model = SegNetBaseBatchNorm(input_channel=3)  # Assuming 3 input channels
global_model.load_state_dict(torch.load('D:\Projects\PDC Project\global_model.pth'))

# Define function to segment image
def segment_image(image_path):
    # Define idx2rgb dictionary
   
    labels = pd.read_csv('D:\Projects\PDC Project\label_colors.txt', sep=r"[ \t]+", names=['r', 'g', 'b', 'name'], header=None,index_col='name')


    cls2rgb = {cl:list(labels.loc[cl, :]) for cl in labels.index}

    idx2rgb = [np.array(rgb) for idx, (cl, rgb) in enumerate(cls2rgb.items())]

    def map_class_to_rgb(p):
        return idx2rgb[p[0]]

    # Load the input image
    input_image = Image.open(image_path)
    
    # Preprocess the input image
    preprocess = transforms.Compose([
        transforms.Resize((256, 256)),  # Resize to match model input size
        transforms.ToTensor(),           # Convert to tensor
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # Normalize
    ])
    input_tensor = preprocess(input_image).unsqueeze(0)  # Add batch dimension
    
    # Perform segmentation
    with torch.no_grad():
        output = global_model(input_tensor)
    
    # Convert output to RGB mask
    output_np = output.argmax(dim=1).squeeze().cpu().detach().numpy()
    rgb_mask = np.apply_along_axis(map_class_to_rgb, -1, output_np)
    
    # Ensure that the rgb_mask is in uint8 format
    rgb_mask = rgb_mask.astype(np.uint8)
    
    # Plot the input image and segmentation output
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))
    axes[0].imshow(input_image)
    axes[0].set_title('Input Image')
    axes[1].imshow(rgb_mask)
    axes[1].set_title('Segmentation Output')
    plt.show()

# Example usage:
segment_image("D:\Projects\PDC Project\img.png")
