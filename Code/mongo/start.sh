echo 'Starting Auth Instance'
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "D:\src\FDM06\mongo\userAuth\userAuth.cfg" &

echo 'Starting Stocks Instance'
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "D:\src\FDM06\mongo\stockDetails\stockDetails.cfg" &

echo 'Starting Verification Instance'
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "D:\src\FDM06\mongo\userVerification\userVerification.cfg" &

echo 'Starting Broker Instance'
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "D:\src\FDM06\mongo\broker\broker.cfg" &