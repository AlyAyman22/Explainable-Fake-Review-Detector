# main.py
from src.predictor import ReviewDetector

if __name__ == "__main__":
    # Initialize logic (this loads models into RAM)
    detector = ReviewDetector()

    # Test
    sample_text = "BEST PRODUCT EVER!!! I highly recommend this to everyone."

    print("Analyzing...")
    result = detector.predict(sample_text, use_llm=True)

    import json

    print(json.dumps(result, indent=2))
