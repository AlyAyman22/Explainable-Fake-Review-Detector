# src/rules.py
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk import pos_tag, word_tokenize
from .config import GENERIC_PHRASES, MARKETING_WORDS

# Ensure NLTK data is downloaded
try:
    nltk.data.find("tokenizers/punkt")
    nltk.data.find("sentiment/vader_lexicon.zip")
    nltk.data.find("taggers/averaged_perceptron_tagger_eng")
except LookupError:
    nltk.download("vader_lexicon")
    nltk.download("punkt")
    nltk.download("averaged_perceptron_tagger_eng")
    nltk.download("punkt_tab")


def analyze_review_features(text: str):
    """
    Analyzes text for linguistic patterns (Objectivity, Tone, Syntax).
    """
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(text)

    words = word_tokenize(text)
    tags = pos_tag(words)
    num_words = len(words)
    unique_words = len(set(w.lower() for w in words))

    reasons = []

    # --- 1. Sentiment & Tone ---
    if sentiment["compound"] > 0.95:
        reasons.append("suspiciously enthusiastic tone")
    elif sentiment["compound"] < -0.9:
        reasons.append("extremely aggressive negativity")

    # --- 2. Linguistic Patterns ---

    # Noun (NN) vs Adjective (JJ) Ratio
    nouns = [w for w, t in tags if t.startswith("NN")]
    adjectives = [w for w, t in tags if t.startswith("JJ")]

    if len(nouns) > 0:
        adj_noun_ratio = len(adjectives) / len(nouns)
        if adj_noun_ratio > 1.5:
            reasons.append("relies on vague praise rather than specific details")

    # First-Person Presence
    first_person = {"i", "me", "my", "mine", "we", "us", "our"}
    has_first_person = any(w.lower() in first_person for w in words)

    if not has_first_person and num_words > 15:
        reasons.append("sounds impersonal (lacks 'I' or 'my' statements)")

    # Repetitive Vocabulary
    if num_words > 10:
        ttr = unique_words / num_words
        if ttr < 0.5:
            reasons.append("repetitive vocabulary")

    # --- 3. Marketing & Syntax ---
    marketing_hits = [w for w in words if w.lower() in MARKETING_WORDS]
    if len(marketing_hits) >= 2:
        reasons.append("sounds like a sales pitch")

    text_lower = text.lower()
    for phrase in GENERIC_PHRASES:
        if phrase in text_lower:
            reasons.append(f"uses generic hype phrase: '{phrase}'")
            break

    if text.count("!") >= 3:
        reasons.append("excessive use of punctuation")

    caps_count = sum(1 for w in words if w.isupper() and len(w) > 1)
    if num_words > 0 and (caps_count / num_words) > 0.3:
        reasons.append("excessive use of capital letters")

    return reasons
