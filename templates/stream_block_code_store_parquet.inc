SET vMyTableName = My Table Name; 

STORE [$(vMyTableName)] INTO [lib://Commum_Store_Place/$(vMyTableName).parquet](parquet);
DROP TABLE [$(vMyTableName)];