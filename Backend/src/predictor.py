# src/predictor.py
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    AutoModelForSeq2SeqLM,
)
from .config import CLASSIFIER_MODEL_PATH, LLM_MODEL_NAME, LABEL_MAP
from .rules import analyze_review_features


class ReviewDetector:
    def __init__(self, use_gpu=True):
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() and use_gpu else "cpu"
        )
        print(f"Loading models on {self.device}...")

        # 1. Load Classifier
        # Note: Backend needs to ensure this path exists
        self.tokenizer = AutoTokenizer.from_pretrained(CLASSIFIER_MODEL_PATH)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            CLASSIFIER_MODEL_PATH, output_attentions=True
        )
        self.model.to(self.device)
        self.model.eval()

        # 2. Load Optional LLM (FLAN-T5)
        # We load this lazily or upfront. Upfront is safer for servers.
        self.llm_tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL_NAME)
        self.llm_model = AutoModelForSeq2SeqLM.from_pretrained(LLM_MODEL_NAME)
        self.llm_model.to(self.device)

        print("Models loaded successfully.")

    def _get_attention_tokens(self, text, top_k=3):
        inputs = self.tokenizer(
            text, return_tensors="pt", truncation=True, max_length=256
        ).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs, output_attentions=True)

        attentions = outputs.attentions
        last_layer = attentions[-1][0]
        avg_attn = last_layer.mean(dim=0)
        cls_attn = avg_attn[0]

        token_ids = inputs["input_ids"][0]
        tokens = self.tokenizer.convert_ids_to_tokens(token_ids)

        scores = []
        for i, token in enumerate(tokens):
            if token not in ["[CLS]", "[SEP]", "[PAD]"] and not token.startswith("##"):
                scores.append((token, cls_attn[i].item()))

        scores.sort(key=lambda x: x[1], reverse=True)
        return [x[0] for x in scores[:top_k]]

    def _rephrase_with_llm(self, text, base_expl):
        prompt = (
            f"Rewrite this explanation to be helpful and friendly for a user.\n\n"
            f"Technical Explanation: {base_expl}\n\n"
            f"Review: {text}\n\n"
            "Friendly Response:"
        )
        input_ids = self.llm_tokenizer(prompt, return_tensors="pt").input_ids.to(
            self.device
        )
        outputs = self.llm_model.generate(input_ids, max_new_tokens=60)
        return self.llm_tokenizer.decode(outputs[0], skip_special_tokens=True)

    def predict(self, text: str, use_llm: bool = False):
        # Inference
        inputs = self.tokenizer(
            text, return_tensors="pt", truncation=True, max_length=256
        ).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs, output_attentions=True)
            probs = torch.softmax(outputs.logits, dim=-1)[0]

        pred_idx = torch.argmax(probs).item()
        pred_label = LABEL_MAP.get(pred_idx, "Unknown")
        confidence = probs[pred_idx].item()

        # XAI Components
        important_tokens = self._get_attention_tokens(text)
        reasons = analyze_review_features(text)

        # Construct Explanation
        if not reasons:
            if pred_label == "Fake":
                base_expl = f"Flagged as Fake based on internal model patterns. Focused on: {', '.join(important_tokens)}."
            else:
                base_expl = f"Classified as Real. The writing style appears natural. Focused on: {', '.join(important_tokens)}."
        else:
            base_expl = f"Flagged as {pred_label}. Detected issues: {'; '.join(reasons)}. Key words: {', '.join(important_tokens)}."

        # Final Wrapper
        final_explanation = base_expl
        if use_llm:
            try:
                final_explanation = self._rephrase_with_llm(text, base_expl)
            except Exception as e:
                print(f"LLM Error: {e}")

        return {
            "prediction": pred_label,
            "confidence": round(confidence, 4),
            "rule_reasons": reasons,
            "important_tokens": important_tokens,
            "explanation": final_explanation,
        }
