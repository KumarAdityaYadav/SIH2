from pathlib import Path
import json, os
import numpy as np, pandas as pd
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, precision_recall_fscore_support
ROOT=Path(__file__).resolve().parents[1]
M=json.loads((ROOT/'ml/model-candidate-v2.json').read_text())

def yn(s): return s.astype(str).str.strip().str.lower().map({'yes':1,'no':0,'true':1,'false':0,'1':1,'0':0}).fillna(0)
def score(X):
 a=X.to_numpy(float); z=M['intercept']+((a-np.array(M['mean']))/np.array(M['scale']))@np.array(M['coefficients']); return 1/(1+np.exp(-np.clip(z,-35,35)))
def map_external(df):
 df=df.copy(); df.columns=[str(c).strip() for c in df.columns]
 return pd.DataFrame({'family_history_pcos':0.0,'overweight':(pd.to_numeric(df['BMI'],errors='coerce')>=25).astype(float),'cycle_irregular':df['Cycle(R/I)'].astype(str).str.strip().str.lower().eq('i').astype(float),'weight_gain':yn(df['Weight gain(Y/N)']),'facial_hair':yn(df['hair growth(Y/N)']),'body_hair':yn(df['hair growth(Y/N)']),'skin_darkening':yn(df['Skin darkening (Y/N)']),'pimples':yn(df['Pimples(Y/N)']),'hormonal_acne':0.0,'hair_loss':yn(df['Hair loss(Y/N)']),'weight_kg':pd.to_numeric(df['Weight (Kg)'],errors='coerce'),'height_m':pd.to_numeric(df['Height(Cm)'],errors='coerce')/100,'bmi':pd.to_numeric(df['BMI'],errors='coerce')}).fillna(0)
def metrics(y,p):
 pred=p>=M['threshold']; pr,re,f1,_=precision_recall_fscore_support(y,pred,average='binary',zero_division=0)
 return {'roc_auc':roc_auc_score(y,p),'pr_auc':average_precision_score(y,p),'brier':brier_score_loss(y,p),'accuracy':float((pred==y).mean()),'precision':float(pr),'recall':float(re),'f1':float(f1),'threshold':M['threshold']}
res={}
p=Path(os.getenv('STREESURE_CLINICAL_DATA','/mnt/data/PCOS_data_without_infertility.xlsx'))
if p.exists():
 d=pd.read_excel(p,sheet_name='Full_new'); y=pd.to_numeric(d['PCOS (Y/N)'],errors='coerce'); res['clinical_541']=metrics(y,score(map_external(d)))
p=Path(os.getenv('STREESURE_EXTENDED_DATA','/mnt/data/PCOS_extended_dataset.csv'))
if p.exists():
 d=pd.read_csv(p); y=pd.to_numeric(d['PCOS (Y/N)'],errors='coerce'); pp=score(map_external(d)); pid=d['Patient File No.']; agg=pd.DataFrame({'pid':pid,'y':y,'p':pp}).groupby('pid').agg(y=('y','first'),p=('p','mean')); res['extended_2000_patient_aggregated']={'rows':len(d),'unique_patients':len(agg),**metrics(agg.y.to_numpy(),agg.p.to_numpy())}
(ROOT/'PHASE-14-EVALUATION-RESULTS.json').write_text(json.dumps(res,indent=2))
print(json.dumps(res,indent=2))
