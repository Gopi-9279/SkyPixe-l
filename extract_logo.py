import os
from PIL import Image, ImageDraw

def extract_logo():
    source_img_path = "1f8137f6-e691-4c9c-a855-9bd872d3f6aa.jpg"
    if not os.path.exists(source_img_path):
        print(f"File {source_img_path} not found!")
        return

    im = Image.open(source_img_path).convert("RGBA")
    
    # Inward-trimmed bounds to avoid any screenshot background ring artifacts
    left, upper, right, lower = 126, 566, 594, 1034
    width = right - left
    height = lower - upper
    
    cropped = im.crop((left, upper, right, lower))
    
    # Create smooth anti-aliased circular alpha mask
    mask_scale = 4
    big_size = (width * mask_scale, height * mask_scale)
    mask = Image.new("L", big_size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, big_size[0], big_size[1]), fill=255)
    mask = mask.resize((width, height), Image.Resampling.LANCZOS)
    
    circular_badge = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    circular_badge.paste(cropped, (0, 0), mask=mask)
    
    circular_badge.save("logo-badge.png", "PNG")
    circular_badge.resize((192, 192), Image.Resampling.LANCZOS).save("logo-192.png", "PNG")
    circular_badge.resize((64, 64), Image.Resampling.LANCZOS).save("logo-64.png", "PNG")
    circular_badge.resize((32, 32), Image.Resampling.LANCZOS).save("favicon.png", "PNG")
    
    print("Refined logo-badge.png successfully generated!")

if __name__ == "__main__":
    extract_logo()
