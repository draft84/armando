@echo off
echo === PRUEBA DE IMPORTACION CON CURL ===
echo.
echo Subiendo archivo INGRESOS.xlsx al servidor...
echo.

curl -X POST http://localhost:8000/ingresos/import ^
  -F "file=@INGRESOS.xlsx" ^
  -F "_token=test" ^
  -H "Accept: application/json" ^
  -H "X-Requested-With: XMLHttpRequest" ^
  -v

echo.
echo.
echo === FIN DE LA PRUEBA ===
pause
