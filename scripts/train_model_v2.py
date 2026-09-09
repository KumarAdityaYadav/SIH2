"""Reproducible StreeSure candidate-model training pipeline.
Keeps research data outside the repository. Does not promote the candidate automatically.
"""
from pathlib import Path
import json, os
import numpy as np, pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, precision_recall_fscore_support

ROOT=Path(__file__).resolve().parents[1]
DATA=Path(os.getenv('STREESURE_684_DATA','/mnt/data/PCOS DataSet.xlsx'))
OUT=ROOT/'ml/model-candidate-v2.json'
FEATURES=['family_history_pcos','overweight','cycle_irregular','weight_gain','facial_hair','body_hair','skin_darkening','pimples','hormonal_acne','hair_loss','weight_kg','height_m','bmi']

def yn(s): return s.astype(str).str.strip().str.lower().map({'yes':1,'no':0,'true':1,'false':0,'1':1,'0':0})

def load():
 d=pd.read_excel(DATA); d.columns=[str(c).strip() for c in d.columns]; d=d.drop_duplicates().reset_index(drop=True)
 X=pd.DataFrame(index=d.index)
 X['family_history_pcos']=d['Family_background'].astype(str).str.lower().map({'yes':1,'no':0,'i do not know':0})
 X['overweight']=yn(d['Overweight'])
 X['cycle_irregular']=d['Period_type'].astype(str).str.lower().eq('irregular').astype(float)
 X['weight_gain']=d['Gain_weight'].astype(str).str.lower().map({'yes':1,'no':0,'may be':.5})
 X['facial_hair']=yn(d['Excess_facial_hair']); X['body_hair']=yn(d['Excess_body_hair'])
 X['skin_darkening']=yn(d['Dark_area']); X['pimples']=yn(d['Pimple_face']); X['hormonal_acne']=yn(d['Hormonal_acne_face']); X['hair_loss']=yn(d['Losing_hair'])
 X['weight_kg']=pd.to_numeric(d['Weight(kg)'],errors='coerce'); X['height_m']=pd.to_numeric(d['Height(m)'],errors='coerce'); X['bmi']=pd.to_numeric(d['BMI(kg/m*m)'],errors='coerce')
 return X, d['PCOS'].astype(int)
X,y=load()
pipe=Pipeline([('imputer',SimpleImputer(strategy='median')),('scaler',StandardScaler()),('model',LogisticRegression(max_iter=3000,class_weight='balanced',C=.5,random_state=42))])
cv=StratifiedKFold(5,shuffle=True,random_state=42); p=cross_val_predict(pipe,X,y,cv=cv,method='predict_proba')[:,1]
best=None
for t in np.linspace(.1,.8,141):
 pr,re,f1,_=precision_recall_fscore_support(y,p>=t,average='binary',zero_division=0)
 if re>=.90 and (best is None or pr>best['precision']): best={'threshold':float(t),'precision':float(pr),'recall':float(re),'f1':float(f1)}
pipe.fit(X,y); scaler=pipe.named_steps['scaler']; model=pipe.named_steps['model']; med=pipe.named_steps['imputer'].statistics_
report={'modelVersion':'streesure-pcos-candidate-v2','modelType':'logistic_regression','target':'PCOS','threshold':best['threshold'],'features':[{'name':x} for x in FEATURES], 'imputerMedian':med.tolist(),'mean':scaler.mean_.tolist(),'scale':scaler.scale_.tolist(),'coefficients':model.coef_[0].tolist(),'intercept':float(model.intercept_[0]),'trainingData':{'rows':len(y),'positive':int(y.sum()),'negative':int((1-y).sum())},'validation':{'cv':5,'rocAuc':float(roc_auc_score(y,p)),'prAuc':float(average_precision_score(y,p)),'brier':float(brier_score_loss(y,p)),**best},'status':'candidate_not_promoted','reason':'Requires prospective and independent clinical validation before replacing production screening model.'}
OUT.write_text(json.dumps(report,indent=2)); print(json.dumps(report,indent=2))
