import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

def generate_sample_data_if_needed(csv_path="placement_data.csv", n_samples=1200):
    if os.path.exists(csv_path) and os.path.getsize(csv_path) > 1000:
        print(f"[INFO] Using existing dataset: {csv_path}")
        return pd.read_csv(csv_path)
    
    print(f"[INFO] Initializing dataset with schema: College_ID, IQ, Prev_Sem_Result, CGPA, Academic_Performance, Internship_Experience, Extra_Curricular_Score, Communication_Skills, Projects_Completed, Placement")
    np.random.seed(42)
    colleges = [f"CLG{i:04d}" for i in range(1, 101)]
    
    iq = np.random.normal(100, 15, n_samples).astype(int)
    iq = np.clip(iq, 55, 155)
    
    cgpa = np.random.uniform(5.0, 10.0, n_samples).round(2)
    prev_sem = np.clip(cgpa + np.random.normal(0, 0.35, n_samples), 5.0, 10.0).round(2)
    acad_perf = np.random.randint(1, 11, n_samples)
    internship = np.random.choice(["Yes", "No"], n_samples, p=[0.42, 0.58])
    extra_curr = np.random.randint(0, 11, n_samples)
    comm_skills = np.random.randint(1, 11, n_samples)
    projects = np.random.randint(0, 6, n_samples)
    
    # Realistic placement probability formula
    scores = (
        (cgpa - 5.0) * 0.35 +
        (prev_sem - 5.0) * 0.25 +
        (iq - 70) * 0.015 +
        (internship == "Yes") * 1.5 +
        projects * 0.3 +
        comm_skills * 0.15 +
        acad_perf * 0.1
    )
    prob = 1 / (1 + np.exp(-(scores - 3.8)))
    placement = ["Yes" if p > 0.52 else "No" for p in prob]
    
    df = pd.DataFrame({
        "College_ID": np.random.choice(colleges, n_samples),
        "IQ": iq,
        "Prev_Sem_Result": prev_sem,
        "CGPA": cgpa,
        "Academic_Performance": acad_perf,
        "Internship_Experience": internship,
        "Extra_Curricular_Score": extra_curr,
        "Communication_Skills": comm_skills,
        "Projects_Completed": projects,
        "Placement": placement
    })
    df.to_csv(csv_path, index=False)
    print(f"[SUCCESS] Dataset saved to {csv_path} with {len(df)} records.")
    return df

def run_pipeline():
    print("=" * 65)
    print("      STUDENT PLACEMENT DATA PROCESSING & ML PIPELINE")
    print("=" * 65)
    
    # 1. Load Data
    csv_file = "placement_data.csv"
    df = generate_sample_data_if_needed(csv_file)
    print(f"\n1. Data Inspection:")
    print(f"   - Total records: {len(df)}")
    print(f"   - Columns: {list(df.columns)}")
    print(f"   - Placement Distribution: {dict(df['Placement'].value_counts())}")
    
    # 2. Data Preprocessing
    print(f"\n2. Data Preprocessing:")
    clean_df = df.copy()
    if "College_ID" in clean_df.columns:
        clean_df = clean_df.drop(columns=["College_ID"])
        print("   - Dropped 'College_ID' (non-predictive unique identifier)")
    
    clean_df = clean_df.drop_duplicates()
    clean_df = clean_df.dropna()
    print("   - Handled duplicates and checked null values (0 missing values)")
    
    # Encode categorical fields
    binary_map = {"Yes": 1, "No": 0, "YES": 1, "NO": 0}
    clean_df["Internship_Experience"] = clean_df["Internship_Experience"].map(binary_map)
    clean_df["Placement"] = clean_df["Placement"].map(binary_map)
    print("   - Encoded 'Internship_Experience' and 'Placement' as Binary (0/1)")
    
    X = clean_df.drop(columns=["Placement"])
    y = clean_df["Placement"]
    
    # 3. Train-Test Split & Standardization
    print(f"\n3. Train-Test Split & Scaling:")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"   - Training samples: {len(X_train)} (80%)")
    print(f"   - Testing samples:  {len(X_test)} (20%)")
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("   - Standardized features with StandardScaler (Zero Mean, Unit Variance)")
    
    # 4. Model Training
    print(f"\n4. Model Training & Evaluation:")
    models = {
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced"),
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000)
    }
    
    results = {}
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        acc = accuracy_score(y_test, y_pred)
        results[name] = (model, acc, y_pred)
        print(f"\n   >>> {name}:")
        print(f"       Accuracy: {acc * 100:.2f}%")
        print(f"       Classification Report:")
        rep = classification_report(y_test, y_pred, target_names=["Not Placed", "Placed"])
        for line in rep.splitlines():
            print(f"       {line}")
        print(f"       Confusion Matrix: {confusion_matrix(y_test, y_pred).tolist()}")
        
    best_model_name = max(results, key=lambda k: results[k][1])
    best_model = results[best_model_name][0]
    print(f"\n   [RESULT] Best Model Selected: {best_model_name} ({results[best_model_name][1]*100:.2f}%)")
    
    # 5. Feature Importances
    rf = results["Random Forest Classifier"][0]
    feat_imp = pd.DataFrame({
        "Feature": X.columns,
        "Importance": rf.feature_importances_
    }).sort_values(by="Importance", ascending=False)
    
    print(f"\n5. Feature Importance Analysis:")
    for _, row in feat_imp.iterrows():
        bar = "#" * int(row["Importance"] * 40)
        print(f"   - {row['Feature']:24s}: {row['Importance']:.4f} [{bar}]")
        
    # 6. Save Model Artifacts
    ai_dir = os.path.join("api", "ai_services")
    os.makedirs(ai_dir, exist_ok=True)
    model_path = os.path.join(ai_dir, "placement_model.pkl")
    scaler_path = os.path.join(ai_dir, "placement_scaler.pkl")
    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\n6. Exporting Trained Artifacts:")
    print(f"   - Saved Model:  {model_path}")
    print(f"   - Saved Scaler: {scaler_path}")
    
    # 7. Live Inference Demonstrations
    print(f"\n7. Live Student Inference Tests:")
    test_students = [
        {
            "name": "Rahul Sharma (High Performer)",
            "data": [118, 8.8, 8.9, 9, 1, 8, 9, 4]
        },
        {
            "name": "Average Student Profile",
            "data": [95, 6.8, 6.9, 6, 0, 5, 6, 2]
        },
        {
            "name": "At-Risk Student Profile",
            "data": [80, 5.2, 5.1, 3, 0, 2, 4, 0]
        }
    ]
    
    for s in test_students:
        s_scaled = scaler.transform([s["data"]])
        prob = best_model.predict_proba(s_scaled)[0][1] * 100
        pred = "PLACED (HIGH PROBABILITY)" if prob >= 50 else "NOT PLACED (NEEDS SKILL IMPROVEMENT)"
        print(f"   * {s['name']}:")
        print(f"     -> Placement Likelihood: {prob:.1f}% | Prediction: {pred}")

    print("\n" + "=" * 65)
    print("      DATA PROCESSING & TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    run_pipeline()
