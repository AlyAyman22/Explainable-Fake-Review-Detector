# src/config.py

# Model Paths (Backend team can change these env variables or paths)
# You should place the model folder locally, not use Google Drive paths.
CLASSIFIER_MODEL_PATH = "./models/distilbert-fake-reviews"
LLM_MODEL_NAME = "google/flan-t5-small"

# Label Mapping
LABEL_MAP = {0: "Real", 1: "Fake"}

# Linguistic Analysis Constants
GENERIC_PHRASES = [
    "highly recommend",
    "best product ever",
    "game changer",
    "must buy",
    "worth every penny",
    "don't hesitate",
    "buy this now",
    "five stars",
    "amazing product",
]

MARKETING_WORDS = {
    "guarantee",
    "refund",
    "customer service",
    "shipping",
    "discount",
    "offer",
    "limited",
    "deal",
    "act now",
}
