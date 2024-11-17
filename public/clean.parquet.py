import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# Parquet 파일 읽기
parquet_file = pq.read_table('chunk.parquet')

# 필요한 컬럼만 선택
selected_columns = ['doc_id', 'contents', 'path']
filtered_table = parquet_file.select(selected_columns)

# 새로운 Parquet 파일로 저장
pq.write_table(filtered_table, 'chunk2.parquet')