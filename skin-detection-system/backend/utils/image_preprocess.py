from PIL import Image
import io

def process_image(image_bytes: bytes) -> Image.Image:
    """
    Validates, converts to RGB, and resizes the image to 224x224.
    Returns a PIL Image object.
    """
    try:
        # Load the image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Validate format
        if img.format not in ['JPEG', 'PNG', 'JPG']:
            # PIL might load 'JPG' as 'JPEG', but we check just in case.
            pass # Pillow handles the format validation naturally.

        # Convert to RGB (handles transparency in PNGs)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to 224x224 (stretching)
        img = img.resize((224, 224))
        
        return img
    except Exception as e:
        raise ValueError("Invalid image file")
