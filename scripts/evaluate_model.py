from pathlib import Path
import json
import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score, average_precision_score, accuracy_score, precision_recall_fscore_support

ROOT = Path(__file__).resolve().parents[1]
MODEL = json.loads((ROOT / 'ml' / 'model.json').read_text())
DATA = Path(__file__).resolve().parents[1].parent / 'data'

# Optional local paths; keep research datasets outside the repository.
clinical = Path(__import__('os').environ.get('STREESURE_CLINICAL_DATA', 'PCOS_data_without_infertility.xlsx'))
extended = Path(__import__('os').environ.get('STREESURE_EXTENDED_DATA', 'PCOS_extended_dataset.csv'))

def yn(x):
    return 1 if str(x).strip().lower() in {'1','yes','y','true'} else 0

def score(X):
    z = MODEL['intercept'] + ((X.to_numpy() - np.array(MODEL['mean'])) / np.array(MODEL['scale'])) @ np.array(MODEL['coefficients'])
    return 1/(1+np.exp(-np.clip(z,-35,35)))

def evaluate(df):
    df.columns = [str(c).strip() for c in df.columns]
    X = pd.DataFrame({
      'family_history_pcos': 0.0,
      'overweight': (pd.to_numeric(df['BMI'], errors='coerce') >= 25).astype(float),
      'cycle_irregular': df['Cycle(R/I)'].map(yn).astype(float),
      'weight_gain': df['Weight gain(Y/N)'].map(yn).astype(float),
      'facial_hair': df['hair growth(Y/N)'].map(yn).astype(float),
      'body_hair': df['hair growth(Y/N)'].map(yn).astype(float),
      'skin_darkening': df['Skin darkening (Y/N)'].map(yn).astype(float),
      'pimples': df['Pimples(Y/N)'].map(yn).astype(float),
      'hormonal_acne': 0.0,
      'hair_loss': df['Hair loss(Y/N)'].map(yn).astype(float),
      'weight_kg': pd.to_numeric(df['Weight (Kg)'], errors='coerce'),
      'height_m': pd.to_numeric(df['Height(Cm)'], errors='coerce')/100,
      'bmi': pd.to_numeric(df['BMI'], errors='coerce'),
    })
    for c in X.columns:
        X[c] = X[c].fillna(X[c].median() if c in {'weight_kg','height_m','bmi'} else 0)
    p = score(X)
    y = pd.to_numeric(df['PCOS (Y/N)'], errors='coerce')
    pred = p >= MODEL['threshold']
    pr = precision_recall_fscore_support(y, pred, average='binary')
    return {'rows': len(df), 'roc_auc': roc_auc_score(y,p), 'pr_auc': average_precision_score(y,p), 'accuracy': accuracy_score(y,pred), 'precision': pr[0], 'recall': pr[1], 'f1': pr[2]}

if clinical.exists():
    print('Clinical 541:', evaluate(pd.read_excel(clinical, sheet_name='Full_new')))
else:
    print(f'Missing {clinical}; place it beside the project to reproduce evaluation.')

if extended.exists():
    d = pd.read_csv(extended)
    print('Extended 2000:', evaluate(d))
else:
    print(f'Missing {extended}; place it beside the project to reproduce evaluation.')
