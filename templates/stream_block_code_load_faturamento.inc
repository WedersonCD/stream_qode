Fato_Faturamento:
LOAD 
    %DATA_CHAVE,
    %CENTRO_CHAVE,
    [Venda - Preço Venda],
    [Venda - Peças]
FROM
    [$(vGlobalDirDadoTransformadoCOMAnalitico)/Faturamento/Fato_Faturamento_202305.qvd]
(QVD);