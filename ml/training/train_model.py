import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

from feature_engineering import build_features


df = pd.read_csv("../data/fraudTrain.csv")

X = build_features(df)
y = df["is_fraud"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2
)

model = RandomForestClassifier(
    n_estimators=120,
    max_depth=10
)

model.fit(X_train, y_train)

joblib.dump(
    model,
    "../models/finshield_model.pkl"
)

print("✅ Model trained & saved")