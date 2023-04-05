# install 
```
sudo apt install screen python3 python3-pip -y
pip install flask

```
# dowload server.py , pay.sh and write.htlm
```
wget -O https://raw.githubusercontent.com/tunguyen9234/celestia/main/task/PayForBlob/wed_server.py && https://raw.githubusercontent.com/tunguyen9234/celestia/main/task/PayForBlob/pay.sh
mkdir $HOME/wed_pfb && cd $HOME/wed_pfb
wget -O https://raw.githubusercontent.com/tunguyen9234/celestia/main/task/PayForBlob/write.htlm
```
# start wed
```
