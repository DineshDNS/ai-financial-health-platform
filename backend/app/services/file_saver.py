import os
from datetime import datetime

UPLOAD_DIR = "app/uploads/raw"

def save_raw_file(file):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path
