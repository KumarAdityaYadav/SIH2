from pathlib import Path
import json, os
import pandas as pd

ROOT=Path(__file__).resolve().parents[1]
paths={
 'questionnaire_684': Path(os.getenv('STREESURE_684_DATA','/mnt/data/PCOS DataSet.xlsx')),
 'clinical_541': Path(os.getenv('STREESURE_CLINICAL_DATA','/mnt/data/PCOS_data_without_infertility.xlsx')),
 'extended_2000': Path(os.getenv('STREESURE_EXTENDED_DATA','/mnt/data/PCOS_extended_dataset.csv')),
}
report={}
for name,p in paths.items():
    if not p.exists(): report[name]={'available':False,'path':str(p)}; continue
    if p.suffix.lower()=='.xlsx':
        xl=pd.ExcelFile(p); sheet='Full_new' if 'Full_new' in xl.sheet_names else xl.sheet_names[0]; df=pd.read_excel(p,sheet_name=sheet)
    else: df=pd.read_csv(p)
    df.columns=[str(c).strip() for c in df.columns]
    target=next((c for c in df.columns if c.lower() in {'pcos','pcos (y/n)'}),None)
    pid=next((c for c in df.columns if 'patient file no' in c.lower()),None)
    report[name]={
      'available':True,'path':str(p),'rows':len(df),'columns':len(df.columns),
      'target':target,'target_counts':df[target].value_counts(dropna=False).to_dict() if target else {},
      'missing_cells':int(df.isna().sum().sum()),
      'patient_id_column':pid,
      'unique_patient_ids':int(df[pid].nunique()) if pid else None,
      'duplicate_full_rows':int(df.duplicated().sum()),
    }
    if pid:
        counts=df.groupby(pid).size()
        report[name]['max_rows_per_patient']=int(counts.max())
        report[name]['patients_with_multiple_rows']=int((counts>1).sum())
(ROOT/'PHASE-14-DATA-AUDIT.json').write_text(json.dumps(report,indent=2,default=str))
print(json.dumps(report,indent=2,default=str))
