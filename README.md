# 🛡️ Explainable Fake Review Detector

**🌐 Live Demo:** https://x-frs.netlify.app/

---

# 📖 Project Overview

Explainable Fake Review Detector is an Explainable AI (XAI) system developed by a multidisciplinary team to combat the growing challenge of fake online reviews on e-commerce platforms such as Amazon.

The project combines **traditional Machine Learning** and **Deep Learning** techniques to provide highly accurate and transparent predictions, enabling users to understand why a review is classified as **Fake** or **Genuine** while improving trust in online marketplaces.

---

# 🚀 Key Features

## Dual-Module Detection Architecture

### 🔹 Machine Learning Module

- Optimized **Stacking Ensemble**
- Support Vector Machine (SVM)
- Logistic Regression
- XGBoost
- Fast and efficient predictions

### 🔹 Deep Learning Module

- DistilBERT (Hugging Face)
- Higher prediction accuracy
- Premium prediction service

## Explainable AI (XAI)

Provides human-readable explanations for every prediction, allowing users to understand why a review has been classified as fake or genuine.

## End-to-End Data Pipeline

- Data Cleaning
- Text Normalization
- Feature Engineering
- Model Training
- Prediction Pipeline

---

# 🛠 Technologies & Tools

## Machine Learning & NLP

- Scikit-learn
- XGBoost
- Support Vector Machine (SVM)
- NLTK

## Deep Learning

- DistilBERT
- Hugging Face Transformers

## Data Processing

- Pandas
- NumPy
- Textstat

## Frontend

- React
- TypeScript
- Tailwind CSS

## Deployment

- Netlify

---

# 💻 Code Highlights

## 1️⃣ Advanced Linguistic Feature Engineering

Extracting readability and linguistic features to improve fake review detection.

```python
reviews["unique_word_ratio"] = reviews["text"].apply(
    lambda x: len(set(x.split())) / len(x.split()) if len(x.split()) > 0 else 0
)

reviews["flesch_reading_ease"] = reviews["text"].apply(
    lambda x: textstat.flesch_reading_ease(x) if len(x) > 0 else 0
)
```

---

## 2️⃣ Robust Preprocessing Pipeline

Applying TF-IDF vectorization and numeric feature transformations using a unified preprocessing pipeline.

```python
preprocessor = ColumnTransformer(
    transformers=[
        (
            "tfidf",
            TfidfVectorizer(
                ngram_range=(1,2),
                max_df=0.4,
                min_df=100,
                max_features=2000,
                sublinear_tf=True
            ),
            text_col
        ),
        ("num", PowerTransformer(), numeric_cols)
    ]
)
```

---

## 3️⃣ Stacking Ensemble Pipeline

Building an optimized Stacking Ensemble for fake review detection.

```python
base_estimators = [
    ('svm', LinearSVC(max_iter=2000)),
    ('xgb', XGBClassifier(
        n_estimators=150,
        learning_rate=0.1
    ))
]

stacking_model = StackingClassifier(
    estimators=base_estimators,
    final_estimator=LogisticRegression(),
    cv=5
)

full_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", stacking_model)
])

full_pipeline.fit(X_train, y_train)
```

---

# ⚙️ How to Run Locally

## 1. Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

python main.py
```

---

## 2. Frontend

```bash
cd UI

npm install

npm run dev
```

---

# 👨‍💻 My Contribution

As the Machine Learning Engineer in the project, I was responsible for:

- Designing and implementing the complete Machine Learning pipeline.
- Performing data preprocessing and text normalization.
- Engineering linguistic and statistical features.
- Developing and evaluating multiple classifiers:
  - Support Vector Machine (SVM)
  - Logistic Regression
  - XGBoost
- Building the final **Stacking Ensemble** model.
- Selecting the optimal model based on comprehensive performance evaluation.

---

# 📌 Future Improvements

- Deploy backend using cloud services.
- Add multilingual fake review detection.
- Fine-tune larger transformer models.
- Expand explainability with advanced XAI techniques.

---

# 👥 Team

Developed by a multidisciplinary graduation project team.

Machine Learning Module:
**Aly Ayman**

---
