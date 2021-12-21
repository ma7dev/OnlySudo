import torch
import torchvision


dummy_input = torch.randn(1, 3, 1024, 1024, device="cuda")

model = torch.hub.load("bryandlee/animegan2-pytorch:main", "generator", device="cuda")

input_names_model = [ "actual_input_1" ] + [ "learned_%d" % i for i in range(len(model.state_dict())) ]
output_names_model = [ "output1" ]


torch.onnx.export(
    model, 
    dummy_input, 
    "animegan2_generator.onnx", 
    verbose=True, 
    input_names=input_names_model,
    output_names=output_names_model,
    opset_version=11
)
