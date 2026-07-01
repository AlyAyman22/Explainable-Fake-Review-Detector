# Explainable-Fake-Review-Detector
**Live Demo:** [Visit the Web Application](https://x-frs.netlify.app/)

## 📌 Project Overview
An Explainable AI (XAI) system developed by a multidisciplinary team to combat the growing challenge of fake online reviews on e-commerce platforms. This project leverages both traditional Machine Learning pipelines and advanced Deep Learning models to provide highly accurate and transparent predictions, empowering users to make informed decisions and improving trust in online marketplaces.

## ✨ Key Features
* **Dual-Module Detection Architecture:**
  * **Machine Learning Module:** Utilizes an optimized Stacking Ensemble (combining SVM, Logistic Regression, and XGBoost) for efficient, robust, and accessible predictions.
  * **Deep Learning Module:** Integrates **DistilBERT** to achieve superior prediction accuracy for advanced/premium users.
* **Explainable AI (XAI):** Implemented explainability features to provide users with clear, interpretable insights into *why* a specific review was classified as fake or genuine, ensuring high model transparency.
* **End-to-End Data Pipeline:** Built a highly efficient Python-based pipeline handling data cleaning, text normalization, and advanced feature engineering for seamless model training and inference.

## 🛠️ Technologies & Tools
* **Machine Learning & NLP:** Scikit-Learn, XGBoost, SVM, NLTK
* **Deep Learning:** DistilBERT (Hugging Face)
* **Data Processing:** Pandas, NumPy, Textstat
* **Frontend & UI:** React, TypeScript, Tailwind CSS
* **Deployment:** Netlify (Frontend)

## 💻 Code Highlights

### 1. Advanced Linguistic Feature Engineering
Extracting quantitative readability and structural features to capture the underlying style of the text, an essential step in distinguishing human-written from AI-generated reviews:
```python
# Extracting unique word ratios and readability scores
reviews["unique_word_ratio"] = reviews["text"].apply(lambda x: len(set(x.split())) / len(x.split()) if len(x.split()) > 0 else 0)
reviews["flesch_reading_ease"] = reviews["text"].apply(lambda x: textstat.flesch_reading_ease(x) if len(x) > 0 else 0)

preprocessor = ColumnTransformer(
    transformers=[
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),      
            max_df=0.4,              
            min_df=100,             
            max_features=2000,       
            sublinear_tf=True), text_col),
        ("num", PowerTransformer(), numeric_cols)
    ]
)
# Defining base estimators for the ensemble
base_estimators = [
    ('svm', LinearSVC(max_iter=2000)),
    ('xgb', XGBClassifier(n_estimators=150, learning_rate=0.1))
]

# Building the Stacking Classifier with a Logistic Regression meta-model
stacking_model = StackingClassifier(
    estimators=base_estimators,
    final_estimator=LogisticRegression(),
    cv=5
)

# Creating the final end-to-end pipeline
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', stacking_model)
])

# Training the entire pipeline
full_pipeline.fit(X_train, y_train)


cd backend
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install the required Python packages
pip install -r requirements.txt

# Run the backend server
python main.py

cd UI
# Install Node modules
npm install

# Start the React application
npm run dev
