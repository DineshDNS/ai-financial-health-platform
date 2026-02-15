def clean_dataframe(df):
    df = df.dropna(how="all")
    df = df.fillna(0)
    return df
