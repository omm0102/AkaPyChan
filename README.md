# AakPyChan
AkaPyChan 是我們團隊的大學專題作品，主題為**互動式 Python 初學者教學平台**。 

在這個專案中，我主要負責 前端開發，包含版面設計、網頁結構規劃與互動效果實作。
- 前端 UI/版面設計  
- 網頁結構與切版  
- 按鈕互動邏輯與教學頁面呈現  

## 專案環境設定
### 建立虛擬環境
```bash
python3 -m venv myenv
virtualenv myenv
```
### 進入虛擬環境
```bash
source myenv/bin/activate
```
### 退出虛擬環境
```bash
deactivate
```
### 安裝相關套件
```bash
pip install -r requirements.txt
```
### 執行
```bash
python -m uvicorn main:app --reload
uvicorn main:app --reload
```
```bash
npm install
npm run dev
```
## 頁面展示
### 歡迎頁面
![歡迎頁面](https://github.com/omm0102/AakPyChan/blob/main/%E6%AD%A1%E8%BF%8E%E9%A0%81%E9%9D%A2.png)
### AI助教聊天室
![AI助教聊天室](https://github.com/omm0102/AakPyChan/blob/main/%E5%85%A8%E8%9E%A2%E5%B9%95AI%E5%8A%A9%E6%95%99%E8%81%8A%E5%A4%A9%E5%AE%A4.png)
### 教材學習頁面
![教材學習頁面](https://github.com/omm0102/AakPyChan/blob/main/%E6%95%99%E6%9D%90%E5%AD%B8%E7%BF%92%E9%A0%81%E9%9D%A2.png)
### 程式練習頁面
![程式練習頁面](https://github.com/omm0102/AakPyChan/blob/main/%E7%A8%8B%E5%BC%8F%E7%B7%B4%E7%BF%92%E9%A0%81%E9%9D%A2.png)
